const { createClient } = require('@libsql/client');

async function main() {
  const client = createClient({
    url: 'file:local.db'
  });
  
  try {
    // Check if admin already exists
    const existing = await client.execute({
      sql: "SELECT * FROM users WHERE email = ? LIMIT 1;",
      args: ["admin@haniluxe.com"]
    });
    
    if (existing.rows.length > 0) {
      console.log("Admin user already exists in database:", existing.rows[0].email);
      // Update its password to admin123 just in case
      await client.execute({
        sql: "UPDATE users SET password = ? WHERE email = ?;",
        args: ["admin123", "admin@haniluxe.com"]
      });
      console.log("Admin user password updated to 'admin123'.");
    } else {
      // Insert new admin user
      await client.execute({
        sql: "INSERT INTO users (id, email, name, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?);",
        args: [
          "admin-id",
          "admin@haniluxe.com",
          "Admin",
          "admin123",
          "admin",
          new Date().toISOString()
        ]
      });
      console.log("Admin user seeded successfully with email: admin@haniluxe.com / password: admin123");
    }
  } catch (err) {
    console.error("Error seeding admin user:", err);
  }
}

main();
