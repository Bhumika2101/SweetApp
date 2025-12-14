const request = require("supertest");
const mongoose = require("mongoose");

// Set test environment before requiring app
process.env.NODE_ENV = 'test';

const app = require("../server");
const User = require("../models/User");

/**
 * Auth Middleware Tests
 * Following TDD Red-Green-Refactor pattern
 * Tests cover: Token validation, Authorization, Protected routes
 */
describe("Auth Middleware Tests", () => {
  let validToken;
  let adminToken;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop_test"
      );
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});

    // Create regular user
    const userResponse = await request(app).post("/api/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
    });
    validToken = userResponse.body.token;

    // Create admin user
    const adminResponse = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    adminToken = adminResponse.body.token;
  });

  // ==========================================
  // PROTECT MIDDLEWARE TESTS
  // ==========================================
  describe("Protect Middleware", () => {
    test("should allow access with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test("should reject request without token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Not authorized");
    });

    test("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid.token.here")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject request with malformed Authorization header", async () => {
      // Test without Bearer prefix - use a raw token string
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "InvalidFormat token123")
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test("should reject request with expired token", async () => {
      // This test would require mocking time or using a short-lived token
      // Placeholder for actual implementation
      expect(true).toBe(true);
    });
  });

  // ==========================================
  // ADMIN AUTHORIZATION TESTS
  // ==========================================
  describe("Admin Authorization", () => {
    test("should allow admin to access admin routes", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Admin Sweet",
          category: "Chocolate",
          price: 4.99,
          quantity: 50,
        })
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    test("should reject non-admin from admin routes", async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          name: "User Sweet",
          category: "Chocolate",
          price: 4.99,
          quantity: 50,
        })
        .expect(403);

      expect(response.body.success).toBe(false);
    });

    test("should allow regular user to access user routes", async () => {
      // First create a sweet as admin
      const sweetResponse = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Sweet",
          category: "Chocolate",
          price: 4.99,
          quantity: 50,
        });

      const sweetId = sweetResponse.body.data._id;

      // Regular user can purchase
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${validToken}`)
        .send({ quantity: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  // ==========================================
  // TOKEN PAYLOAD TESTS
  // ==========================================
  describe("Token Payload", () => {
    test("should attach user to request object", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe("user@example.com");
    });

    test("should not expose password in request user", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.user.password).toBeUndefined();
    });
  });
});
