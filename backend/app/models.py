# backend/app/models.py

import psycopg2.extras
from .db import get_db_connection
from datetime import datetime, timedelta

# --- FUNÇÃO 1: Listar todos os espaços ---
def get_all_espacos():
    """
    Busca todos os espaços cadastrados no banco de dados e os retorna.
    """
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    cursor.execute('SELECT * FROM Espacos ORDER BY nome ASC')
    espacos = cursor.fetchall()
    cursor.close()
    conn.close()
    return [dict(row) for row in espacos]

# --- FUNÇÃO 2: Buscar um espaço por ID ---
def get_espaco_by_id(espaco_id):
    """Busca um único espaço pelo seu ID."""
    conn = get_db_connection()
    if conn is None:
        return None

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Usar %s para passar parâmetros previne ataques de SQL Injection.
    cursor.execute('SELECT * FROM Espacos WHERE espaco_id = %s', (espaco_id,))
    
    espaco = cursor.fetchone()
    
    cursor.close()
    conn.close()
    
    return dict(espaco) if espaco else None

# --- FUNÇÃO 3: Criar um novo espaço ---
def create_espaco(dados_espaco):
    """Cria um novo espaço no banco de dados."""
    conn = get_db_connection()
    if conn is None:
        return None

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    sql = """
        INSERT INTO Espacos (nome, tipo, capacidade, gestor_responsavel_id)
        VALUES (%s, %s, %s, %s)
        RETURNING espaco_id;
    """
    
    try:
        cursor.execute(sql, (
            dados_espaco['nome'],
            dados_espaco['tipo'],
            dados_espaco.get('capacidade'),
            dados_espaco['gestor_responsavel_id']
        ))
        
        novo_espaco_id = cursor.fetchone()['espaco_id']
        conn.commit()
        cursor.close()
        conn.close()
        
        return novo_espaco_id
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao criar espaço: {e}")
        return None

# --- FUNÇÃO 4: Atualizar um espaço ---
def update_espaco(espaco_id, dados_espaco):
    """Atualiza um espaço existente no banco de dados."""
    conn = get_db_connection()
    if conn is None:
        return 0

    cursor = conn.cursor()

    sql = """
        UPDATE Espacos
        SET nome = %s, tipo = %s, capacidade = %s, gestor_responsavel_id = %s
        WHERE espaco_id = %s;
    """

    try:
        cursor.execute(sql, (
            dados_espaco['nome'],
            dados_espaco['tipo'],
            dados_espaco.get('capacidade'),
            dados_espaco['gestor_responsavel_id'],
            espaco_id
        ))

        # rowcount retorna o número de linhas afetadas pelo comando.
        # Será 1 se a atualização foi bem-sucedida, 0 se o espaco_id não foi encontrado.
        updated_rows = cursor.rowcount

        conn.commit()
        cursor.close()
        conn.close()

        return updated_rows
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao atualizar espaço: {e}")
        return 0

# --- FUNÇÃO 5: Deletar um espaço ---
def delete_espaco(espaco_id):
    """Deleta um espaço do banco de dados."""
    conn = get_db_connection()
    if conn is None:
        return 0

    cursor = conn.cursor()

    sql = "DELETE FROM Espacos WHERE espaco_id = %s;"

    try:
        cursor.execute(sql, (espaco_id,))
        deleted_rows = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()

        return deleted_rows
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao deletar espaço: {e}")
        return 0

# --- FUNÇÃO 6: Buscar uma reserva por ID ---
def get_reserva_by_id(reserva_id):
    """Busca uma única reserva pelo seu ID."""
    conn = get_db_connection()
    if conn is None:
        return None

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Vamos fazer um JOIN para trazer informações úteis do espaço e do solicitante
    sql = """
        SELECT r.*, e.nome as espaco_nome, u.nome as solicitante_nome
        FROM Reservas r
        JOIN Espacos e ON r.espaco_id = e.espaco_id
        JOIN Usuarios u ON r.solicitante_id = u.usuario_id
        WHERE r.reserva_id = %s;
    """
    cursor.execute(sql, (reserva_id,))
    reserva = cursor.fetchone()

    cursor.close()
    conn.close()
    return dict(reserva) if reserva else None

