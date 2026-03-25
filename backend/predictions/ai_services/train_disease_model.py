import pandas as pd
import os
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score

from sklearn.ensemble import RandomForestClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.svm import SVC
from sklearn.linear_model import LogisticRegression

from sklearn.ensemble import StackingClassifier

BASE_DIR = os.path.dirname(__file__)

# Load dataset
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "cleaned_animal_disease_prediction.csv")

data = pd.read_csv(DATASET_PATH)

# Target column
target = "Disease_Prediction"

X = data.drop(target, axis=1)
y = data[target]

# Encode categorical features
X = pd.get_dummies(X)

# Encode target labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# -------------------------
# Base models
# -------------------------

base_models = [

    ("rf", RandomForestClassifier(n_estimators=200)),

    ("gb", GradientBoostingClassifier()),

    ("svm", SVC(probability=True))
]

# -------------------------
# Meta model
# -------------------------

meta_model = LogisticRegression()

# -------------------------
# Stacking model
# -------------------------

stacking_model = StackingClassifier(

    estimators=base_models,

    final_estimator=meta_model,

    cv=5
)

# Train
stacking_model.fit(X_train, y_train)

# Evaluate
preds = stacking_model.predict(X_test)

accuracy = accuracy_score(y_test, preds)

feature_columns = X.columns

print("Stacking Model Accuracy:", accuracy)

# Save model
joblib.dump(feature_columns, "models/feature_columns.pkl")
joblib.dump(stacking_model, "models/disease_model.pkl")

# Save label encoder
joblib.dump(label_encoder, "models/disease_label_encoder.pkl")

print("Model saved successfully")
# import pandas as pd
# import os
# import joblib

# from sklearn.model_selection import train_test_split
# from sklearn.ensemble import RandomForestClassifier

# BASE_DIR = os.path.dirname(__file__)

# DATASET_PATH = os.path.join(BASE_DIR, "datasets", "cleaned_animal_disease_prediction.csv")
# MODEL_PATH = os.path.join(BASE_DIR, "models", "disease_model.pkl")

# # ---------------------
# # Load dataset
# # ---------------------
# data = pd.read_csv(DATASET_PATH)

# print("Dataset Loaded")
# print(data.dtypes)

# # Target column
# target_column = "Disease_Prediction"

# # ---------------------
# # Convert text columns
# # ---------------------

# # Convert categorical text columns into numbers
# data = pd.get_dummies(data)

# print("\nAfter encoding:")
# print(data.head())

# # ---------------------
# # Separate features/target
# # ---------------------

# y = data.filter(like="Disease_Prediction_")

# X = data.drop(y.columns, axis=1)

# # Convert one-hot target back to single label
# y = y.idxmax(axis=1)

# # ---------------------
# # Train/Test split
# # ---------------------

# X_train, X_test, y_train, y_test = train_test_split(
#     X, y, test_size=0.2, random_state=42
# )

# # ---------------------
# # Train model
# # ---------------------

# model = RandomForestClassifier(
#     n_estimators=300,
#     random_state=42
# )

# model.fit(X_train, y_train)

# # ---------------------
# # Save model
# # ---------------------

# joblib.dump(model, MODEL_PATH)

# print("\nDisease model trained successfully")
# print("Model saved to:", MODEL_PATH)