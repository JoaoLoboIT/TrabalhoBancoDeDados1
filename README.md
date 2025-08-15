# Sistema de Gerenciamento de Espaços 🏫

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 📝 Descrição do Projeto

Este é o projeto desenvolvido para a disciplina de **Banco de Dados I** da Universidade Federal de Ouro Preto (UFOP). O objetivo é criar um sistema web completo para o gerenciamento e reserva de espaços físicos, como salas de aula, laboratórios e auditórios, aplicando os conceitos de modelagem de dados, scripts SQL e desenvolvimento de uma aplicação funcional com back-end, front-end e banco de dados.

## ✨ Funcionalidades (Planejadas)

- [ ] Cadastro de Espaços, Usuários e Departamentos.
- [ ] Sistema de Reserva de Espaços com status (pendente, confirmada, cancelada).
- [ ] Autenticação de Usuários (login/logout).
- [ ] Painel de controle para gestores aprovarem/recusarem reservas.
- [ ] Filtros para visualização de reservas por data, espaço ou status.
- [ ] Interface gráfica para interação com o sistema.

## 💻 Tecnologias Utilizadas

- **Back-end:**
  - ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  - ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
- **Banco de Dados:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- **Controle de Versão:**
  - ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
  - ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 🚀 Como Começar (Setup do Ambiente)

Siga os passos abaixo para configurar e rodar o ambiente de desenvolvimento do **back-end**.

### Pré-requisitos

- [Python 3.8+](https://www.python.org/downloads/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/downloads)

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/JoaoLoboIT/TrabalhoBancoDeDados1.git
    cd TrabalhoBancoDeDados1
    ```

2.  **Navegue até a pasta do back-end:**
    ```bash
    cd backend
    ```

3.  **Crie o Ambiente Virtual:**
    Isso cria uma pasta `venv` para isolar as dependências do projeto.
    ```bash
    python -m venv venv
    ```

4.  **Ative o Ambiente Virtual:**
    - No **Windows**:
      ```bash
      .\venv\Scripts\activate
      ```
    - No **macOS / Linux**:
      ```bash
      source venv/bin/activate
      ```
    *Seu terminal deve agora mostrar `(venv)` no início da linha.*

5.  **Instale as Dependências:**
    Este comando lê o arquivo `requirements.txt` e instala todas as bibliotecas Python necessárias.
    ```bash
    pip install -r requirements.txt
    ```

6.  **Configure as Variáveis de Ambiente:**
    As credenciais do banco de dados são armazenadas em um arquivo `.env` que não é enviado para o GitHub por segurança.
    - Copie o arquivo de exemplo `.env.example` para criar o seu arquivo `.env` local.
      - No **Windows**:
        ```bash
        copy .env.example .env
        ```
      - No **macOS / Linux**:
        ```bash
        cp .env.example .env
        ```
    - **Abra o novo arquivo `.env`** e substitua os valores pelas suas credenciais do PostgreSQL.

---

## ▶️ Como Rodar a Aplicação

Com o ambiente configurado, siga os passos abaixo para iniciar o servidor da API.

1.  Garanta que seu ambiente virtual `(venv)` esteja **ativo**.
2.  Garanta que você esteja na pasta `backend`.
3.  Execute o comando:
    ```bash
    python run.py
    ```
4.  O servidor da API estará rodando em `http://127.0.0.1:5000`.

## ↔️ Endpoints da API

Abaixo estão os endpoints atualmente disponíveis na API.

| Método | Endpoint         | Descrição                                         |
| :----- | :--------------- | :------------------------------------------------ |
| `GET`  | `/api/espacos`   | Retorna uma lista de todos os espaços cadastrados. |
| *...* | *...* | *(Adicionar novas rotas aqui no futuro)* |


## 👥 Autores

| Nome                  | GitHub                                    |
| :-------------------- | :---------------------------------------- |
| João Pedro           | https://github.com/JoaoLoboIT                  |
| *Rian Vaz* | *(https://github.com/RianVaz)* |
| *Nome do Colega 2* | *(Link para o GitHub do Colega 2)* |