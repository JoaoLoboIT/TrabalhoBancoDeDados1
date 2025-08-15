# backend/app/routes.py

from flask import Blueprint, jsonify, request
from .models import (
    get_all_espacos, get_espaco_by_id, create_espaco, update_espaco, delete_espaco,
    create_reserva, get_reserva_by_id, update_reserva_status, get_all_reservas, delete_reserva
)

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

# --- ROTA 4: Atualizar um espaço existente (PUT) ---
@api_bp.route('/espacos/<int:espaco_id>', methods=['PUT'])
def atualizar_espaco_route(espaco_id):
    """Endpoint para atualizar um espaço existente."""
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados ausentes"}), 400

    updated_rows = update_espaco(espaco_id, dados)

    if updated_rows == 0:
        return jsonify({"erro": "Espaço não encontrado"}), 404

    # Busca o espaço atualizado para retornar na resposta
    espaco_atualizado = get_espaco_by_id(espaco_id)
    return jsonify(espaco_atualizado)

# --- ROTA 5: Deletar um espaço (DELETE) ---
@api_bp.route('/espacos/<int:espaco_id>', methods=['DELETE'])
def deletar_espaco_route(espaco_id):
    """Endpoint para deletar um espaço."""
    deleted_rows = delete_espaco(espaco_id)

    if deleted_rows == 0:
        return jsonify({"erro": "Espaço não encontrado"}), 404

    # Retorna uma mensagem de sucesso e o status 200 OK.
    return jsonify({"mensagem": "Espaço deletado com sucesso"})

# --- ROTA 6: Criar uma nova reserva (POST) ---
@api_bp.route('/reservas', methods=['POST'])
def criar_reserva_route():
    """Endpoint para solicitar uma nova reserva."""
    dados = request.get_json()

    # Validação básica dos campos obrigatórios
    required_fields = ['espaco_id', 'solicitante_id', 'data_hora_inicio', 'data_hora_fim', 'num_participantes']
    if not all(field in dados for field in required_fields):
        return jsonify({"erro": "Dados incompletos para criar a reserva"}), 400

    resultado = create_reserva(dados)

    if "erro" in resultado:
        # Retorna 409 Conflict para erros de regra de negócio, e 400 para outros
        status_code = 409 if "conflito" in resultado["erro"].lower() else 400
        return jsonify(resultado), status_code

    # Se a criação foi bem-sucedida, busca a reserva completa para retornar
    nova_reserva = get_reserva_by_id(resultado['id'])
    return jsonify(nova_reserva), 201

# --- ROTA 7: Atualizar o status de uma reserva (PUT) ---
@api_bp.route('/reservas/<int:reserva_id>/status', methods=['PUT'])
def atualizar_status_reserva_route(reserva_id):
    """
    Endpoint para um gestor aprovar ou recusar uma reserva.
    Espera um JSON com o novo 'status' e o 'aprovador_id'.
    """
    dados = request.get_json()

    if not dados or 'status' not in dados or 'aprovador_id' not in dados:
        return jsonify({"erro": "Dados incompletos: 'status' e 'aprovador_id' são obrigatórios"}), 400

    novo_status = dados['status']
    aprovador_id = dados['aprovador_id']

    updated_rows = update_reserva_status(reserva_id, novo_status, aprovador_id)

    if updated_rows == 0:
        return jsonify({"erro": "Reserva não encontrada ou status inválido"}), 404

    # Busca a reserva atualizada para retornar na resposta
    reserva_atualizada = get_reserva_by_id(reserva_id)
    return jsonify(reserva_atualizada)

# --- ROTA 8: Listar todas as reservas com filtros (GET) ---
@api_bp.route('/reservas', methods=['GET'])
def listar_reservas_route():
    """
    Endpoint para listar reservas, aceitando filtros como query parameters.
    Ex: /api/reservas?solicitante_id=5&status=confirmada
    """
    # request.args pega os parâmetros da URL (ex: ?chave=valor)
    filtros = request.args.to_dict()
    reservas = get_all_reservas(filtros)
    return jsonify(reservas)

# --- ROTA 9: Deletar/Cancelar uma reserva (DELETE) ---
@api_bp.route('/reservas/<int:reserva_id>', methods=['DELETE'])
def deletar_reserva_route(reserva_id):
    """
    Endpoint para um solicitante cancelar sua própria reserva.
    A identidade do solicitante viria de um sistema de login,
    mas por enquanto vamos simular enviando no corpo da requisição.
    """
    dados = request.get_json()
    if not dados or 'solicitante_id' not in dados:
        return jsonify({"erro": "O 'solicitante_id' é obrigatório para cancelar"}), 400

    solicitante_id = dados['solicitante_id']
    resultado = delete_reserva(reserva_id, solicitante_id)

    if "erro" in resultado:
        # Retorna 403 Forbidden para erros de permissão
        status_code = 403 if "permitida" in resultado["erro"] or "excedido" in resultado["erro"] else 404
        return jsonify(resultado), status_code

    return jsonify({"mensagem": "Reserva cancelada com sucesso"})
