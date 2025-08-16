# backend/app/routes.py

import jwt
from .auth import token_required, role_required
from datetime import datetime, timedelta
from flask import Blueprint, jsonify, request, current_app
from .models import (
    get_all_espacos, get_espaco_by_id, create_espaco, update_espaco, delete_espaco,
    create_reserva, get_reserva_by_id, update_reserva_status, get_all_reservas, delete_reserva,
    get_all_usuarios, get_usuario_by_id, create_usuario, update_usuario, delete_usuario, authenticate_usuario
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
@token_required
@role_required('gestor') 
def criar_espaco_route(current_user):
    """Endpoint para criar um novo espaço."""
    dados = request.get_json()

    if not dados or 'nome' not in dados or 'tipo' not in dados or 'gestor_responsavel_id' not in dados:
        return jsonify({"erro": "Dados incompletos para criar o espaço"}), 400

    novo_espaco_id = create_espaco(dados)

    if novo_espaco_id is None:
        return jsonify({"erro": "Falha ao criar o espaço"}), 500

    novo_espaco = get_espaco_by_id(novo_espaco_id)
    return jsonify(novo_espaco), 201

# --- ROTA 4: Atualizar um espaço existente (PUT) ---
@api_bp.route('/espacos/<int:espaco_id>', methods=['PUT'])
@token_required
@role_required('gestor') 
def atualizar_espaco_route(current_user, espaco_id):
    """Endpoint para atualizar um espaço existente."""
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados ausentes"}), 400

    updated_rows = update_espaco(espaco_id, dados)

    if updated_rows == 0:
        return jsonify({"erro": "Espaço não encontrado"}), 404

    espaco_atualizado = get_espaco_by_id(espaco_id)
    return jsonify(espaco_atualizado)

# --- ROTA 5: Deletar um espaço (DELETE) ---
@api_bp.route('/espacos/<int:espaco_id>', methods=['DELETE'])
@token_required
@role_required('gestor') 
def deletar_espaco_route(current_user, espaco_id):
    """Endpoint para deletar um espaço."""
    deleted_rows = delete_espaco(espaco_id)

    if deleted_rows == 0:
        return jsonify({"erro": "Espaço não encontrado"}), 404

    return jsonify({"mensagem": "Espaço deletado com sucesso"})

# --- ROTA 6: Criar uma nova reserva (POST) ---
@api_bp.route('/reservas', methods=['POST'])
@token_required
def criar_reserva_route(current_user):
    """Endpoint para solicitar uma nova reserva."""
    dados = request.get_json()

    required_fields = ['espaco_id', 'solicitante_id', 'data_hora_inicio', 'data_hora_fim', 'num_participantes']
    if not all(field in dados for field in required_fields):
        return jsonify({"erro": "Dados incompletos para criar a reserva"}), 400

    resultado = create_reserva(dados)

    if "erro" in resultado:
        status_code = 409 if "conflito" in resultado["erro"].lower() else 400
        return jsonify(resultado), status_code

    nova_reserva = get_reserva_by_id(resultado['id'])
    return jsonify(nova_reserva), 201

# --- ROTA 7: Atualizar o status de uma reserva (PUT) ---
@api_bp.route('/reservas/<int:reserva_id>/status', methods=['PUT'])
@token_required
@role_required('gestor') 
def atualizar_status_reserva_route(current_user, reserva_id):
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

    reserva_atualizada = get_reserva_by_id(reserva_id)
    return jsonify(reserva_atualizada)

# --- ROTA 8: Listar todas as reservas com filtros (GET) ---
@api_bp.route('/reservas', methods=['GET'])
@token_required
def listar_reservas_route(current_user):
    """
    Endpoint para listar reservas, aceitando filtros como query parameters.
    Ex: /api/reservas?solicitante_id=5&status=confirmada
    """
    filtros = request.args.to_dict()
    reservas = get_all_reservas(filtros)
    return jsonify(reservas)

# --- ROTA 9: Deletar/Cancelar uma reserva (DELETE) ---
@api_bp.route('/reservas/<int:reserva_id>', methods=['DELETE'])
@token_required
def deletar_reserva_route(current_user, reserva_id):
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
        status_code = 403 if "permitida" in resultado["erro"] or "excedido" in resultado["erro"] else 404
        return jsonify(resultado), status_code

    return jsonify({"mensagem": "Reserva cancelada com sucesso"})

# --- ROTA 10: Listar todos os usuários (GET) ---
@api_bp.route('/usuarios', methods=['GET'])
@token_required
@role_required('gestor') 
def listar_usuarios_route(current_user):
    """Endpoint para listar todos os usuários."""
    usuarios = get_all_usuarios()
    return jsonify(usuarios)

# --- ROTA 11: Buscar um usuário por ID (GET) ---
@api_bp.route('/usuarios/<int:usuario_id>', methods=['GET'])
@token_required
@role_required('gestor') 
def buscar_usuario_route(current_user, usuario_id):
    """Endpoint para buscar um usuário específico pelo seu ID."""
    usuario = get_usuario_by_id(usuario_id)
    if usuario is None:
        return jsonify({"erro": "Usuário não encontrado"}), 404
    return jsonify(usuario)

# --- ROTA 12: Criar um novo usuário (POST) ---
@api_bp.route('/usuarios', methods=['POST'])
@token_required
@role_required('gestor') 
def criar_usuario_route(current_user):
    """Endpoint para criar um novo usuário."""
    dados = request.get_json()

    required_fields = ['nome', 'email', 'senha', 'tipo']
    if not all(field in dados for field in required_fields):
        return jsonify({"erro": "Dados incompletos"}), 400

    novo_usuario_id = create_usuario(dados)

    if novo_usuario_id is None:
        return jsonify({"erro": "Falha ao criar o usuário (verifique se o e-mail já existe)"}), 500

    novo_usuario = get_usuario_by_id(novo_usuario_id)
    return jsonify(novo_usuario), 201

# --- ROTA 13: Atualizar um usuário (PUT) ---
@api_bp.route('/usuarios/<int:usuario_id>', methods=['PUT'])
@token_required
@role_required('gestor') 
def atualizar_usuario_route(current_user, usuario_id):
    """Endpoint para atualizar um usuário existente."""
    dados = request.get_json()
    if not dados:
        return jsonify({"erro": "Dados ausentes"}), 400

    updated_rows = update_usuario(usuario_id, dados)

    if updated_rows == 0:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    usuario_atualizado = get_usuario_by_id(usuario_id)
    return jsonify(usuario_atualizado)

# --- ROTA 14: Deletar um usuário (DELETE) ---
@api_bp.route('/usuarios/<int:usuario_id>', methods=['DELETE'])
@token_required
@role_required('gestor') 
def deletar_usuario_route(current_user, usuario_id):
    """Endpoint para deletar um usuário."""
    deleted_rows = delete_usuario(usuario_id)

    if deleted_rows == 0:
        return jsonify({"erro": "Usuário não encontrado"}), 404

    return jsonify({"mensagem": "Usuário deletado com sucesso"})

# --- ROTA 15: Login de usuário (POST) ---
@api_bp.route('/login', methods=['POST'])
def login_route():
    """
    Endpoint de login. Recebe email e senha, retorna um token JWT se forem válidos.
    """
    dados = request.get_json()
    if not dados or 'email' not in dados or 'senha' not in dados:
        return jsonify({"erro": "E-mail e senha são obrigatórios"}), 400

    email = dados['email']
    senha = dados['senha']

    usuario = authenticate_usuario(email, senha)

    if usuario is None:
        return jsonify({"erro": "Credenciais inválidas"}), 401

    try:
        payload = {
            'iat': datetime.utcnow(),
            'exp': datetime.utcnow() + timedelta(days=1),
            'sub': str(usuario['usuario_id']),
            'tipo': usuario['tipo']
        }
        token = jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256'
        )
        return jsonify({"token": token})
    except Exception as e:
        print(f"Erro ao gerar token: {e}")
        return jsonify({"erro": "Falha ao processar o login"}), 500

# --- ROTA Adicional: Buscar dados do usuário logado ---
@api_bp.route('/me', methods=['GET'])
@token_required
def get_current_user_data(current_user):
    """
    Endpoint que retorna os dados completos do usuário
    identificado pelo token.
    """
    # O ID do usuário vem do token, que já foi decodificado pelo decorator
    usuario_id = int(current_user['sub'])

    usuario = get_usuario_by_id(usuario_id)

    if usuario is None:
        return jsonify({"erro": "Usuário do token não encontrado"}), 404

    return jsonify(usuario)