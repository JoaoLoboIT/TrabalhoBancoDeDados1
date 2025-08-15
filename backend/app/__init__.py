# backend/app/__init__.py

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

    app.config['JSON_AS_ASCII'] = False
    
    # Configura o CORS para permitir que o frontend (em outro domínio) acesse a API
    CORS(app)

    # Registra o Blueprint na aplicação principal.
    # Agora a aplicação sabe sobre as rotas que definimos em routes.py
    app.register_blueprint(api_bp)

    return app