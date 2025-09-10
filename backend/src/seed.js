import pool from "./config/db.js";
import bcrypt from "bcrypt";

async function seed() {
  try {
    // Password hash for 'password123'
    const hashedPassword = await bcrypt.hash("password123", 10);

    // Users to insert
    const users = [
      { email: "teacher@test.com", role: "teacher" },
      { email: "student1@test.com", role: "student" },
      { email: "student2@test.com", role: "student" }
    ];

    for (const user of users) {
      // Check if user already exists
      const exists = await pool.query("SELECT * FROM users WHERE email=$1", [user.email]);
      if (exists.rowCount === 0) {
        await pool.query(
          "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
          [user.email, hashedPassword, user.role]
        );
        console.log(`Inserted: ${user.email} (${user.role})`);
      } else {
        console.log(`Already exists: ${user.email}`);
      }
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();
