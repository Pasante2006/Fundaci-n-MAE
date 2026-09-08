USE [Fundacion MAE];
GO

IF OBJECT_ID(N'dbo.colaboradores', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.colaboradores (
        id           INT            IDENTITY(1,1) NOT NULL PRIMARY KEY,
        nombre       NVARCHAR(150)  NOT NULL,
        descripcion  NVARCHAR(MAX)  NULL,
        imagen       NVARCHAR(255)  NULL,
        orden        INT            NOT NULL CONSTRAINT DF_colaboradores_orden DEFAULT (0),
        activo       BIT            NOT NULL CONSTRAINT DF_colaboradores_activo DEFAULT (1),
        creado_en    DATETIME2(0)   NOT NULL CONSTRAINT DF_colaboradores_creado DEFAULT (SYSDATETIME())
    );
END
GO

MERGE dbo.configuracion AS destino
USING (VALUES
    (N'nombre_corto',     N'MAE', N'Nombre corto'),
    (N'nombre_completo',  N'Manos que Abrazan la Esperanza', N'Nombre completo'),
    (N'nombre_legal',     N'Fundación MAE', N'Nombre legal'),
    (N'razon_social',     N'Fundación MAE (Margarita Maria Arango Escobar – Manos que Abrazan la Esperanza).', N'Razón social / Nombre'),
    (N'proposito',        N'Servir y apoyar a diferentes comunidades vulnerables, logrando impactar vidas de manera positiva y transformadora a través de MAE. Buscamos ser un canal de amor, brindando herramientas, acompañamiento y esperanza a quienes más lo necesitan.', N'Propósito principal'),
    (N'filosofia',        N'Toda la labor de la fundación se rige por la premisa de que "por encima de bien, está mejor", buscando siempre entregar excelencia y calidad humana en cada acto de generosidad.', N'Filosofía'),
    (N'vidas_impactadas', N'100+', N'Familias impactadas'),
    (N'eslogan',          N'Manos que Abrazan la Esperanza', N'Eslogan')
) AS origen (clave, valor, etiqueta)
ON destino.clave = origen.clave
WHEN MATCHED THEN
    UPDATE SET valor = origen.valor, etiqueta = origen.etiqueta
WHEN NOT MATCHED THEN
    INSERT (clave, valor, etiqueta) VALUES (origen.clave, origen.valor, origen.etiqueta);
GO

IF NOT EXISTS (SELECT 1 FROM dbo.colaboradores)
BEGIN
    INSERT INTO dbo.colaboradores (nombre, descripcion, imagen, orden, activo) VALUES
    (N'Escuelita de Maltería', N'Espacio de formación y cuidado para la niñez, donde el aprendizaje se vive con cariño, juego y esperanza.', N'/colab-malteria.png', 1, 1),
    (N'Abre Tus Ojos', N'Iniciativa de sensibilización que invita a mirar con empatía las realidades de quienes más lo necesitan.', N'/colab-abre-tus-ojos.png', 2, 1),
    (N'Abuelitos', N'Acompañamiento a personas mayores para honrar su historia, su dignidad y su lugar en la comunidad.', N'/colab-abuelitos.png', 3, 1);
END
GO

UPDATE dbo.colaboradores SET nombre = N'Escuelita de Maltería', imagen = COALESCE(NULLIF(imagen, N''), N'/colab-malteria.png')
WHERE nombre LIKE N'%Maltter%' OR (orden = 1 AND nombre LIKE N'%Escuelita%');
UPDATE dbo.colaboradores SET imagen = COALESCE(NULLIF(imagen, N''), N'/colab-abre-tus-ojos.png')
WHERE nombre LIKE N'%Abre Tus Ojos%';
UPDATE dbo.colaboradores SET nombre = N'Abuelitos', imagen = COALESCE(NULLIF(imagen, N''), N'/colab-abuelitos.png')
WHERE nombre IN (N'Abuelos', N'abuelos') OR (orden = 3 AND nombre LIKE N'%Abuel%');
GO
