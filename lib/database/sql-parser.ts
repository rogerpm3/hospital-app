/**
 * SQL Parser - Parsea archivos SQL y extrae datos de tablas
 * Lee y escribe archivos SQL para usar como base de datos
 */

export interface SQLTable {
  name: string;
  columns: string[];
  rows: Record<string, string | null>[];
}

export interface ParsedDatabase {
  tables: Record<string, SQLTable>;
}

/**
 * Parsea el contenido de un archivo SQL y extrae las tablas con sus datos
 */
export function parseSQLContent(sqlContent: string): ParsedDatabase {
  const tables: Record<string, SQLTable> = {};
  
  // Normalizar saltos de línea dentro de valores (reemplazar saltos dentro de comillas)
  let normalizedContent = normalizeLineBreaksInValues(sqlContent);
  
  // Limpiar comentarios
  normalizedContent = normalizedContent
    .replace(/--.*$/gm, '') // Remover comentarios de línea
    .replace(/\/\*[\s\S]*?\*\//g, ''); // Remover comentarios de bloque
  
  // Encontrar CREATE TABLE statements
  const createTableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"]?(\w+)[`"]?\s*\(([\s\S]*?)\)(?:\s*ENGINE[^;]*)?;/gi;
  let match;
  
  while ((match = createTableRegex.exec(normalizedContent)) !== null) {
    const tableName = match[1];
    const columnsSection = match[2];
    
    // Extraer nombres de columnas
    const columns: string[] = [];
    const lines = columnsSection.split(',');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      // Buscar definición de columna (capturar nombre con o sin backticks)
      const columnMatch = trimmedLine.match(/^[`]?(\w+)[`]?\s+(?:VARCHAR|INT|CHAR|TEXT|DATE|DATETIME|DECIMAL|BOOLEAN)/i);
      if (columnMatch) {
        columns.push(columnMatch[1]);
      }
    }
    
    if (columns.length > 0) {
      tables[tableName] = {
        name: tableName,
        columns,
        rows: []
      };
    }
  }
  
  // Encontrar INSERT statements - manejar múltiples formatos
  // Formato 1: INSERT INTO table VALUES (val1, val2), (val3, val4);
  // Formato 2: INSERT INTO table VALUES (val1, val2);
  
  const insertRegex = /INSERT\s+INTO\s+[`"]?(\w+)[`"]?\s*VALUES\s*([\s\S]*?)(?=INSERT\s+INTO|CREATE\s+TABLE|$)/gi;
  
  while ((match = insertRegex.exec(normalizedContent)) !== null) {
    const tableName = match[1];
    let valuesSection = match[2].trim();
    
    // Remover punto y coma final si existe
    if (valuesSection.endsWith(';')) {
      valuesSection = valuesSection.slice(0, -1);
    }
    
    // Asegurar que la tabla existe
    if (!tables[tableName]) {
      // Si la tabla no tiene CREATE TABLE, inferir columnas del primer INSERT
      tables[tableName] = {
        name: tableName,
        columns: [],
        rows: []
      };
    }
    
    // Extraer cada grupo de valores (puede haber múltiples separados por comas)
    const valueGroups = extractValueGroups(valuesSection);
    
    for (const valueGroup of valueGroups) {
      const values = parseValuesFromGroup(valueGroup);
      
      if (values.length > 0) {
        const row: Record<string, string | null> = {};
        const columns = tables[tableName].columns;
        
        // Si no hay columnas definidas, crear columnas genéricas
        if (columns.length === 0) {
          for (let i = 0; i < values.length; i++) {
            tables[tableName].columns.push(`col_${i}`);
          }
        }
        
        // Mapear valores a columnas
        const cols = tables[tableName].columns;
        values.forEach((value, index) => {
          const columnName = cols[index] || `col_${index}`;
          row[columnName] = value === 'NULL' || value === '' ? null : value;
        });
        
        tables[tableName].rows.push(row);
      }
    }
  }
  
  return { tables };
}

/**
 * Normaliza los saltos de línea dentro de valores entre comillas
 */
function normalizeLineBreaksInValues(content: string): string {
  let result = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (!inQuotes && (char === "'" || char === '"')) {
      inQuotes = true;
      quoteChar = char;
      result += char;
    } else if (inQuotes && char === quoteChar) {
      // Verificar si es un escape
      if (i + 1 < content.length && content[i + 1] === quoteChar) {
        result += char + content[i + 1];
        i++;
      } else {
        inQuotes = false;
        result += char;
      }
    } else if (inQuotes && (char === '\n' || char === '\r')) {
      // Reemplazar saltos de línea dentro de comillas con espacio
      result += ' ';
    } else {
      result += char;
    }
  }
  
  return result;
}

/**
 * Extrae grupos de valores de un string de VALUES
 * Maneja el formato: (val1, val2), (val3, val4)
 */
