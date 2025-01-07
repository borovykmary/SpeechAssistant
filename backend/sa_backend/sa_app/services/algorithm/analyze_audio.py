import gradio as gr
import os 
import numpy as np 
import librosa
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from transformers import AutoFeatureExtractor
from sklearnex import patch_sklearn, unpatch_sklearn
patch_sklearn()
import xgboost as xgb
import wave

MAX_DURATION = 20
# Sampling rate is the number of samples of audio recorded every second
SAMPLING_RATE = 16000
BATCH_SIZE = 2  # Batch-size for training and evaluating our model.
NUM_CLASSES = 8  # Number of classes our dataset will have (11 in our case).
HIDDEN_DIM = 768  # Dimension of our model output (768 in case of Wav2Vec 2.0 - Base).
MAX_SEQ_LENGTH = MAX_DURATION * SAMPLING_RATE  # Maximum length of the input audio file.
# Wav2Vec 2.0 results in an output frequency with a stride of about 20ms.
MAX_FRAMES = MAX_DURATION * 50 - 1
MAX_EPOCHS = 5  # Maximum number of training epochs.
RAVDESS_CLASS_LABELS = ("angry", "calm", "disgust", "fear", "happy", "neutral","sad","surprise")
MODEL_CHECKPOINT = "facebook/wav2vec2-base" 

labels = RAVDESS_CLASS_LABELS
label2id, id2label = dict(), dict()

from transformers import TFWav2Vec2Model


def mean_pool(hidden_states, feature_lengths):
    batch_size = tf.shape(hidden_states)[0]
    max_frames = tf.shape(hidden_states)[1]
    attention_mask = tf.sequence_mask(
        feature_lengths, maxlen=max_frames, dtype=tf.dtypes.int64
    )
    padding_mask = tf.cast(
        tf.reverse(tf.cumsum(tf.reverse(attention_mask, [-1]), -1), [-1]),
        dtype=tf.dtypes.bool,
    )
    hidden_states = tf.where(
        tf.broadcast_to(
            tf.expand_dims(~padding_mask, -1), (batch_size, max_frames, HIDDEN_DIM)
        ),
        0.0,
        hidden_states,
    )
    pooled_state = tf.math.reduce_sum(hidden_states, axis=1) / tf.reshape(
        tf.math.reduce_sum(tf.cast(padding_mask, dtype=tf.dtypes.float32), axis=1),
        [-1, 1],
    )
    return pooled_state


class TFWav2Vec2ForAudioClassification(keras.Model):

    def __init__(self, model_checkpoint):
        super().__init__()
        # Instantiate the Wav2Vec 2.0 model without the Classification-Head
        self.wav2vec2 = TFWav2Vec2Model.from_pretrained(
            model_checkpoint, apply_spec_augment=False, from_pt=True
        )
        self.pooling = layers.GlobalAveragePooling1D()
        self.flat = layers.Flatten()
        self.intermediate_layer_dropout = layers.Dropout(0.5)
      

    def call(self, inputs):
        hidden_states = self.wav2vec2(inputs[0])[0]
        if tf.is_tensor(inputs[1]):
            audio_lengths = tf.cumsum(inputs[1], -1)[:, -1]
            feature_lengths = self.wav2vec2.wav2vec2._get_feat_extract_output_lengths(
                audio_lengths
            )
            pooled_state = mean_pool(hidden_states, feature_lengths)
        else:
            pooled_state = self.pooling(hidden_states)

        intermediate_state = self.flat(self.intermediate_layer_dropout(pooled_state))

        return intermediate_state

wav2vec2_model = TFWav2Vec2ForAudioClassification(MODEL_CHECKPOINT)

for i, label in enumerate(labels):
    label2id[label] = str(i)
    id2label[str(i)] = label



feature_extractor = AutoFeatureExtractor.from_pretrained(
    MODEL_CHECKPOINT, return_attention_mask=True
)
xgb_params = {
    'objective':                    'binary:logistic',
    'predictor':                    'cpu_predictor',
    'disable_default_eval_metric':  'true',
}

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
XGB_MODEL_PATH = os.path.join(BASE_DIR, 'xgb.json')

model_xgb = xgb.XGBClassifier(**xgb_params)
model_xgb.load_model(XGB_MODEL_PATH)

def analyze_voice(file_path):
    try:
        with wave.open(file_path, 'rb') as wf:
            if wf.getnchannels() == 0:
                raise ValueError("File does not start with RIFF id")
            
            sr = wf.getframerate()
            if sr != SAMPLING_RATE:
                raise ValueError(f"Sample rate of the audio file ({sr}) does not match the expected sample rate ({SAMPLING_RATE}).")
            audio = np.frombuffer(wf.readframes(wf.getnframes()), dtype=np.int16)
    except Exception as e:
        raise ValueError(f"Error loading audio file: {e}")

    try:
        # Extract features using the feature extractor
        inputs = feature_extractor(
            audio,
            sampling_rate=SAMPLING_RATE,
            max_length=MAX_SEQ_LENGTH,
            truncation=True,
            padding=True,
            return_tensors="tf"
        )
        # Ensure the inputs are correctly shaped
        input_values = inputs["input_values"]
        attention_mask = inputs["attention_mask"]

        pred = wav2vec2_model.predict([input_values, attention_mask])
        probabilities = model_xgb.predict_proba(pred)
    
        results = []
        for prob in probabilities:
            emotion_prob = {id2label[str(i)]: f"{p*100:.2f}%" for i, p in enumerate(prob)}
            sorted_emotion_prob = dict(sorted(emotion_prob.items(), key=lambda item: item[1], reverse=True))
            results.append(sorted_emotion_prob)
        
        return results[0] if results else {}
    except Exception as e:
        raise ValueError(f"Error processing audio file: {e}")
    