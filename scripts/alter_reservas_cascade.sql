-- Remove a restrição de chave estrangeira antiga

ALTER TABLE Reservas DROP CONSTRAINT reservas_espaco_id_fkey;

-- Adiciona a restrição novamente com a opção ON DELETE CASCADE

ALTER TABLE Reservas

ADD CONSTRAINT reservas_espaco_id_fkey

FOREIGN KEY (espaco_id) REFERENCES Espacos(espaco_id)

ON DELETE CASCADE;