# Sistema de Gerenciamento de Espaços 🏫

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-green)

## 📝 Descrição do Projeto

Este é o projeto desenvolvido para a disciplina de **Banco de Dados I** da Universidade Federal de Ouro Preto (UFOP). O objetivo é criar um sistema web completo para o gerenciamento e reserva de espaços físicos, como salas de aula, laboratórios e auditórios, aplicando os conceitos de modelagem de dados, scripts SQL e desenvolvimento de uma aplicação funcional com back-end, front-end e banco de dados.

## ✨ Funcionalidades

Abaixo está o checklist de funcionalidades do sistema.

### Gerenciamento de Espaços
- [X] **Listar todos os espaços:** Permite que qualquer usuário veja os espaços disponíveis no sistema.
- [X] **Buscar um espaço por ID:** Retorna os detalhes de um espaço específico.
- [X] **Cadastrar um novo espaço:** (Apenas para Gestores) Permite adicionar novos espaços ao banco de dados.
- [X] **Atualizar um espaço existente:** (Apenas para Gestores) Permite editar informações como nome e capacidade.
- [X] **Remover um espaço:** (Apenas para Gestores) Permite remover um espaço do sistema.

### Gerenciamento de Reservas
- [X] **Solicitar uma nova reserva:** Endpoint principal onde um solicitante (aluno ou professor) cria um pedido de reserva.
- [X] **Lógica de Aprovação Automática:** Reservas de "salas de estudo" são confirmadas automaticamente.
- [X] **Lógica de Conflito de Horários:** O sistema não permite a criação de uma reserva em um horário já ocupado.
- [X] **Visualizar reservas com filtros:** Permite que usuários vejam reservas por data, por espaço ou apenas as suas próprias.
- [X] **Aprovar ou Recusar uma reserva:** (Apenas para Gestores) Endpoint para alterar o status de uma reserva pendente.
- [X] **Cancelar uma reserva:** (Apenas para Solicitantes) Permite que o dono da reserva a cancele, respeitando a regra de antecedência.

### Gerenciamento de Usuários e Permissões
- [X] **Autenticação de Usuários:** Sistema de login (`/api/login`) que retorna um token JWT.
- [X] **Listar usuários:** (Apenas para Gestores) Visualizar todos os usuários cadastrados.
- [X] **Cadastrar, editar e remover usuários:** (Apenas para Gestores) Gerenciamento completo de contas de usuário.
- [X] **Lógica de Permissão por Tipo:** Garante que apenas professores possam reservar laboratórios e que alunos tenham um limite de 2 reservas ativas.
- [X] **Proteção de Rotas:** Endpoints de gestão são protegidos e só podem ser acessados com um token de usuário autorizado.

## 💻 Tecnologias Utilizadas

- **Back-end:**
  - ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
  - ![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
- **Front-end:**
  - ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  - ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
  - ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
- **Banco de Dados:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
- **Ambiente e Controle de Versão:**
  - ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  - ![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
  - ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)

---

## 🚀 Como Começar (Setup do Ambiente)

Siga os passos abaixo para configurar os ambientes de desenvolvimento.

### Configurando o Back-end

1.  **Navegue até a pasta do back-end:**
    ```bash
    cd backend
    ```
2.  **Crie e Ative o Ambiente Virtual:**
    ```bash
    # Criar
    python -m venv venv
    # Ativar (Windows)
    .\venv\Scripts\activate
    # Ativar (macOS/Linux)
    source venv/bin/activate
    ```
3.  **Instale as Dependências Python:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure as Variáveis de Ambiente:**
    - Copie o arquivo `backend/.env.example` para um novo arquivo `backend/.env`.
    - Abra o `.env` e preencha com suas credenciais do PostgreSQL.

### Configurando o Front-end

1.  **Pré-requisito:** Garanta que você tem o [Node.js](https://nodejs.org/) (versão LTS) instalado.
2.  **Navegue até a pasta do front-end:**
    ```bash
    # A partir da raiz do projeto
    cd frontend
    ```
3.  **Instale as Dependências JavaScript:**
    ```bash
    npm install
    ```

---

## ▶️ Como Rodar a Aplicação

Para o sistema funcionar, os dois servidores (back-end e front-end) precisam estar rodando **simultaneamente** em terminais separados.

### Rodando o Back-end (API)

1.  Abra um terminal.
2.  Navegue até a pasta `backend`.
3.  Ative o ambiente virtual (`.\venv\Scripts\activate`).
4.  Execute o comando:
    ```bash
    python run.py
    ```
5.  O servidor da API estará rodando em `http://127.0.0.1:5000`.

### Rodando o Front-end (Interface Gráfica)

1.  Abra um **novo** terminal.
2.  Navegue até a pasta `frontend`.
3.  Execute o comando:
    ```bash
    npm start
    ```
4.  A interface do usuário abrirá no seu navegador em `http://localhost:3000`.

## ↔️ Endpoints da API

| Método   | Endpoint                      | Descrição                                         | Protegido? |
| :------- | :---------------------------- | :------------------------------------------------ | :--------: |
| `POST`   | `/api/login`                  | Autentica um usuário e retorna um token JWT.        |     Não      |
| `GET`    | `/api/me`                     | Retorna os dados do usuário logado.                 |    **Sim** |
| `GET`    | `/api/espacos`                | Retorna a lista de todos os espaços.                |     Não      |
| `GET`    | `/api/espacos/<id>`           | Retorna os detalhes de um espaço específico.        |     Não      |
| `POST`   | `/api/espacos`                | Cria um novo espaço.                              |  **Gestor** |
| `PUT`    | `/api/espacos/<id>`           | Atualiza um espaço existente.                     |  **Gestor** |
| `DELETE` | `/api/espacos/<id>`           | Deleta um espaço.                                 |  **Gestor** |
| `GET`    | `/api/reservas`               | Lista reservas (com filtros).                     |    **Sim** |
| `POST`   | `/api/reservas`               | Cria uma nova reserva.                            |    **Sim** |
| `DELETE` | `/api/reservas/<id>`          | Cancela uma reserva.                              |    **Sim** |
| `PUT`    | `/api/reservas/<id>/status`   | Aprova ou recusa uma reserva.                     |  **Gestor** |
| `GET`    | `/api/usuarios`               | Lista todos os usuários.                          |  **Gestor** |
| `GET`    | `/api/usuarios/<id>`          | Retorna os detalhes de um usuário.                |  **Gestor** |
| `POST`   | `/api/usuarios`               | Cria um novo usuário.                             |  **Gestor** |
| `PUT`    | `/api/usuarios/<id>`          | Atualiza um usuário.                              |  **Gestor** |
| `DELETE` | `/api/usuarios/<id>`          | Deleta um usuário.                                |  **Gestor** |


## 👥 Autores

| Nome                  | GitHub                                    |
| :-------------------- | :---------------------------------------- |
| João Pedro            | https://github.com/JoaoLoboIT             |
| Rian Vaz              | https://github.com/RianVaz                |
| *Nome do Colega 2* | *(Link para o GitHub do Colega 2)* |