CREATE TABLE departamentos (
    departamento_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO departamentos (nome) VALUES
('Engenharia de Computação'),
('Ciência da Computação'),
('Administração'),
('Diretoria Acadêmica'),
('Secretaria Geral');

select * from departamentos

----------------------------------------------------

CREATE TABLE Usuarios (
    usuario_id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE,
    senha VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('aluno', 'professor', 'gestor')),
    departamento_id INT,
    FOREIGN KEY (departamento_id) REFERENCES Departamentos(departamento_id)
);


INSERT INTO Usuarios (nome, email, senha, tipo, departamento_id) VALUES
('Carlos Andrade', 'carlos.gestor@instituicao.br', 'senha123', 'gestor', 1),
('Mariana Costa', 'mariana.gestor@instituicao.br', 'senha123', 'gestor', 4),
('Dr. Ricardo Borges', 'ricardo.borges@instituicao.br', 'senha456', 'professor', 1),
('Dra. Ana Pereira', 'ana.pereira@instituicao.br', 'senha456', 'professor', 2),
('João Silva', 'joao.silva@aluno.br', 'senha789', 'aluno', NULL),
('Beatriz Lima', 'beatriz.lima@aluno.br', 'senha789', 'aluno', NULL);

select * from usuarios

----------------------------------------------------

CREATE TABLE Espacos (
    espaco_id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(100) NOT NULL CHECK (tipo IN ('sala_de_aula', 'laboratorio', 'auditorio')),
    capacidade INT CHECK (capacidade > 0),
    gestor_responsavel_id INT,
    FOREIGN KEY (gestor_responsavel_id) REFERENCES Usuarios(usuario_id)
);

INSERT INTO Espacos (nome, tipo, capacidade, gestor_responsavel_id) VALUES
('Auditório Central', 'auditorio', 200, 2),
('Sala de Redes', 'laboratorio', 25, 1),
('Laboratório de Química', 'laboratorio', NULL, 1),
('Sala de Estudos 01', 'sala_de_aula', 10, 2),
('Sala de Estudos 02', 'sala_de_aula', NULL, 2),
('Sala de Aula 205', 'sala_de_aula', 40, 2);

select * from espacos

----------------------------------------------------

CREATE TABLE Reservas (
    reserva_id SERIAL PRIMARY KEY,
    espaco_id INT NOT NULL,
    solicitante_id INT NOT NULL,
    data_hora_inicio TIMESTAMP NOT NULL,
    data_hora_fim TIMESTAMP NOT NULL,
    finalidade VARCHAR(255),
    num_participantes INT CHECK (num_participantes > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmada', 'cancelada', 'recusada')),
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    aprovador_id INT,
    FOREIGN KEY (espaco_id) REFERENCES Espacos(espaco_id),
    FOREIGN KEY (solicitante_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (aprovador_id) REFERENCES Usuarios(usuario_id),
    -- Regra de negócio: reserva não pode durar mais de 4 horas.
    CONSTRAINT chk_duracao_maxima CHECK (data_hora_fim <= data_hora_inicio + INTERVAL '4 hours'),
    -- Regra de negócio: data de fim deve ser após a data de início.
    CONSTRAINT chk_datas_validas CHECK (data_hora_fim > data_hora_inicio)
);

INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status, aprovador_id) VALUES
(3, 3, '2025-08-13 14:00:00', '2025-08-13 16:00:00', 'Aula Prática de Redes de Computadores', 22, 'pendente', NULL);

-- Cenário 2: Aluno reservando sala de estudos (aprovada automaticamente)
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
(5, 5, '2025-08-11 18:00:00', '2025-08-11 20:00:00', 'Estudo em grupo para a prova de Cálculo', 4, 'confirmada');

-- Reserva adicional: Auditório, aprovada por um gestor
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status, aprovador_id) VALUES
(2, 4, '2025-09-05 09:00:00', '2025-09-05 12:00:00', 'Palestra de Abertura do Semestre', 150, 'confirmada', 2);

-- Reserva adicional: Aluno com reserva cancelada
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status) VALUES
(6, 6, '2025-08-20 10:00:00', '2025-08-20 12:00:00', 'Reunião do projeto de TCC', 3, 'cancelada');

-- Reserva adicional: Professor com reserva recusada
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status, aprovador_id) VALUES
(3, 3, '2025-08-25 10:00:00', '2025-08-25 14:00:00', 'Monitoria de Programação', 15, 'recusada', 1);

-- Reserva adicional: Sala de aula para evento
INSERT INTO Reservas (espaco_id, solicitante_id, data_hora_inicio, data_hora_fim, finalidade, num_participantes, status, aprovador_id) VALUES
(6, 2, '2025-08-22 19:00:00', '2025-08-22 22:00:00', 'Reunião de planejamento do departamento', 30, 'confirmada', 2);

select * from Reservas;