# --- FUNÇÃO 7: Criar uma nova reserva com validações ---
def create_reserva(dados_reserva):
    """Cria uma nova reserva no banco de dados após validar as regras de negócio."""
    conn = get_db_connection()
    if conn is None:
        return {"erro": "Falha na conexão com o banco de dados"}

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        # --- VALIDAÇÃO 1: O espaço e o usuário existem? ---
        espaco = get_espaco_by_id(dados_reserva['espaco_id'])
        if not espaco:
            return {"erro": "Espaço não encontrado."}

        # Precisamos dos dados do usuário para as próximas validações
        cursor.execute("SELECT * FROM Usuarios WHERE usuario_id = %s", (dados_reserva['solicitante_id'],))
        solicitante = cursor.fetchone()
        if not solicitante:
            return {"erro": "Solicitante não encontrado."}

        # --- VALIDAÇÃO 2: Capacidade do espaço ---
        if espaco['capacidade'] and dados_reserva['num_participantes'] > espaco['capacidade']:
            return {"erro": f"Número de participantes ({dados_reserva['num_participantes']}) excede a capacidade do espaço ({espaco['capacidade']})."}

        # --- VALIDAÇÃO 3: Laboratórios apenas para professores ---
        if espaco['tipo'] == 'laboratorio' and solicitante['tipo'] != 'professor':
            return {"erro": "Apenas professores podem reservar laboratórios."}

        # --- VALIDAÇÃO 4: Conflito de horários ---
        cursor.execute("""
            SELECT reserva_id FROM Reservas
            WHERE espaco_id = %s AND status IN ('confirmada', 'pendente') AND
            (data_hora_inicio < %s AND data_hora_fim > %s)
        """, (dados_reserva['espaco_id'], dados_reserva['data_hora_fim'], dados_reserva['data_hora_inicio']))

        if cursor.fetchone():
            return {"erro": "O espaço já está reservado neste horário."}

        # --- LÓGICA DE APROVAÇÃO AUTOMÁTICA ---
        status_inicial = 'pendente'
        if espaco['tipo'] == 'sala_de_aula': # Assumindo que salas de estudo são um tipo de sala_de_aula
            status_inicial = 'confirmada'

        # --- INSERÇÃO NO BANCO ---
        sql = """
            INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING reserva_id;
        """
        cursor.execute(sql, (
            dados_reserva['espaco_id'],
            dados_reserva['solicitante_id'],
            dados_reserva['data_hora_inicio'],
            dados_reserva['data_hora_fim'],
            dados_reserva.get('finalidade'),
            dados_reserva['num_participantes'],
            status_inicial
        ))

        novo_reserva_id = cursor.fetchone()['reserva_id']
        conn.commit()

        # Retorna o ID em caso de sucesso
        return {"id": novo_reserva_id}

    except Exception as e:
        conn.rollback()
        print(f"Erro ao criar reserva: {e}")
        return {"erro": "Ocorreu um erro interno ao processar a reserva."}
    finally:
        cursor.close()
        conn.close()
        
# --- FUNÇÃO 8: Atualizar o status de uma reserva ---
def update_reserva_status(reserva_id, novo_status, aprovador_id):
    """
    Atualiza o status de uma reserva (ex: de 'pendente' para 'confirmada').
    Registra o ID do gestor que realizou a ação.
    """
    conn = get_db_connection()
    if conn is None:
        return 0

    cursor = conn.cursor()

    # Validação para garantir que o novo status é um dos valores permitidos.
    # Isso previne que a API tente inserir um status inválido no banco.
    status_permitidos = ['confirmada', 'cancelada', 'recusada']
    if novo_status not in status_permitidos:
        return 0 # Retorna 0 se o status for inválido

    sql = """
        UPDATE Reservas
        SET status = %s, aprovador_id = %s
        WHERE reserva_id = %s;
    """

    try:
        cursor.execute(sql, (novo_status, aprovador_id, reserva_id))
        updated_rows = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()

        return updated_rows
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao atualizar status da reserva: {e}")
        return 0
    
# --- FUNÇÃO 9: Listar todas as reservas com filtros ---
def get_all_reservas(filtros):
    """Busca todas as reservas, aplicando filtros dinâmicos."""
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Base da query
    sql = """
        SELECT r.*, e.nome as espaco_nome, u.nome as solicitante_nome
        FROM Reservas r
        JOIN Espacos e ON r.espaco_id = e.espaco_id
        JOIN Usuarios u ON r.solicitante_id = u.usuario_id
    """

    # Montagem dinâmica da cláusula WHERE e dos parâmetros
    where_clauses = []
    params = []

    if filtros.get('espaco_id'):
        where_clauses.append("r.espaco_id = %s")
        params.append(filtros['espaco_id'])

    if filtros.get('solicitante_id'):
        where_clauses.append("r.solicitante_id = %s")
        params.append(filtros['solicitante_id'])

    if filtros.get('status'):
        where_clauses.append("r.status = %s")
        params.append(filtros['status'])

    if where_clauses:
        sql += " WHERE " + " AND ".join(where_clauses)

    sql += " ORDER BY r.data_hora_inicio DESC;"

    cursor.execute(sql, tuple(params))
    reservas = cursor.fetchall()

    cursor.close()
    conn.close()
    return [dict(row) for row in reservas]

