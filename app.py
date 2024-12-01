from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder

# Inicialización de Flask
app = Flask(__name__)

# Configuración del modelo
encoder = LabelEncoder()
model_rf = RandomForestClassifier(random_state=42)

# Cargar y preparar el modelo
df = pd.read_csv('accidentes_cercado_cochabamba.csv')

# Codificación del tipo de accidente
df['Tipo_Accidente'] = encoder.fit_transform(df['Tipo_Accidente'])

# Selección de características y variable objetivo
X = df[['Latitud', 'Longitud', 'Hora_Minutos']]
y = df['Tipo_Accidente']

# Entrenamiento del modelo
model_rf.fit(X, y)

@app.route('/predict', methods=['POST'])
def predict():
    # Obtener los datos de la solicitud
    data = request.get_json()
    latitud = data['latitud']
    longitud = data['longitud']
    hora_minutos = data['hora_minutos']

    # Realizar la predicción
    prediccion = model_rf.predict([[latitud, longitud, hora_minutos]])
    tipo_accidente = encoder.inverse_transform(prediccion)

    return jsonify({
        'prediccion': tipo_accidente[0],
        'probabilidad': model_rf.predict_proba([[latitud, longitud, hora_minutos]])[0].tolist()
    })

if __name__ == '__main__':
    app.run(debug=True)
