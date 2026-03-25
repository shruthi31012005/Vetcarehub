import pandas as pd
from sklearn import datasets
data = pd.read_csv("datasets/cleaned_animal_disease_prediction.csv")
print(data["Disease_Prediction"].value_counts().head(20))