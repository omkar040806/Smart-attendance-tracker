// server.js (MongoDB Native Driver Version)
require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// ================== MONGODB CONNECTION ==================
const client = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");

let db, Users, Classes, Attendance;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("attendance-tracker");

    Users = db.collection("users");
    Classes = db.collection("classes");
    Attendance = db.collection("attendance");

    console.log("✅ Connected to MongoDB (Native Driver)");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err);
  }
}

connectDB();

// ======================= AUTH =======================

// REGISTER
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Users.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashed,
      role,
      createdAt: new Date(),
    };

    const result = await Users.insertOne(newUser);

    res.status(201).json({
      success: true,
      user: { id: result.insertedId, name, email, role },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// LOGIN
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Users.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================= CLASSES =======================

// CREATE CLASS
app.post("/api/classes", async (req, res) => {
  try {
    const { name, code, teacherId, location, radius } = req.body;

    const newClass = {
      name,
      code,
      teacherId: new ObjectId(teacherId),
      qrCode: `QR-${Date.now()}`,
      location,
      radius,
      createdAt: new Date(),
    };

    const result = await Classes.insertOne(newClass);

    res.status(201).json({ success: true, class: { ...newClass, id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET CLASSES FOR TEACHER
app.get("/api/classes/:teacherId", async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    const classes = await Classes.find({
      teacherId: new ObjectId(teacherId),
    }).toArray();

    res.json({ success: true, classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET CLASS BY QR
app.get("/api/classes/qr/:qrCode", async (req, res) => {
  try {
    const classData = await Classes.findOne({ qrCode: req.params.qrCode });

    if (!classData)
      return res.status(404).json({ success: false, message: "Class not found" });

    res.json({ success: true, class: classData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================= ATTENDANCE =======================

// MARK ATTENDANCE
app.post("/api/attendance", async (req, res) => {
  try {
    const record = {
      ...req.body,
      studentId: new ObjectId(req.body.studentId),
      classId: new ObjectId(req.body.classId),
      timestamp: new Date(),
    };

    const result = await Attendance.insertOne(record);

    res.status(201).json({ success: true, record: { ...record, id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ATTENDANCE
app.get("/api/attendance", async (req, res) => {
  try {
    let query = {};

    if (req.query.studentId) query.studentId = new ObjectId(req.query.studentId);
    if (req.query.classId) query.classId = new ObjectId(req.query.classId);

    const records = await Attendance.find(query)
      .sort({ timestamp: -1 })
      .toArray();

    res.json({ success: true, records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET ATTENDANCE STATS
app.get("/api/attendance/stats/:classId", async (req, res) => {
  try {
    const classId = new ObjectId(req.params.classId);

    const total = await Attendance.countDocuments({ classId });
    const verified = await Attendance.countDocuments({ classId, verified: true });

    res.json({
      success: true,
      stats: {
        total,
        verified,
        percentage: total ? ((verified / total) * 100).toFixed(2) : "0",
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ======================= START SERVER =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
