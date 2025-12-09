# Guía de Migración a SQLite ✅ COMPLETADA

## Estado: Migración Completa 🎉

La migración a SQLite se ha completado exitosamente. La aplicación ahora utiliza SQLite como base de datos principal.

## ¿Por qué SQLite?

- ✅ Base de datos real con SQL completo
- ✅ Transacciones ACID
- ✅ Sin servidor (archivo único)
- ✅ Más rápido que parsear archivos SQL
- ✅ Fácil backup (copiar un archivo)
- ✅ Compatible con tus archivos SQL actuales

## Arquitectura Actual

### Archivos Principales

```
lib/database/
├── sqlite-service.ts    # Servicio principal de SQLite
├── data-adapter.ts      # Conversión SQL ↔ App
├── index.ts             # Exportaciones centralizadas
└── sql-parser.ts        # Parser SQL (compatibilidad)

app/api/
├── sqlite/route.ts      # API REST para SQLite
└── database/route.ts    # API legacy (compatibilidad)
```

### Flujo de Datos

```
Cliente (React) 
    ↓ 
API /api/sqlite 
    ↓ 
sqlite-service.ts 
    ↓ 
SQLite (data/hospital.db)
```

## Funcionalidades Disponibles

### Lectura de Datos
- `getPatients()` - Obtener pacientes
- `getStaff()` - Obtener personal
- `getRoomsAndBeds()` - Obtener habitaciones y camas
- `getMedications()` - Obtener medicamentos
- `getMedicalOrders()` - Obtener órdenes médicas
- `getVitalSigns()` - Obtener signos vitales
- `getServices()` - Obtener servicios
- `getAdmissions()` - Obtener admisiones

### Escritura de Datos
- `addPatient()` / `updatePatient()` / `deletePatient()`
- `addStaff()` / `updateStaff()` / `deleteStaff()`
- `addVitalSignsRecord()`
- `addMedicalOrder()`
- `updateBedStatus()`
- `addMedicationAdministration()`
- `addNursingDocument()`
- `createEpisode()` / `dischargePatient()`
- `registerMovement()`

## API REST

### GET /api/sqlite?action=<action>

Acciones disponibles:
- `patients` - Obtener pacientes
- `staff` - Obtener personal
- `rooms-beds` - Obtener habitaciones y camas
- `medications` - Obtener medicamentos
- `orders` - Obtener órdenes médicas
- `vitals` - Obtener signos vitales
- `services` - Obtener servicios
- `admissions` - Obtener admisiones
- `all` - Obtener todos los datos

### POST /api/sqlite

Acciones disponibles:
- `add-patient`, `update-patient`, `delete-patient`
- `add-staff`, `update-staff`, `delete-staff`
- `add-vital-signs`
- `add-medical-order`
- `update-bed-status`
- `add-medication-administration`
- `add-nursing-document`
- `create-episode`
- `register-movement`
- `discharge-patient`
- `reset`

## Base de Datos

La base de datos SQLite se almacena en:
```
data/hospital.db
```

### Inicialización Automática

Al iniciar la aplicación:
1. Se crea el directorio `data/` si no existe
2. Se crea el archivo `hospital.db`
3. Se importan los datos desde `sql_databases/`

### Backup

Para hacer backup, simplemente copia el archivo:
```bash
cp data/hospital.db backup/hospital_$(date +%Y%m%d).db
```

## Dependencias

```json
{
  "dependencies": {
    "better-sqlite3": "^12.5.0"
  },
  "devDependencies": {
    "@types/better-sqlite3": "^7.6.13"
  }
}
```

## Ventajas vs Sistema Anterior

| Aspecto | Archivos SQL | SQLite |
|---------|--------------|--------|
| Rendimiento | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| Consultas SQL | ❌ | ✅ |
| Transacciones | ❌ | ✅ |
| Escalabilidad | ⭐⭐ | ⭐⭐⭐⭐ |
| Backup | Manual | Archivo único |
| Persistencia | localStorage | Archivo DB |

## ¿Cuándo migrar a MySQL/PostgreSQL?

Cuando necesites:
- >100 usuarios concurrentes escribiendo
- Replicación entre servidores
- Alta disponibilidad
- Escalabilidad horizontal
- Múltiples instancias de servidor

## Troubleshooting

### Error: "Database not initialized"
La base de datos no se ha inicializado. Asegúrate de que:
1. El directorio `data/` existe y tiene permisos de escritura
2. Los archivos SQL en `sql_databases/` son válidos

### Error: "SQLite solo funciona en servidor"
Estás intentando usar SQLite desde el cliente. Usa la API `/api/sqlite` en su lugar.

### Reset de la base de datos
```bash
rm data/hospital.db
# La siguiente vez que inicies la app, se recreará automáticamente
```
