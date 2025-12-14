const request = require("supertest");
const mongoose = require("mongoose");

// Set test environment before requiring app
process.env.NODE_ENV = 'test';

const app = require("../server");
const User = require("../models/User");
const Sweet = require("../models/Sweet");

describe("Sweet API Tests", () => {
  let userToken;
  let adminToken;
  let sweetId;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop_test"
      );
    }
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Sweet.deleteMany({});

    // Create admin user
    const adminResponse = await request(app).post("/api/auth/register").send({
      name: "Admin User",
      email: "admin@example.com",
      password: "password123",
      role: "admin",
    });
    adminToken = adminResponse.body.token;

    // Create regular user
    const userResponse = await request(app).post("/api/auth/register").send({
      name: "Regular User",
      email: "user@example.com",
      password: "password123",
    });
    userToken = userResponse.body.token;
  });

  describe("POST /api/sweets", () => {
    test("should create sweet as admin", async () => {
      const sweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.99,
        quantity: 100,
        description: "Delicious chocolate bar",
      };

      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(sweetData.name);
      sweetId = response.body.data._id;
    });

    test("should fail to create sweet as regular user", async () => {
      const sweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.99,
        quantity: 100,
      };

      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${userToken}`)
        .send(sweetData)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/sweets", () => {
    beforeEach(async () => {
      // Create test sweets
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Gummy Bears",
          category: "Gummy",
          price: 1.99,
          quantity: 50,
        });
    });

    test("should get all sweets without authentication", async () => {
      const response = await request(app).get("/api/sweets").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.count).toBeGreaterThan(0);
    });
  });

  describe("GET /api/sweets/search", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Dark Chocolate",
          category: "Chocolate",
          price: 3.99,
          quantity: 30,
        });

      await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Milk Chocolate",
          category: "Chocolate",
          price: 2.99,
          quantity: 40,
        });
    });

    test("should search by name", async () => {
      const response = await request(app)
        .get("/api/sweets/search?name=Dark")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0].name).toContain("Dark");
    });

    test("should filter by category", async () => {
      const response = await request(app)
        .get("/api/sweets/search?category=Chocolate")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(
        response.body.data.every((sweet) => sweet.category === "Chocolate")
      ).toBe(true);
    });

    test("should filter by price range", async () => {
      const response = await request(app)
        .get("/api/sweets/search?minPrice=3&maxPrice=4")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(
        response.body.data.every(
          (sweet) => sweet.price >= 3 && sweet.price <= 4
        )
      ).toBe(true);
    });
  });

  describe("POST /api/sweets/:id/purchase", () => {
    beforeEach(async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Lollipop",
          category: "Lollipop",
          price: 0.99,
          quantity: 10,
        });
      sweetId = response.body.data._id;
    });

    test("should purchase sweet successfully", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 2 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(8);
    });

    test("should fail when quantity exceeds stock", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Not enough stock");
    });
  });

  describe("POST /api/sweets/:id/restock", () => {
    beforeEach(async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Candy Cane",
          category: "Candy",
          price: 1.49,
          quantity: 5,
        });
      sweetId = response.body.data._id;
    });

    test("should restock sweet as admin", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.quantity).toBe(15);
    });

    test("should fail to restock as regular user", async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/sweets/:id", () => {
    beforeEach(async () => {
      const response = await request(app)
        .post("/api/sweets")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          name: "Test Sweet",
          category: "Other",
          price: 1.0,
          quantity: 1,
        });
      sweetId = response.body.data._id;
    });

    test("should delete sweet as admin", async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test("should fail to delete as regular user", async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
    });
  });
});
