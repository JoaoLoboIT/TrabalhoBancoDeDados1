# backend/run.py

from app import create_app

# Chama a nossa fábrica para criar a aplicação
app = create_app()

# Este bloco só é executado quando o script é chamado diretamente (python run.py)
if __name__ == '__main__':
    # Inicia o servidor de desenvolvimento do Flask
    # debug=True faz com que o servidor reinicie automaticamente quando salvamos uma alteração no código.
    app.run(debug=True)