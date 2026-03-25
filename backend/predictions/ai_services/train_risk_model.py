import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

BASE_DIR = os.path.dirname(__file__)

DATASET_PATH = os.path.join(BASE_DIR, "datasets", "risk_prediction.csv")

MODEL_PATH = os.path.join(BASE_DIR, "models", "risk_model.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "models", "risk_feature_columns.pkl")

# -------------------------
# Load dataset
# -------------------------

data = pd.read_csv(DATASET_PATH)

print("Risk dataset loaded")
print(data.shape)

# -------------------------
# Target column
# -------------------------

target_column = "event_status"

# -------------------------
# Remove date columns
# -------------------------

date_columns = [
    "event_started_on",
    "event_confirmed_on",
    "event_ended_on",
    "outbreak_start_date",
    "outbreak_end_date",
    "last_occurrence",
    "reported_on"
]

for col in date_columns:
    if col in data.columns:
        data = data.drop(col, axis=1)

# -------------------------
# One hot encode categorical data
# -------------------------

data = pd.get_dummies(data)

print("After encoding:", data.shape)

# -------------------------
# Split features and target
# -------------------------

y = data.filter(like="event_status_")
X = data.drop(y.columns, axis=1)

# Convert one hot target to single label
y = y.idxmax(axis=1)

# -------------------------
# Train test split
# -------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.2,
    random_state=42
)

# -------------------------
# Train model
# -------------------------

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42
)

model.fit(X_train, y_train)

# -------------------------
# Save model
# -------------------------

joblib.dump(model, MODEL_PATH)

# Save feature columns
joblib.dump(X.columns, FEATURE_PATH)

print("\nRisk model trained successfully")
print("Model saved at:", MODEL_PATH)
print("Feature columns saved at:", FEATURE_PATH)