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
    (N'razon_social',     N'Fundación Manos que Abrazan la Esperanza', N'Razón social'),
    (N'proposito',        N'Acompañamos a comunidades de Colombia para transformar realidades con dignidad, solidaridad y esperanza.', N'Propósito'),
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
    INSERT INTO dbo.colaboradores (nombre, descripcion, orden, activo) VALUES
    (N'Escuelita de Malttería', N'Espacio de formación y cuidado para la niñez, donde el aprendizaje se vive con cariño, juego y esperanza.', 1, 1),
    (N'Abre Tus Ojos', N'Iniciativa de sensibilización que invita a mirar con empatía las realidades de quienes más lo necesitan.', 2, 1),
    (N'Abuelos', N'Acompañamiento a personas mayores para honrar su historia, su dignidad y su lugar en la comunidad.', 3, 1);
END
GO
