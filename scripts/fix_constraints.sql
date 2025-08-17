-- Remove as restrições antigas que usavam SET NULL
ALTER TABLE Espacos DROP CONSTRAINT espacos_gestor_responsavel_id_fkey;
ALTER TABLE Reservas DROP CONSTRAINT reservas_solicitante_id_fkey;
ALTER TABLE Reservas DROP CONSTRAINT reservas_aprovador_id_fkey;

-- Adiciona as restrições novamente com a regra ON DELETE CASCADE
-- (ou SET NULL para campos que podem ser nulos)

-- Se um usuário gestor for deletado, o espaço fica sem gestor
ALTER TABLE Espacos
ADD CONSTRAINT espacos_gestor_responsavel_id_fkey
FOREIGN KEY (gestor_responsavel_id) REFERENCES Usuarios(usuario_id)
ON DELETE SET NULL;

-- Se um usuário for deletado, suas reservas são deletadas junto
ALTER TABLE Reservas
ADD CONSTRAINT reservas_solicitante_id_fkey
FOREIGN KEY (solicitante_id) REFERENCES Usuarios(usuario_id)
ON DELETE CASCADE;

-- Se um usuário aprovador for deletado, a reserva continua existindo, mas sem o aprovador
ALTER TABLE Reservas
ADD CONSTRAINT reservas_aprovador_id_fkey
FOREIGN KEY (aprovador_id) REFERENCES Usuarios(usuario_id)
ON DELETE SET NULL;