# backend/app/routes.py

from flask import Blueprint, jsonify
from .models import get_all_espacos

# Criamos o Blueprint. Todos os endpoints definidos aqui terão o prefixo '/api'.
# Ex: a rota '/espacos' se tornará '/api/espacos'.
api_bp = Blueprint('api_bp', __name__, url_prefix='/api')

# Define a rota para /api/espacos que responde a requisições GET
@api_bp.route('/espacos', methods=['GET'])
def listar_espacos_route():
    """
    Endpoint para listar todos os espaços.
    Chama a função do modelo e retorna os dados em formato JSON.
    """
    # Chama a função que criamos em models.py para buscar os dados
    espacos = get_all_espacos()

    # Converte a lista de dicionários Python para uma resposta JSON
    return jsonify(espacos)

# Futuramente, outras rotas da API virão aqui:
# @api_bp.route('/reservas', methods=['POST'])
# def criar_reserva_route():
#     ...