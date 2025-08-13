# backend/app/models.py

import psycopg2.extras
from .db import get_db_connection

def get_all_espacos():
    """
    Busca todos os espaços cadastrados no banco de dados e os retorna.
    """
    # Pega uma conexão da nossa função em db.py
    conn = get_db_connection()
    
    # Se a conexão falhar, não podemos continuar.
    if conn is None:
        return [] # Retorna uma lista vazia em caso de erro de conexão.

    # O cursor é o objeto que realmente executa os comandos SQL.
    # Usamos o 'DictCursor' para que os resultados venham como dicionários (mais fácil de trabalhar).
    cursor = conn.cursor(cursor_factory=psycopg2.extras.DictCursor)
    
    # Executa a query SQL para buscar todos os espaços, ordenados por nome.
    cursor.execute('SELECT * FROM Espacos ORDER BY nome ASC')
    
    # Pega todos os resultados da consulta que foi executada.
    espacos = cursor.fetchall()
    
    # É uma prática fundamental fechar o cursor e a conexão quando terminamos de usá-los.
    # Isso libera os recursos no servidor do banco de dados.
    cursor.close()
    conn.close()
    
    # Converte os resultados (que são DictRow) para dicionários puros do Python.
    # Isso garante que os dados possam ser facilmente convertidos para JSON mais tarde.
    return [dict(row) for row in espacos]

# No futuro, outras funções virão aqui:
# def get_espaco_by_id(espaco_id):
#     ...
#
# def create_reserva(dados_reserva):
#     ...