-- ============================================
-- SCRIPT DE CREACIÓN DE TABLAS MAESTRAS
-- Sistema de Gestión Hospitalaria
-- Generado automáticamente el 2025-12-04T15:49:35.825Z
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================
-- TABLA: Paciente
-- ============================================
CREATE TABLE IF NOT EXISTS Paciente (
    id_paciente VARCHAR(255),
    Nombre VARCHAR(255),
    Apellidos VARCHAR(255),
    Fecha_nacimiento VARCHAR(255),
    Sexo VARCHAR(255),
    ID_documento VARCHAR(255),
    HealthCard_Number VARCHAR(255),
    Direccion VARCHAR(255),
    Phone VARCHAR(255),
    Email VARCHAR(255),
    Emergency_Contact VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Paciente VALUES
('IFV_0001', 'Isabel', 'Flores Viñales', '2002-11-10 03:50:00', 'F', '80111345H', '08 1450 78123 07', 'Pintor Ribalta 56, 2-2, 08028, Barcelona', '673 245 910', 'isafloresviñales@gmail.com', '697 869 322'),
('PAT_1764863375556_jpzbcqb62', 'gg', 'gg', '2025-05-07T22:00:00.000Z', '', '55', NULL, ', , ', '66', 'admin@venice.com', NULL);

-- ============================================
-- TABLA: PersonalSanitario
-- ============================================
CREATE TABLE IF NOT EXISTS PersonalSanitario (
    id_profesional VARCHAR(255),
    Nombre VARCHAR(255),
    Apellidos VARCHAR(255),
    rol VARCHAR(255),
    Especialidad VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO PersonalSanitario VALUES
('27512', 'Josep', 'Blanch Alsina', 'médico', 'Ginecología y Obstetricia');

-- ============================================
-- TABLA: UnidadHospitalaria
-- ============================================
CREATE TABLE IF NOT EXISTS UnidadHospitalaria (
    id_unidad VARCHAR(255),
    Nombre_unidad VARCHAR(255),
    Tipo_unidad VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO UnidadHospitalaria VALUES
('CE', 'Consultas Externas', 'ambulatoria');

-- ============================================
-- TABLA: Habitacion
-- ============================================
CREATE TABLE IF NOT EXISTS Habitacion (
    id_habitacion VARCHAR(255),
    Num_habitacion VARCHAR(255),
    id_unidad VARCHAR(255),
    Tipo_habitacion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Habitacion VALUES
('P1_HO_101', '101', 'HO', 'doble');

-- ============================================
-- TABLA: Cama
-- ============================================
CREATE TABLE IF NOT EXISTS Cama (
    id_cama VARCHAR(255),
    Num_cama VARCHAR(255),
    id_habitacion VARCHAR(255),
    Estado VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Cama VALUES
('P1_HO_101_1', '1', 'P1_HO_101', 'operativa');

-- ============================================
-- TABLA: Diagnostico
-- ============================================
CREATE TABLE IF NOT EXISTS Diagnostico (
    id_diagnostico VARCHAR(255),
    Descripcion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Diagnostico VALUES
('O30.0', 'Embarazo gemelar');

-- ============================================
-- TABLA: ParametroSignoVital
-- ============================================
CREATE TABLE IF NOT EXISTS ParametroSignoVital (
    id_parametro_sv VARCHAR(255),
    Nombre_parametro VARCHAR(255),
    Unidad VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO ParametroSignoVital VALUES
('1', 'Peso', 'kg');

-- ============================================
-- TABLA: Medicamento
-- ============================================
CREATE TABLE IF NOT EXISTS Medicamento (
    id_medicamento VARCHAR(255),
    Nombre_generico VARCHAR(255),
    Forma_farmaceutica VARCHAR(255),
    Via_administracion VARCHAR(255),
    Unidad_dosis VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Medicamento VALUES
('R06AA59', 'Pluriamín', 'comprimido', 'oral', NULL);

-- ============================================
-- TABLA: Alergia
-- ============================================
CREATE TABLE IF NOT EXISTS Alergia (
    id_alergia VARCHAR(255),
    Nombre_alergia VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Alergia VALUES
('294976000', 'Cloranfenicol');

-- ============================================
-- TABLA: RelacionPaciente
-- ============================================
CREATE TABLE IF NOT EXISTS RelacionPaciente (
    id_relacion VARCHAR(255),
    id_paciente_origen VARCHAR(255),
    id_paciente_destino VARCHAR(255),
    Tipo_relacion VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO RelacionPaciente VALUES
('IFV_0001_PIF_0010', 'IFV_0001', 'PIF_0010', 'madre-hija');

-- ============================================
-- TABLA: Prestacion
-- ============================================
CREATE TABLE IF NOT EXISTS Prestacion (
    id_prestacion VARCHAR(255),
    Descripcion VARCHAR(255),
    Tipo_prestacion VARCHAR(255),
    Coste_unitario VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO Prestacion VALUES
('LAB01', 'Analítica básica', 'procedimiento', '146.00');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================