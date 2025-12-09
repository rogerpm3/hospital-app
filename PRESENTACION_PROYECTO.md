# 🏥 MedInsight - Sistema de Gestión Hospitalaria

## Presentación para el Profesor Juan

---

## 📋 Descripción del Proyecto

**MedInsight** es un sistema completo de gestión hospitalaria desarrollado con tecnologías modernas que permite administrar todos los aspectos de un hospital, desde la gestión de pacientes hasta el control de camas, órdenes médicas, y comunicación interna.

### Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** | Framework React con App Router |
| **TypeScript** | Tipado estático |
| **SQLite** | Base de datos (better-sqlite3) |
| **Tailwind CSS** | Estilos y diseño responsivo |
| **Shadcn/ui** | Componentes de interfaz |
| **Lucide React** | Iconografía |

---

## 🚀 Cómo Ejecutar el Servidor

### Requisitos Previos
- Node.js v20 o superior
- pnpm (gestor de paquetes)

### Pasos de Instalación

```bash
# 1. Navegar al directorio del proyecto
cd hospital-management-system

# 2. Instalar dependencias
pnpm install

# 3. Iniciar el servidor de desarrollo
pnpm dev
```

### Acceso a la Aplicación

Una vez iniciado el servidor, acceder a:

```
http://localhost:3000
```

---

## 🗄️ Diseño de la Base de Datos

### Diagrama Entidad-Relación (Conceptual)

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│    PACIENTES    │       │    PERSONAL     │       │  HABITACIONES   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ dni             │       │ dni             │       │ number          │
│ nombre          │       │ nombre          │       │ floor           │
│ apellidos       │       │ apellidos       │       │ type            │
│ fecha_nacim     │       │ role            │       │ capacity        │
│ genero          │       │ department      │       │ isOccupied      │
│ telefono        │       │ professionalId  │       └────────┬────────┘
│ email           │       │ email           │                │
│ direccion       │       │ telefono        │                │
│ alergias        │       └────────┬────────┘                │
│ historial       │                │                         │
└────────┬────────┘                │                         │
         │                         │                         │
         │    ┌────────────────────┴─────────────────────────┘
         │    │
         ▼    ▼
┌─────────────────────────────────────────────────────────────┐
│                     ASIGNACIONES                            │
├─────────────────────────────────────────────────────────────┤
│ id (PK)                                                     │
│ profesionalId (FK) → PERSONAL                               │
│ pacienteId (FK) → PACIENTES                                 │
│ tipoAsignacion (responsable/equipo/consulta/temporal)       │
│ fechaInicio                                                 │
│ fechaFin                                                    │
│ activo                                                      │
└─────────────────────────────────────────────────────────────┘
         │
         │
         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     CAMAS       │       │ ORDENES_MEDICAS │       │    ADMISIONES   │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │       │ id (PK)         │
│ roomId (FK)     │       │ patientId (FK)  │       │ patientId (FK)  │
│ number          │       │ doctorId (FK)   │       │ roomId (FK)     │
│ status          │       │ type            │       │ admissionDate   │
│ cleaningStatus  │       │ status          │       │ status          │
│ patientId (FK)  │       │ priority        │       │ diagnosis       │
└─────────────────┘       │ instructions    │       └─────────────────┘
                          └─────────────────┘
