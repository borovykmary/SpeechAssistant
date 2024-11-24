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


MAX_DURATION = 2
# Sampling rate is the number of samples of audio recorded every second
SAMPLING_RATE = 16000
BATCH_SIZE = 2  # Batch-size for training and evaluating our model.
NUM_CLASSES = 8  # Number of classes our dataset will have (11 in our case).
HIDDEN_DIM = 768  # Dimension of our model output (768 in case of Wav2Vec 2.0 - Base).
MAX_SEQ_LENGTH = MAX_DURATION * SAMPLING_RATE  # Maximum length of the input audio file.
# Wav2Vec 2.0 results in an output frequency with a stride of about 20ms.
MAX_FRAMES = 99
MAX_EPOCHS = 5  # Maximum number of training epochs.
RAVDESS_CLASS_LABELS = ("angry", "disgust", "fear", "happy", "neutral","sad","surprise","confidence")
MODEL_CHECKPOINT = "facebook/wav2vec2-base" 

labels = RAVDESS_CLASS_LABELS
label2id, id2label = dict(), dict()

from transformers import TFWav2Vec2Model


def mean_pool(hidden_states, feature_lengths):
    attenion_mask = tf.sequence_mask(
        feature_lengths, maxlen=MAX_FRAMES, dtype=tf.dtypes.int64
    )
    padding_mask = tf.cast(
        tf.reverse(tf.cumsum(tf.reverse(attenion_mask, [-1]), -1), [-1]),
        dtype=tf.dtypes.bool,
    )
    hidden_states = tf.where(
        tf.broadcast_to(
            tf.expand_dims(~padding_mask, -1), (BATCH_SIZE, MAX_FRAMES, HIDDEN_DIM)
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

model_xgb= xgb.XGBClassifier(**xgb_params)
model_xgb.load_model('xgb.json')
def greet(name):
  inp =  feature_extractor(
    name[1],
    sampling_rate=feature_extractor.sampling_rate,
    max_length=MAX_SEQ_LENGTH,
    truncation=True,
    padding=True,
  )
  inp = np.array([y for x,y in inp.items()])
  pred = wav2vec2_model.predict([inp[0],inp[1]])
  pred = model_xgb.predict(pred)
  lab = id2label[str(pred[0])]
  return lab

iface = gr.Interface(fn=greet, inputs="audio", outputs="text")
iface.launch()