# --- FUNÇÃO 10: Deletar/Cancelar uma reserva ---
def delete_reserva(reserva_id, solicitante_id):
    """Deleta uma reserva, validando a regra de antecedência de 12h."""
    conn = get_db_connection()
    if conn is None:
        return {"erro": "Falha na conexão com o banco de dados"}

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    try:
        # Primeiro, busca a reserva para validar as regras
        cursor.execute("SELECT * FROM Reservas WHERE reserva_id = %s", (reserva_id,))
        reserva = cursor.fetchone()

        if not reserva:
            return {"erro": "Reserva não encontrada."}

        # Validação: Apenas o próprio solicitante pode cancelar
        if reserva['solicitante_id'] != solicitante_id:
            return {"erro": "Ação não permitida. Você não é o solicitante desta reserva."}

        # Validação: Regra de negócio das 12 horas de antecedência
        if datetime.now() > (reserva['data_hora_inicio'] - timedelta(hours=12)):
            return {"erro": "Cancelamento não permitido. O prazo de 12 horas de antecedência foi excedido."}

        # Se todas as validações passaram, deleta a reserva
        cursor.execute("DELETE FROM Reservas WHERE reserva_id = %s", (reserva_id,))
        deleted_rows = cursor.rowcount
        conn.commit()

        return {"sucesso": deleted_rows}

    except Exception as e:
        conn.rollback()
        print(f"Erro ao deletar reserva: {e}")
        return {"erro": "Ocorreu um erro interno ao processar o cancelamento."}
    finally:
        cursor.close()
        conn.close()

# --- FUNÇÃO 11: Listar todos os usuários ---
def get_all_usuarios():
    """Busca todos os usuários cadastrados, sem incluir a senha."""
    conn = get_db_connection()
    if conn is None:
        return []

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # Selecionamos todos os campos, EXCETO a senha.
    sql = """
        SELECT u.usuario_id, u.nome, u.email, u.tipo, d.nome as departamento_nome
        FROM Usuarios u
        LEFT JOIN Departamentos d ON u.departamento_id = d.departamento_id
        ORDER BY u.nome ASC;
    """
    cursor.execute(sql)
    usuarios = cursor.fetchall()

    cursor.close()
    conn.close()
    return [dict(row) for row in usuarios]

# --- FUNÇÃO 12: Buscar um usuário por ID ---
def get_usuario_by_id(usuario_id):
    """Busca um único usuário pelo seu ID, sem incluir a senha."""
    conn = get_db_connection()
    if conn is None:
        return None

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    sql = """
        SELECT u.usuario_id, u.nome, u.email, u.tipo, d.nome as departamento_nome
        FROM Usuarios u
        LEFT JOIN Departamentos d ON u.departamento_id = d.departamento_id
        WHERE u.usuario_id = %s;
    """
    cursor.execute(sql, (usuario_id,))
    usuario = cursor.fetchone()

    cursor.close()
    conn.close()
    return dict(usuario) if usuario else None

# --- FUNÇÃO 13: Criar um novo usuário ---
def create_usuario(dados_usuario):
    """Cria um novo usuário, salvando a senha em texto puro."""
    conn = get_db_connection()
    if conn is None:
        return None

    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)

    # A senha original é pega diretamente dos dados recebidos
    senha_pura = dados_usuario['senha']

    sql = """
        INSERT INTO Usuarios (nome, email, senha, tipo, departamento_id)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING usuario_id;
    """

    try:
        cursor.execute(sql, (
            dados_usuario['nome'],
            dados_usuario['email'],
            senha_pura, # Salva a senha em TEXTO PURO
            dados_usuario['tipo'],
            dados_usuario.get('departamento_id')
        ))

        novo_usuario_id = cursor.fetchone()['usuario_id']
        conn.commit()
        cursor.close()
        conn.close()

        return novo_usuario_id
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao criar usuário: {e}")
        return None
    
# --- FUNÇÃO 14: Atualizar um usuário ---
def update_usuario(usuario_id, dados_usuario):
    """Atualiza um usuário existente no banco de dados."""
    conn = get_db_connection()
    if conn is None:
        return 0

    cursor = conn.cursor()

    # Nota: Esta função não atualiza a senha.
    # A alteração de senha geralmente é um processo separado e mais seguro.
    sql = """
        UPDATE Usuarios
        SET nome = %s, email = %s, tipo = %s, departamento_id = %s
        WHERE usuario_id = %s;
    """

    try:
        cursor.execute(sql, (
            dados_usuario['nome'],
            dados_usuario['email'],
            dados_usuario['tipo'],
            dados_usuario.get('departamento_id'),
            usuario_id
        ))
        updated_rows = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()
        return updated_rows
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao atualizar usuário: {e}")
        return 0

# --- FUNÇÃO 15: Deletar um usuário ---
def delete_usuario(usuario_id):
    """Deleta um usuário do banco de dados."""
    conn = get_db_connection()
    if conn is None:
        return 0

    cursor = conn.cursor()
    sql = "DELETE FROM Usuarios WHERE usuario_id = %s;"

    try:
        cursor.execute(sql, (usuario_id,))
        deleted_rows = cursor.rowcount
        conn.commit()
        cursor.close()
        conn.close()
        return deleted_rows
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        print(f"Erro ao deletar usuário: {e}")
        return 0