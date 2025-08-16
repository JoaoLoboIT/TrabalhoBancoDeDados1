# backend/app/auth.py

from functools import wraps
import jwt
from flask import request, jsonify, current_app

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Verifica se o token foi enviado no header 'x-access-token'
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return jsonify({'erro': 'Token de autenticação está faltando!'}), 401

        try:
            # Decodifica o token para pegar os dados do usuário
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = data
        except:
            return jsonify({'erro': 'Token é inválido ou expirou!'}), 401

        # Passa os dados do usuário decodificado para a rota
        return f(current_user, *args, **kwargs)

    return decorated

# Um segundo decorator para verificar o cargo (role)
def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            # Verifica se o tipo do usuário no token é o tipo necessário
            if current_user.get('tipo') != role:
                return jsonify({'erro': 'Permissão negada para esta ação!'}), 403 # 403 Forbidden
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator