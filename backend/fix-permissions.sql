-- Otorgar permisos sobre la tabla Category
GRANT ALL PRIVILEGES ON TABLE "Category" TO asisbot;

-- Otorgar permisos sobre la secuencia de Category
GRANT ALL PRIVILEGES ON SEQUENCE "Category_id_seq" TO asisbot;

-- Hacer que asisbot sea el dueño de la tabla
ALTER TABLE "Category" OWNER TO asisbot;
