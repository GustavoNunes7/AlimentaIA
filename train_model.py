import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib

print("🚀 Treinando modelo ALIMENTAIA...")

data = {
    'temperatura': [23,28,31,19,25,27,22,30,24,29,21,26],
    'num_pessoas': [160,205,190,110,175,220,140,200,165,195,130,180],
    'aceitacao': [8.5,7.2,6.8,9.4,8.1,7.5,9.0,6.9,8.3,7.8,9.2,8.0],
    'dia_semana': [0,1,2,3,4,5,6,1,2,3,4,5],
    'desperdicio': [9.4,16.2,19.8,4.5,10.7,15.3,7.1,18.4,11.2,14.8,6.9,12.5]
}

df = pd.DataFrame(data)
X = df.drop('desperdicio', axis=1)
y = df['desperdicio']

model = RandomForestRegressor(n_estimators=500, random_state=42)
model.fit(X, y)

joblib.dump(model, "random_forest_model.pkl")
print("✅ Modelo treinado com sucesso!")