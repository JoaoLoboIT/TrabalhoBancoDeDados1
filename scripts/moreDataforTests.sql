-- ====================================================================
-- SCRIPT DE POVOAMENTO (VERSÃO CORRIGIDA COM BUSCA DINÂMICA DE IDs)
-- ====================================================================

-- --- 1. ADICIONANDO NOVOS USUÁRIOS ---

-- Adicionando 5 Gestores
INSERT INTO Usuarios (nome, email, senha, tipo, departamento_id) VALUES
('Ana Beatriz Chaves', 'ana.gestor@instituicao.br', 'senhaGestor', 'gestor', 3),
('Marcos Vinicius Lima', 'marcos.gestor@instituicao.br', 'senhaGestor', 'gestor', 1),
('Fernanda Oliveira', 'fernanda.gestor@instituicao.br', 'senhaGestor', 'gestor', 2),
('Lucas Martins', 'lucas.martins@instituicao.br', 'senhaGestor', 'gestor', 5),
('Juliana Santos', 'juliana.santos@instituicao.br', 'senhaGestor', 'gestor', 4);

-- Adicionando 10 Professores
INSERT INTO Usuarios (nome, email, senha, tipo, departamento_id) VALUES
('Dr. Roberto Dias', 'roberto.dias@instituicao.br', 'senhaProf', 'professor', 1),
('Dra. Fabiana Alexandria', 'fabiana.alexandria@instituicao.br', 'senhaProf', 'professor', 2),
('Dr. Samuel Pinheiro', 'samuel.pinheiro@instituicao.br', 'senhaProf', 'professor', 3),
('Dr. Heitor Campos', 'heitor.campos@instituicao.br', 'senhaProf', 'professor', 1),
('Dra. Laura Mendes', 'laura.mendes@instituicao.br', 'senhaProf', 'professor', 2),
('Dr. Felipe Arruda', 'felipe.arruda@instituicao.br', 'senhaProf', 'professor', 5),
('Dra. Carolina Furtado', 'carolina.furtado@instituicao.br', 'senhaProf', 'professor', 4),
('Dr. Gustavo Pereira', 'gustavo.pereira@instituicao.br', 'senhaProf', 'professor', 1),
('Dra. Vanessa Rocha', 'vanessa.rocha@instituicao.br', 'senhaProf', 'professor', 3),
('Dr. Tiago Azevedo', 'tiago.azevedo@instituicao.br', 'senhaProf', 'professor', 2);

-- Adicionando 10 Alunos
INSERT INTO Usuarios (nome, email, senha, tipo, departamento_id) VALUES
('Mariana Ferreira', 'mariana.ferreira@aluno.br', 'senhaAluno', 'aluno', NULL),
('Rafael Souza', 'rafael.souza@aluno.br', 'senhaAluno', 'aluno', NULL),
('Gabriela Lima', 'gabriela.lima@aluno.br', 'senhaAluno', 'aluno', NULL),
('Bruno Gomes', 'bruno.gomes@aluno.br', 'senhaAluno', 'aluno', NULL),
('Leticia Almeida', 'leticia.almeida@aluno.br', 'senhaAluno', 'aluno', NULL),
('Diego Costa', 'diego.costa@aluno.br', 'senhaAluno', 'aluno', NULL),
('Amanda Ribeiro', 'amanda.ribeiro@aluno.br', 'senhaAluno', 'aluno', NULL),
('Pedro Henrique', 'pedro.henrique@aluno.br', 'senhaAluno', 'aluno', NULL),
('Sofia Carvalho', 'sofia.carvalho@aluno.br', 'senhaAluno', 'aluno', NULL),
('Matheus Castro', 'matheus.castro@aluno.br', 'senhaAluno', 'aluno', NULL);


