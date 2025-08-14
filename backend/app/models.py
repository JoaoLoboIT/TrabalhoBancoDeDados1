# backend/app/models.py

import psycopg2.extras
from .db import get_db_connection

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