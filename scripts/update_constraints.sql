-- Remove as restrições antigas
ALTER TABLE Espacos DROP CONSTRAINT espacos_gestor_responsavel_id_fkey;
ALTER TABLE Reservas DROP CONSTRAINT reservas_solicitante_id_fkey;
ALTER TABLE Reservas DROP CONSTRAINT reservas_aprovador_id_fkey;

-- Adiciona as restrições novamente com a opção ON DELETE SET NULL
ALTER TABLE Espacos
ADD CONSTRAINT espacos_gestor_responsavel_id_fkey
FOREIGN KEY (gestor_responsavel_id) REFERENCES Usuarios(usuario_id)
ON DELETE SET NULL;

ALTER TABLE Reservas
ADD CONSTRAINT reservas_solicitante_id_fkey
FOREIGN KEY (solicitante_id) REFERENCES Usuarios(usuario_id)
ON DELETE SET NULL;

ALTER TABLE Reservas
ADD CONSTRAINT reservas_aprovador_id_fkey
FOREIGN KEY (aprovador_id) REFERENCES Usuarios(usuario_id)
ON DELETE SET NULL;