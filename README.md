# Sistema de Gerenciamento de Espaços 🏫

![Status do Projeto](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

## 📝 Descrição do Projeto

Este é o projeto desenvolvido para a disciplina de **Banco de Dados I** da Universidade Federal de Ouro Preto (UFOP). O objetivo é criar um sistema web completo para o gerenciamento e reserva de espaços físicos, como salas de aula, laboratórios e auditórios, aplicando os conceitos de modelagem de dados, scripts SQL e desenvolvimento de uma aplicação funcional com back-end, front-end e banco de dados.

## ✨ Funcionalidades

Abaixo está o checklist de funcionalidades planejadas para o sistema, com base no documento de requisitos.

### Gerenciamento de Espaços
- [X] **Listar todos os espaços:** Permite que qualquer usuário veja os espaços disponíveis no sistema.
- [X] **Buscar um espaço por ID:** Retorna os detalhes de um espaço específico.
- [X] **Cadastrar um novo espaço:** (Apenas para Gestores) Permite adicionar novos espaços ao banco de dados.
- [ ] **Atualizar um espaço existente:** (Apenas para Gestores) Permite editar informações como nome e capacidade.
- [ ] **Remover um espaço:** (Apenas para Gestores) Permite remover um espaço do sistema.

### Gerenciamento de Reservas
- [ ] **Solicitar uma nova reserva:** Endpoint principal onde um solicitante (aluno ou professor) cria um pedido de reserva.
- [ ] **Lógica de Aprovação Automática:** Reservas de "salas de estudo" devem ser confirmadas automaticamente.
- [ ] **Lógica de Conflito de Horários:** O sistema não deve permitir a criação de uma reserva em um horário já ocupado.
- [ ] **Visualizar reservas com filtros:** Permitir que usuários vejam reservas por data, por espaço ou apenas as suas próprias.
- [ ] **Aprovar ou Recusar uma reserva:** (Apenas para Gestores) Endpoint para alterar o status de uma reserva pendente.
- [ ] **Cancelar uma reserva:** (Apenas para Solicitantes) Permite que o dono da reserva a cancele, respeitando a regra de antecedência.

### Gerenciamento de Usuários e Permissões
- [ ] **Autenticação de Usuários:** Sistema de login para identificar o usuário e seu tipo (aluno, professor, gestor).
- [ ] **Listar usuários:** (Apenas para Gestores) Visualizar todos os usuários cadastrados.
- [ ] **Cadastrar, editar e remover usuários:** (Apenas para Gestores) Gerenciamento completo de contas de usuário.
- [ ] **Lógica de Permissão por Tipo:** Garantir que apenas professores possam reservar laboratórios e que alunos tenham um limite de reservas ativas.

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
| Rian Vaz | https://github.com/RianVaz |
| *Nome do Colega 2* | *(Link para o GitHub do Colega 2)* |