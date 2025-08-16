# backend/app/__init__.py

import os 
from flask import Flask
from flask_cors import CORS
from .routes import api_bp

def create_app():
    """
    Fábrica de aplicação (Application Factory).
    Cria, configura e retorna a instância da aplicação Flask.
    """
    # Cria a instância principal da aplicação
    app = Flask(__name__)

    # --- CONFIGURAÇÕES DA APLICAÇÃO ---
    # Para corrigir a acentuação no JSON
    app.config['JSON_AS_ASCII'] = False
    
    # Para o JWT funcionar (lendo do arquivo .env)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    # Configura o CORS 
    CORS(app)

    # Registra o Blueprint na aplicação principal.
    app.register_blueprint(api_bp)

    return app