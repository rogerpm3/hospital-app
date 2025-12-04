/**
 * API Route para operaciones de base de datos SQL
 * Lee y escribe los archivos SQL de la carpeta sql_databases
 */

import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parseSQLContent, generateSQLContent, SQLTable } from '@/lib/database/sql-parser';

// Rutas de los archivos SQL
const SQL_DATABASES_DIR = path.join(process.cwd(), 'sql_databases');
const MASTER_TABLES_FILE = path.join(SQL_DATABASES_DIR, 'hospital_master_tables (1).sql');
const DATA_TABLES_FILE = path.join(SQL_DATABASES_DIR, 'database_all.sql');

// Cache en memoria para evitar lecturas repetidas
let cachedMasterTables: Record<string, SQLTable> | null = null;
let cachedDataTables: Record<string, SQLTable> | null = null;
let lastModified: number = 0;

/**
 * GET - Lee los archivos SQL y devuelve los datos parseados
 */
export async function GET() {
  try {
    // Verificar si los archivos han cambiado
    const masterStat = await fs.stat(MASTER_TABLES_FILE).catch(() => null);
    const dataStat = await fs.stat(DATA_TABLES_FILE).catch(() => null);
    
    const currentModified = Math.max(
      masterStat?.mtimeMs || 0,
      dataStat?.mtimeMs || 0
    );
    
    // Si los datos están en cache y no han cambiado, devolverlos
    if (cachedMasterTables && cachedDataTables && currentModified <= lastModified) {
      return NextResponse.json({
        masterTables: cachedMasterTables,
        dataTables: cachedDataTables,
        fromCache: true
      });
    }
    
    // Leer archivos SQL
    let masterContent = '';
    let dataContent = '';
    
    try {
      masterContent = await fs.readFile(MASTER_TABLES_FILE, 'utf-8');
    } catch (e) {
      console.warn('No se pudo leer hospital_master_tables:', e);
    }
    
    try {
      dataContent = await fs.readFile(DATA_TABLES_FILE, 'utf-8');
    } catch (e) {
      console.warn('No se pudo leer database_all:', e);
    }
    
    // Parsear contenido SQL
    const masterParsed = parseSQLContent(masterContent);
    const dataParsed = parseSQLContent(dataContent);
    
    // Actualizar cache
    cachedMasterTables = masterParsed.tables;
    cachedDataTables = dataParsed.tables;
    lastModified = currentModified;
    
    return NextResponse.json({
      masterTables: masterParsed.tables,
      dataTables: dataParsed.tables,
      fromCache: false
    });
    
  } catch (error) {
    console.error('Error reading database files:', error);
    return NextResponse.json(
      { error: 'Error al leer archivos de base de datos', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * POST - Guarda los cambios en los archivos SQL
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { masterTables, dataTables } = body;
    
    if (!masterTables || !dataTables) {
      return NextResponse.json(
        { error: 'Datos de tablas requeridos' },
        { status: 400 }
      );
    }
    
    // Generar contenido SQL
    const masterSQL = generateMasterTablesSQL(masterTables);
    const dataSQL = generateDataTablesSQL(dataTables);
    
    // Asegurar que el directorio existe
    await fs.mkdir(SQL_DATABASES_DIR, { recursive: true });
    
    // Escribir archivos
    await fs.writeFile(MASTER_TABLES_FILE, masterSQL, 'utf-8');
    await fs.writeFile(DATA_TABLES_FILE, dataSQL, 'utf-8');
    
    // Actualizar cache
    cachedMasterTables = masterTables;
    cachedDataTables = dataTables;
    lastModified = Date.now();
    
    return NextResponse.json({
      success: true,
      message: 'Base de datos guardada correctamente'
    });
    
  } catch (error) {
    console.error('Error writing database files:', error);
    return NextResponse.json(
      { error: 'Error al guardar archivos de base de datos', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Genera SQL para las tablas maestras con formato mejorado
 */
function generateMasterTablesSQL(tables: Record<string, SQLTable>): string {
  let sql = `-- ============================================
-- SCRIPT DE CREACIÓN DE TABLAS MAESTRAS
-- Sistema de Gestión Hospitalaria
-- Generado automáticamente el ${new Date().toISOString()}
-- ============================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

`;
  
  // Orden específico de tablas maestras
  const tableOrder = [
    'Paciente',
    'PersonalSanitario',
    'UnidadHospitalaria',
    'Habitacion',
    'Cama',
    'Diagnostico',
    'ParametroSignoVital',
    'Medicamento',
    'Alergia',
    'RelacionPaciente',
    'Prestacion'
  ];
  
  for (const tableName of tableOrder) {
    const table = tables[tableName];
    if (!table || table.rows.length === 0) continue;
    
    sql += `-- ============================================
-- TABLA: ${tableName}
-- ============================================
`;
    
    // CREATE TABLE
    if (table.columns.length > 0) {
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      sql += table.columns.map(col => `    ${col} VARCHAR(255)`).join(',\n');
      sql += '\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n';
    }
    
    // INSERT statements
    if (table.rows.length > 0) {
      sql += `INSERT INTO ${tableName} VALUES\n`;
      const valueRows = table.rows.map(row => {
        const values = table.columns.map(col => {
          const value = row[col];
          if (value === null || value === 'NULL' || value === undefined) return 'NULL';
          const escapedValue = String(value).replace(/'/g, "''");
          return `'${escapedValue}'`;
        });
        return `(${values.join(', ')})`;
      });
      sql += valueRows.join(',\n') + ';\n\n';
    }
  }
  
  // Agregar cualquier otra tabla no en el orden
  for (const [tableName, table] of Object.entries(tables)) {
    if (tableOrder.includes(tableName) || table.rows.length === 0) continue;
    
    sql += `-- ============================================
-- TABLA: ${tableName}
-- ============================================
`;
    
    if (table.columns.length > 0) {
      sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      sql += table.columns.map(col => `    ${col} VARCHAR(255)`).join(',\n');
      sql += '\n);\n\n';
    }
    
    if (table.rows.length > 0) {
      sql += `INSERT INTO ${tableName} VALUES\n`;
      const valueRows = table.rows.map(row => {
        const values = table.columns.map(col => {
          const value = row[col];
          if (value === null || value === 'NULL' || value === undefined) return 'NULL';
          const escapedValue = String(value).replace(/'/g, "''");
          return `'${escapedValue}'`;
        });
        return `(${values.join(', ')})`;
      });
      sql += valueRows.join(',\n') + ';\n\n';
    }
  }
  
  sql += `-- ============================================
-- FIN DEL SCRIPT
-- ============================================`;
  
  return sql;
}

/**
 * Genera SQL para las tablas de datos con formato mejorado
 */
function generateDataTablesSQL(tables: Record<string, SQLTable>): string {
  let sql = `-- ============================================
-- SCRIPT DE DATOS TRANSACCIONALES
-- Sistema de Gestión Hospitalaria
-- Generado automáticamente el ${new Date().toISOString()}
-- ============================================

`;
  
  for (const [tableName, table] of Object.entries(tables)) {
    if (table.rows.length === 0) continue;
    
    // CREATE TABLE
    if (table.columns.length > 0) {
      sql += `CREATE TABLE ${tableName} (\n`;
      sql += table.columns.map(col => `  \`${col}\` VARCHAR(255)`).join(',\n');
      sql += '\n);\n\n';
    }
    
    // INSERT statements (uno por fila para mejor legibilidad)
    for (const row of table.rows) {
      const values = table.columns.map(col => {
        const value = row[col];
        if (value === null || value === 'NULL' || value === undefined) return 'NULL';
        const escapedValue = String(value).replace(/'/g, "''");
        return `'${escapedValue}'`;
      });
      sql += `INSERT INTO ${tableName} VALUES (${values.join(', ')});\n`;
    }
    
    sql += '\n\n';
  }
  
  return sql;
}

/**
 * DELETE - Resetea la base de datos a los valores originales
 */
export async function DELETE() {
  try {
    // Limpiar cache
    cachedMasterTables = null;
    cachedDataTables = null;
    lastModified = 0;
    
    return NextResponse.json({
      success: true,
      message: 'Cache de base de datos limpiada'
    });
    
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { error: 'Error al resetear base de datos' },
      { status: 500 }
    );
  }
}

