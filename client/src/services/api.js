// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===== Interceptor: Attach Token Automatically =====
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("currentUser");
  if (user) {
    const token = JSON.parse(user).token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ===== DRY Error Handler =====
const handleError = (error, fallbackMessage) => {
  return {
    success: false,
    message: error?.response?.data?.message || fallbackMessage,
  };
};

// API SERVICE
const API = {
  // ======================= AUTH =======================

  async login(credentials) {
    try {
      const res = await api.post("/auth/login", credentials);

      if (res.data.success) {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      return handleError(err, "Login failed");
    }
  },

  async register(userData) {
    try {
      const res = await api.post("/auth/register", userData);

      if (res.data.success) {
        localStorage.setItem("currentUser", JSON.stringify(res.data.user));
      }

      return res.data;
    } catch (err) {
      return handleError(err, "Registration failed");
    }
  },

  // ======================= CLASSES =======================

  async createClass(classData) {
    try {
      const res = await api.post("/classes", classData);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to create class");
    }
  },

  async getClasses(teacherId) {
    try {
      const res = await api.get(`/classes/${teacherId}`);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to fetch classes");
    }
  },

  async getClassByQR(qrCode) {
    try {
      const res = await api.get(`/classes/qr/${qrCode}`);
      return res.data;
    } catch (err) {
      return handleError(err, "Invalid QR code");
    }
  },

  // ======================= ATTENDANCE =======================

  async markAttendance(data) {
    try {
      const res = await api.post("/attendance", data);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to mark attendance");
    }
  },

  async getAttendance(filters) {
    try {
      const res = await api.get("/attendance", { params: filters });
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to fetch attendance");
    }
  },

  async getAttendanceStats(classId) {
    try {
      const res = await api.get(`/attendance/stats/${classId}`);
      return res.data;
    } catch (err) {
      return handleError(err, "Failed to fetch stats");
    }
  },
};

export default API;
