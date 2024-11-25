import librosa
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from transformers import AutoFeatureExtractor
from sklearnex import patch_sklearn, unpatch_sklearn
patch_sklearn()
import xgboost as xgb
import numpy as np
import gradio as gr
import parselmouth
import scipy.stats

MAX_DURATION = 2
SAMPLING_RATE = 16000
BATCH_SIZE = 2
NUM_CLASSES = 8
HIDDEN_DIM = 768
MAX_SEQ_LENGTH = MAX_DURATION * SAMPLING_RATE
MAX_FRAMES = 99
MAX_EPOCHS = 5
RAVDESS_CLASS_LABELS = ("angry", "disgust", "fear", "happy", "neutral", "sad", "surprise", "confidence")
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
        feature_lengths, (BATCH_SIZE, 1)
    )
    return pooled_state

class TFWav2Vec2ForAudioClassification(keras.Model):

    def __init__(self, model_checkpoint):
        super().__init__()
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

model_xgb = xgb.XGBClassifier(**xgb_params)
model_xgb.load_model('xgb.json')

def extract_praat_features(audio_path):
    snd = parselmouth.Sound(audio_path)
    pitch = snd.to_pitch()
    harmonicity = snd.to_harmonicity()
    intensity = snd.to_intensity()
    formants = snd.to_formant_burg()

    features = {
        'mean_pitch': pitch.get_mean(),
        'min_pitch': pitch.get_minimum(),
        'max_pitch': pitch.get_maximum(),
        'mean_intensity': intensity.get_mean(),
        'min_intensity': intensity.get_minimum(),
        'max_intensity': intensity.get_maximum(),
        'mean_hnr': harmonicity.get_mean(),
        'min_hnr': harmonicity.get_minimum(),
        'max_hnr': harmonicity.get_maximum(),
        'mean_formant1': formants.get_value_at_time(1, snd.xmin),
        'mean_formant2': formants.get_value_at_time(2, snd.xmin),
        'mean_formant3': formants.get_value_at_time(3, snd.xmin),
    }
    return features

def extract_mfcc_features(audio_path):
    y, sr = librosa.load(audio_path, sr=SAMPLING_RATE)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    features = {
        'mfcc_mean': np.mean(mfccs, axis=1),
        'mfcc_var': np.var(mfccs, axis=1),
        'mfcc_min': np.min(mfccs, axis=1),
        'mfcc_max': np.max(mfccs, axis=1),
        'mfcc_kurtosis': scipy.stats.kurtosis(mfccs, axis=1),
        'mfcc_skewness': scipy.stats.skew(mfccs, axis=1),
    }
    return features

def extract_nonlinear_features(audio_path):
    snd = parselmouth.Sound(audio_path)
    ltas = snd.to_ltas()
    features = {
        'ltas_mean': ltas.mean(),
        'ltas_var': ltas.var(),
        'ltas_min': ltas.min(),
        'ltas_max': ltas.max(),
        'ltas_kurtosis': scipy.stats.kurtosis(ltas.values),
        'ltas_skewness': scipy.stats.skew(ltas.values),
    }
    return features

def extract_pause_features(audio_path):
    y, sr = librosa.load(audio_path, sr=SAMPLING_RATE)
    intervals = librosa.effects.split(y, top_db=20)
    speech_durations = [(end - start) / sr for start, end in intervals]
    pause_durations = [(intervals[i][0] - intervals[i-1][1]) / sr for i in range(1, len(intervals))]
    features = {
        'speech_time': sum(speech_durations),
        'pause_time': sum(pause_durations),
        'num_pauses': len(pause_durations),
        'pause_frequency': len(pause_durations) / (sum(speech_durations) + sum(pause_durations)),
    }
    return features

def greet(name):
    audio_path = name[1]
    praat_features = extract_praat_features(audio_path)
    mfcc_features = extract_mfcc_features(audio_path)
    nonlinear_features = extract_nonlinear_features(audio_path)
    pause_features = extract_pause_features(audio_path)

    # Combine all features into a single feature vector
    features = {**praat_features, **mfcc_features, **nonlinear_features, **pause_features}
    feature_vector = np.concatenate([np.array(list(features.values()))])

    # Extract features using the feature extractor
    inp = feature_extractor(
        audio_path,
        sampling_rate=feature_extractor.sampling_rate,
        max_length=MAX_SEQ_LENGTH,
        truncation=True,
        padding=True,
    )
    inp = np.array([y for x, y in inp.items()])
    pred = wav2vec2_model.predict([inp[0], inp[1]])
    print("Data before XGBoost prediction:", pred)

    # Combine Wav2Vec2 features with additional features
    combined_features = np.concatenate([pred, feature_vector.reshape(1, -1)], axis=1)
    pred = model_xgb.predict(combined_features)
    lab = id2label[str(pred[0])]
    return lab

iface = gr.Interface(fn=greet, inputs="audio", outputs="text")
iface.launch()