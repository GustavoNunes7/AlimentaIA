from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from datetime import datetime

app = FastAPI(title="🌱 ALIMENTAIA - Modo Vencedor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("random_forest_model.pkl")

class Login(BaseModel):
    usuario: str
    senha: str

class Previsao(BaseModel):
    temperatura: float
    num_alunos: int
    aceitacao: float
    dia_semana: int
    horario: int

@app.post("/login")
async def login(d: Login):
    if d.usuario == "gestor" and d.senha == "escola123":
        return {"sucesso": True}
    raise HTTPException(401, "Login inválido")

@app.post("/prever")
async def prever(d: Previsao):
    df = pd.DataFrame([{
        "temperatura": d.temperatura,
        "num_pessoas": d.num_alunos,
        "aceitacao": d.aceitacao,
        "dia_semana": d.dia_semana
    }])
    
    pred = model.predict(df)[0]
    
    return {
        "desperdicio": round(pred, 2),
        "alerta": "🔴 ALTA PROBABILIDADE DE DESPERDÍCIO" if pred > 8 else "🟢 Previsão Excelente",
        "sugestao": f"Reduzir produção em {round(pred*1.3)}%" if pred > 8 else "Produção ideal",
        "economia": f"R$ {round(pred*15, 2)}",
        "horario": d.horario
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)