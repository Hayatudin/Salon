const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: 'file:local.db'
  });
  
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log("Database Tables:");
    console.log(JSON.stringify(res.rows, null, 2));
    
    // For each table, describe schema
    for (const row of res.rows) {
      const tableName = row.name;
      if (tableName.startsWith('sqlite_') || tableName.startsWith('_drizzle')) continue;
      const columns = await client.execute(`PRAGMA table_info(${tableName});`);
      console.log(`\nTable Schema [${tableName}]:`);
      console.log(JSON.stringify(columns.rows, null, 2));
    }
  } catch (err) {
    console.error("Error reading database:", err);
  }
}

main();