function extractValueGroups(valuesSection: string): string[] {
  const groups: string[] = [];
  let current = '';
  let depth = 0;
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < valuesSection.length; i++) {
    const char = valuesSection[i];
    
    if (!inQuotes && (char === "'" || char === '"')) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (inQuotes && char === quoteChar) {
      // Verificar escape
      if (i + 1 < valuesSection.length && valuesSection[i + 1] === quoteChar) {
        current += char + valuesSection[i + 1];
        i++;
      } else {
        inQuotes = false;
        current += char;
      }
    } else if (!inQuotes && char === '(') {
      depth++;
      if (depth === 1) {
        current = ''; // Empezar nuevo grupo
      } else {
        current += char;
      }
    } else if (!inQuotes && char === ')') {
      depth--;
      if (depth === 0) {
        groups.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    } else if (depth > 0) {
      current += char;
    }
  }
  
  return groups;
}

/**
 * Parsea los valores de un grupo (sin los paréntesis)
 */
function parseValuesFromGroup(group: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < group.length; i++) {
    const char = group[i];
    
    if (!inQuotes && (char === "'" || char === '"')) {
      inQuotes = true;
      quoteChar = char;
      // No agregamos la comilla al valor
    } else if (inQuotes && char === quoteChar) {
      // Verificar escape
      if (i + 1 < group.length && group[i + 1] === quoteChar) {
        current += char; // Agregar solo una comilla (escape)
        i++;
      } else {
        inQuotes = false;
        // No agregamos la comilla de cierre
      }
    } else if (!inQuotes && char === ',') {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Agregar el último valor
  values.push(current.trim());
  
  return values;
}

/**
 * Parsea una cadena de valores SQL, manejando comillas y valores especiales
 * @deprecated Use parseValuesFromGroup instead
 */
function parseValuesString(valuesStr: string): string[] {
  return parseValuesFromGroup(valuesStr);
}

/**
 * Genera contenido SQL desde los datos de las tablas
 */
export function generateSQLContent(tables: Record<string, SQLTable>): string {
  let sql = '';
  
  for (const [tableName, table] of Object.entries(tables)) {
    // CREATE TABLE statement
    if (table.columns.length > 0) {
      sql += `CREATE TABLE ${tableName} (\n`;
      sql += table.columns.map(col => `  \`${col}\` VARCHAR(255)`).join(',\n');
      sql += '\n);\n\n';
    }
    
    // INSERT statements
    for (const row of table.rows) {
      const values = table.columns.map(col => {
        const value = row[col];
        if (value === null || value === 'NULL') return 'NULL';
        // Escapar comillas simples
        const escapedValue = String(value).replace(/'/g, "''");
        return `'${escapedValue}'`;
      });
      
      sql += `INSERT INTO ${tableName} VALUES (${values.join(', ')});\n`;
    }
    
    sql += '\n';
  }
  
  return sql;
}

/**
 * Añade una fila a una tabla
 */
export function addRowToTable(
  tables: Record<string, SQLTable>,
  tableName: string,
  row: Record<string, string | null>
): Record<string, SQLTable> {
  const newTables = { ...tables };
  
  if (!newTables[tableName]) {
    newTables[tableName] = {
      name: tableName,
      columns: Object.keys(row),
      rows: []
    };
  }
  
  newTables[tableName] = {
    ...newTables[tableName],
    rows: [...newTables[tableName].rows, row]
  };
  
  return newTables;
}

/**
 * Actualiza una fila en una tabla basándose en un campo de ID
 */
export function updateRowInTable(
  tables: Record<string, SQLTable>,
  tableName: string,
  idField: string,
  idValue: string,
  updates: Record<string, string | null>
): Record<string, SQLTable> {
  if (!tables[tableName]) return tables;
  
  const newTables = { ...tables };
  newTables[tableName] = {
    ...newTables[tableName],
    rows: newTables[tableName].rows.map(row => {
      if (row[idField] === idValue) {
        return { ...row, ...updates };
      }
      return row;
    })
  };
  
  return newTables;
}

/**
 * Elimina una fila de una tabla
 */
export function deleteRowFromTable(
  tables: Record<string, SQLTable>,
  tableName: string,
  idField: string,
  idValue: string
): Record<string, SQLTable> {
  if (!tables[tableName]) return tables;
  
  const newTables = { ...tables };
  newTables[tableName] = {
    ...newTables[tableName],
    rows: newTables[tableName].rows.filter(row => row[idField] !== idValue)
  };
  
  return newTables;
}

/**
 * Busca filas en una tabla que coincidan con un criterio
 */
export function findRows(
  tables: Record<string, SQLTable>,
  tableName: string,
  criteria: Record<string, string | null>
): Record<string, string | null>[] {
  if (!tables[tableName]) return [];
  
  return tables[tableName].rows.filter(row => {
    return Object.entries(criteria).every(([key, value]) => row[key] === value);
  });
}
