# backend/app/db.py

import os
import psycopg2
from dotenv import load_dotenv

# Carrega as variáveis de ambiente do arquivo .env para a memória do sistema
load_dotenv(encoding='utf-8')

def get_db_connection():
    """
    Cria e retorna uma nova conexão com o banco de dados.
    A função pega os dados de conexão das variáveis de ambiente
    que foram carregadas do arquivo .env.
    """
    try:
        conn = psycopg2.connect(
            host=os.getenv('DB_HOST'),
            database=os.getenv('DB_DATABASE'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            port=os.getenv('DB_PORT')
        )
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None