-- --- 2. ADICIONANDO NOVOS ESPAÇOS ---
-- Agora usando subconsultas para buscar o ID do gestor pelo e-mail
INSERT INTO Espacos (nome, tipo, capacidade, gestor_responsavel_id) VALUES
('Sala de Reuniões A', 'sala_de_aula', 15, (SELECT usuario_id FROM Usuarios WHERE email = 'ana.gestor@instituicao.br')),
('Sala de Reuniões B', 'sala_de_aula', 15, (SELECT usuario_id FROM Usuarios WHERE email = 'ana.gestor@instituicao.br')),
('Laboratório de Física', 'laboratorio', 20, (SELECT usuario_id FROM Usuarios WHERE email = 'marcos.gestor@instituicao.br')),
('Laboratório de Eletrônica', 'laboratorio', 20, (SELECT usuario_id FROM Usuarios WHERE email = 'marcos.gestor@instituicao.br')),
('Auditório Setorial', 'auditorio', 100, (SELECT usuario_id FROM Usuarios WHERE email = 'fernanda.gestor@instituicao.br')),
('Sala de Aula 101', 'sala_de_aula', 50, (SELECT usuario_id FROM Usuarios WHERE email = 'lucas.martins@instituicao.br')),
('Sala de Aula 102', 'sala_de_aula', 50, (SELECT usuario_id FROM Usuarios WHERE email = 'lucas.martins@instituicao.br')),
('Sala de Estudo 03 (Silenciosa)', 'sala_de_aula', 20, (SELECT usuario_id FROM Usuarios WHERE email = 'juliana.santos@instituicao.br')),
('Anfiteatro', 'auditorio', 150, (SELECT usuario_id FROM Usuarios WHERE email = 'fernanda.gestor@instituicao.br')),
('Laboratório de Robótica', 'laboratorio', 18, (SELECT usuario_id FROM Usuarios WHERE email = 'marcos.gestor@instituicao.br'));


-- --- 3. ADICIONANDO 5 NOVAS RESERVAS ---
-- Usando subconsultas para buscar IDs de espaços e usuários por nome/email

-- Reserva PENDENTE para um laboratório (precisa de aprovação)
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
((SELECT espaco_id FROM Espacos WHERE nome = 'Laboratório de Robótica'),
 (SELECT usuario_id FROM Usuarios WHERE email = 'tiago.azevedo@instituicao.br'),
 '2025-09-10 09:00:00', '2025-09-10 11:00:00', 'Aula de introdução à robótica', 15, 'pendente');

-- Reserva CONFIRMADA para sala de estudos (aprovação automática)
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
((SELECT espaco_id FROM Espacos WHERE nome = 'Sala de Estudo 03 (Silenciosa)'),
 (SELECT usuario_id FROM Usuarios WHERE email = 'mariana.ferreira@aluno.br'),
 '2025-09-11 18:00:00', '2025-09-11 21:00:00', 'Estudo para prova de Cálculo II', 4, 'confirmada');

-- Reserva já CANCELADA pelo usuário
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
((SELECT espaco_id FROM Espacos WHERE nome = 'Sala de Reuniões A'),
 (SELECT usuario_id FROM Usuarios WHERE email = 'rafael.souza@aluno.br'),
 '2025-09-12 10:00:00', '2025-09-12 12:00:00', 'Reunião de grupo', 6, 'cancelada');
 
-- Reserva PENDENTE para o Anfiteatro, feita por uma professora
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
((SELECT espaco_id FROM Espacos WHERE nome = 'Anfiteatro'),
 (SELECT usuario_id FROM Usuarios WHERE email = 'fabiana.alexandria@instituicao.br'),
 '2025-10-01 19:00:00', '2025-10-01 22:00:00', 'Palestra sobre IA', 120, 'pendente');

-- Reserva já RECUSADA por um gestor
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status, aprovador_id) VALUES
((SELECT espaco_id FROM Espacos WHERE nome = 'Sala de Reuniões B'),
 (SELECT usuario_id FROM Usuarios WHERE email = 'bruno.gomes@aluno.br'),
 '2025-09-15 14:00:00', '2025-09-15 18:00:00', 'Evento de comitê estudantil', 12, 'recusada', (SELECT usuario_id FROM Usuarios WHERE email = 'carlos.gestor@instituicao.br'));