```

### Tablas Principales

#### 1. **Pacientes (Patients)**
```sql
CREATE TABLE Paciente (
    id VARCHAR(20) PRIMARY KEY,
    dni VARCHAR(15) UNIQUE NOT NULL,
    numeroSeguridadSocial VARCHAR(20),
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    fechaNacimiento DATE NOT NULL,
    genero CHAR(1),
    grupoSanguineo VARCHAR(5),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    contactoEmergencia TEXT,
    alergias TEXT,
    historialMedico TEXT,
    medicacionActual TEXT,
    condicionActual VARCHAR(50),
    nivelRiesgo VARCHAR(20),
    requiereAislamiento BOOLEAN DEFAULT FALSE
);
```

#### 2. **Personal (Staff/Users)**
```sql
CREATE TABLE Personal (
    id VARCHAR(20) PRIMARY KEY,
    dni VARCHAR(15) UNIQUE NOT NULL,
    idProfesional VARCHAR(20) UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    rol ENUM('admin','doctor','nurse','auxiliary','cleaning',
             'pharmacy','radiology','admission','social_work',
             'patient','family') NOT NULL,
    departamento VARCHAR(100),
    email VARCHAR(100),
    telefono VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    ultimoAcceso DATETIME
);
```

#### 3. **Habitaciones (Rooms)**
```sql
CREATE TABLE Habitacion (
    id VARCHAR(20) PRIMARY KEY,
    numero VARCHAR(10) NOT NULL,
    planta INT NOT NULL,
    tipo ENUM('Standard','Private','ICU','Emergency',
              'Operating','Isolation') NOT NULL,
    capacidad INT DEFAULT 1,
    ocupada BOOLEAN DEFAULT FALSE,
    equipamiento TEXT,
    servicios TEXT
);
```

#### 4. **Camas (Beds)**
```sql
CREATE TABLE Cama (
    id VARCHAR(20) PRIMARY KEY,
    habitacionId VARCHAR(20) REFERENCES Habitacion(id),
    numero VARCHAR(10) NOT NULL,
    estado ENUM('Available','Occupied','Cleaning Required',
                'Maintenance','Reserved') DEFAULT 'Available',
    estadoLimpieza ENUM('Clean','Dirty','In Progress') DEFAULT 'Clean',
    tipo ENUM('Standard','Electric','ICU','Pediatric','Bariatric'),
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    limpiadoPor VARCHAR(100),
    ultimaLimpieza DATETIME
);
```

#### 5. **Asignaciones Profesional-Paciente**
```sql
CREATE TABLE AsignacionProfesionalPaciente (
    id VARCHAR(20) PRIMARY KEY,
    profesionalId VARCHAR(20) REFERENCES Personal(id),
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    tipoAsignacion ENUM('responsable','equipo','consulta','temporal'),
    fechaInicio DATETIME NOT NULL,
    fechaFin DATETIME,
    activo BOOLEAN DEFAULT TRUE,
    notas TEXT,
    UNIQUE(profesionalId, pacienteId, tipoAsignacion)
);
```

#### 6. **Órdenes Médicas**
```sql
CREATE TABLE OrdenMedica (
    id VARCHAR(20) PRIMARY KEY,
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    medicoId VARCHAR(20) REFERENCES Personal(id),
    tipo ENUM('Medication','Laboratory','Imaging','Procedure',
              'Diet','Activity','Consultation'),
    estado ENUM('Pending','In Progress','Completed','Cancelled'),
    prioridad ENUM('Routine','Urgent','STAT'),
    descripcion TEXT,
    instrucciones TEXT,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fechaProgramada DATETIME,
    fechaCompletada DATETIME
);
```

#### 7. **Admisiones**
```sql
CREATE TABLE Admision (
    id VARCHAR(20) PRIMARY KEY,
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    habitacionId VARCHAR(20) REFERENCES Habitacion(id),
    fechaAdmision DATETIME NOT NULL,
    tipoAdmision ENUM('Emergency','Scheduled','Transfer'),
    estado ENUM('Active','Discharged','Transferred'),
    diagnosticoPrincipal TEXT,
    medicoResponsable VARCHAR(20) REFERENCES Personal(id),
    fechaAltaEstimada DATE,
    fechaAlta DATETIME
);
```

#### 8. **Signos Vitales**
```sql
CREATE TABLE SignosVitales (
    id VARCHAR(20) PRIMARY KEY,
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    registradoPor VARCHAR(20) REFERENCES Personal(id),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    presionSistolica INT,
    presionDiastolica INT,
    frecuenciaCardiaca INT,
    frecuenciaRespiratoria INT,
    temperatura DECIMAL(4,1),
    saturacionOxigeno INT,
    nivelDolor INT,
    nivelConciencia VARCHAR(20)
);
```

#### 9. **Citas (Appointments)**
```sql
CREATE TABLE Cita (
    id VARCHAR(20) PRIMARY KEY,
    pacienteId VARCHAR(20) REFERENCES Paciente(id),
    medicoId VARCHAR(20) REFERENCES Personal(id),
    tipo VARCHAR(50),
    estado ENUM('Scheduled','Confirmed','In Progress',
                'Completed','Cancelled','No Show'),
    fecha DATETIME NOT NULL,
    duracion INT DEFAULT 30,
    motivo TEXT,
    notas TEXT
);
```

#### 10. **Permisos por Área Clínica**
```sql
CREATE TABLE PermisoAreaClinica (
    id VARCHAR(20) PRIMARY KEY,
    profesionalId VARCHAR(20) REFERENCES Personal(id),
    areaClinica VARCHAR(100),
    nivelAcceso ENUM('lectura','escritura','administracion'),
    fechaInicio DATE,
    fechaFin DATE,
    activo BOOLEAN DEFAULT TRUE
);
```

---

## 🔐 Credenciales de Acceso por Rol

### Usuarios de Prueba

| Rol | DNI | Contraseña | ID Profesional |
|-----|-----|------------|----------------|
| **Administrador** | `12345678A` | `admin123` | `ADMIN001` |
| **Médico** | `23456789B` | `doctor123` | `MED001` |
| **Médico 2** | `34567890C` | `doctor123` | `MED002` |
| **Enfermero/a** | `34567890C` | `nurse123` | `ENF001` |
| **Auxiliar** | `23456789K` | `auxiliary123` | `AUX001` |
| **Limpieza** | `45678901D` | `cleaning123` | `LIM001` |
| **Farmacia** | `78901234G` | `pharmacy123` | `FAR001` |
| **Radiología** | `89012345H` | `radiology123` | `RAD001` |
| **Admisiones** | `90123456I` | `admission123` | `ADM002` |
| **Trabajo Social** | `01234567J` | `social123` | `SOC001` |
| **Paciente** | `56789012E` | `patient123` | `PAC001` |
| **Familiar** | `67890123F` | `family123` | `FAM001` |

---

## 👥 Funcionalidades por Rol

### 🔴 Administrador
- Acceso completo a todas las funcionalidades
- Gestión de usuarios y permisos
- Analítica y reportes globales
- Configuración del sistema
- Auditoría y logs de acceso

### 🩺 Médico
- Ver pacientes asignados
- Crear/gestionar órdenes médicas
- Escribir evoluciones clínicas
- Gestionar citas
- Dar altas hospitalarias

### 💉 Enfermería
- Ver pacientes del médico asignado
- Registrar signos vitales
- Administrar medicación
- Notas de enfermería
- Gestión de camas

### 🧹 Limpieza
- Ver estado de habitaciones
- Actualizar estado de limpieza de camas
- Plantas hospitalarias (vista simplificada)

### 💊 Farmacia
- Ver órdenes de medicación
- Gestionar inventario
- Verificar interacciones medicamentosas

### 📋 Admisiones
- Registro completo de pacientes
- Asignar médico responsable
- Ver disponibilidad de habitaciones
- Gestionar citas

### 👤 Paciente
- Ver sus citas programadas
- Encuesta de satisfacción
- Información personal

### 👨‍👩‍👧 Familiar
- Estado clínico del paciente
- Horarios de visita
- Ubicación del paciente

---

## 🎨 Capturas de Pantalla

### Pantalla de Login
- Autenticación con DNI, contraseña e ID profesional
- Sistema de bloqueo tras 3 intentos fallidos
- Recuperación de contraseña

### Dashboard Principal
- Estadísticas en tiempo real
- Accesos rápidos según rol
- Notificaciones del sistema

### Gestión de Pacientes
- Lista filtrable de pacientes
- Formulario completo de registro
- Detalles clínicos

### Plantas Hospitalarias
- Vista de mapa de camas
- Estado de ocupación
- Gestión de limpieza

---

## 📊 Características Destacadas

1. **Control de Acceso Basado en Roles (RBAC)**
   - Cada usuario solo ve lo que necesita
   - Asignaciones profesional-paciente

2. **Cumplimiento RGPD**
   - Banner de cookies obligatorio
   - Configuración de privacidad
   - Logs de auditoría

3. **Interfaz Responsiva**
   - Diseño adaptable a móviles y tablets
   - Navegación intuitiva

4. **Base de Datos SQLite**
   - Datos persistentes
   - Estructura relacional normalizada

5. **Asistente IA**
   - Consultas sobre el hospital
   - Estadísticas rápidas

---

## 📁 Estructura del Proyecto

```
hospital-management-system/
├── app/
│   ├── api/
│   │   └── sqlite/          # API de base de datos
│   ├── page.tsx             # Página principal
│   └── layout.tsx           # Layout global
├── components/
│   ├── dashboard/           # Componentes del dashboard
│   ├── patients/            # Gestión de pacientes
│   ├── nursing/             # Panel de enfermería
│   ├── medical-orders/      # Órdenes médicas
│   ├── bed-management/      # Gestión de camas
│   ├── hospital-floors/     # Plantas hospitalarias
│   └── ui/                  # Componentes UI base
├── lib/
│   ├── database/            # Servicios de base de datos
│   ├── auth-context.tsx     # Autenticación
│   ├── hospital-context.tsx # Estado global
│   ├── sql-data.ts          # Datos SQL
│   └── types.ts             # Tipos TypeScript
└── sql_databases/           # Scripts SQL originales
```

---

## 🎯 Conclusión

MedInsight es una solución integral para la gestión hospitalaria que demuestra:

- ✅ Arquitectura moderna con Next.js y TypeScript
- ✅ Base de datos relacional bien diseñada
- ✅ Sistema de roles y permisos robusto
- ✅ Interfaz de usuario profesional y accesible
- ✅ Cumplimiento de normativas de privacidad

---

**Desarrollado por:** Equipo de Desarrollo  
**Versión:** 2.0.0  
**Fecha:** Diciembre 2024

