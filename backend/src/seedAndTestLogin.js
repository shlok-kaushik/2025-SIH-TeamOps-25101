import pool from "./config/db.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch"; // to test login via HTTP request

async function seed() {
  try {
    // Password and hash
    const password = "SuperSecure123";
    const hashedPassword = await bcrypt.hash(password, 10);

    // Teacher account
    const teacher = {
      email: "workingteacher@test.com",
      role: "teacher",
      password: hashedPassword
    };

    // Check if user exists
    const exists = await pool.query("SELECT * FROM users WHERE email=$1", [teacher.email]);
    if (exists.rowCount === 0) {
      await pool.query(
        "INSERT INTO users (email, password, role) VALUES ($1, $2, $3)",
        [teacher.email, teacher.password, teacher.role]
      );
      console.log(`✅ Inserted teacher: ${teacher.email}`);
    } else {
      console.log(`ℹ️ Teacher already exists: ${teacher.email}`);
    }

    console.log("✅ Seeding complete!");
    return teacher;
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

// Test login via backend route
async function testLogin(teacher) {
  try {
    const response = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: teacher.email, password: "SuperSecure123" })
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Login successful!");
      console.log("Returned user info:", data.user);
      console.log("JWT token:", data.token);
    } else {
      console.log("❌ Login failed:", data.message);
    }
  } catch (err) {
    console.error("❌ Login test error:", err);
  } finally {
    process.exit(0);
  }
}

// Run
seed().then((teacher) => testLogin(teacher));
