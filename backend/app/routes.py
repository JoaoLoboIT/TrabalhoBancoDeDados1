# backend/app/routes.py

from flask import Blueprint, jsonify, request
from .models import get_all_espacos, get_espaco_by_id, create_espaco

api_bp = Blueprint('api_bp', __name__, url_prefix='/api')

# --- ROTA 1: Listar todos os espaços ---
@api_bp.route('/espacos', methods=['GET'])
def listar_espacos_route():
    """Endpoint para listar todos os espaços."""
    espacos = get_all_espacos()
    return jsonify(espacos)

# --- ROTA 2: Buscar um espaço por ID ---
@api_bp.route('/espacos/<int:espaco_id>', methods=['GET'])
def buscar_espaco_route(espaco_id):
    """Endpoint para buscar um espaço específico pelo seu ID."""
    espaco = get_espaco_by_id(espaco_id)
    if espaco is None:
        return jsonify({"erro": "Espaço não encontrado"}), 404
    return jsonify(espaco)

# --- ROTA 3: Criar um novo espaço ---
@api_bp.route('/espacos', methods=['POST'])
def criar_espaco_route():
    """Endpoint para criar um novo espaço."""
    dados = request.get_json()

    if not dados or 'nome' not in dados or 'tipo' not in dados or 'gestor_responsavel_id' not in dados:
        return jsonify({"erro": "Dados incompletos para criar o espaço"}), 400

    novo_espaco_id = create_espaco(dados)

    if novo_espaco_id is None:
        return jsonify({"erro": "Falha ao criar o espaço"}), 500

    # Busca os dados do espaço recém-criado para retornar na resposta
    novo_espaco = get_espaco_by_id(novo_espaco_id)
    
    # Retorna o objeto criado e o status HTTP 201 Created.
    return jsonify(novo_espaco), 201