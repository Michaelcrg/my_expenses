
ALTER TABLE expenses DROP FOREIGN KEY fk_categoria;


ALTER TABLE expenses
ADD CONSTRAINT fk_categoria
FOREIGN KEY (categoria) REFERENCES categorie(id)
ON DELETE SET NULL;
