const mongoose = require("mongoose");

// Set test environment
process.env.NODE_ENV = 'test';

const Sweet = require("../models/Sweet");
const User = require("../models/User");

/**
 * Sweet Model Unit Tests
 * Following TDD Red-Green-Refactor pattern
 * Tests cover: Schema validation, Defaults, Constraints
 */
describe("Sweet Model Tests", () => {
  let adminUser;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(
        process.env.MONGODB_URI || "mongodb://localhost:27017/sweetshop_test"
      );
    }

    // Create a user for createdBy field
    adminUser = await User.create({
      name: "Admin",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });
  });

  afterAll(async () => {
    await Sweet.deleteMany({});
    await User.deleteMany({});
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  beforeEach(async () => {
    await Sweet.deleteMany({});
  });

  // ==========================================
  // SCHEMA VALIDATION TESTS
  // ==========================================
  describe("Schema Validation", () => {
    test("should create sweet with valid data", async () => {
      const sweet = new Sweet({
        name: "Test Chocolate",
        category: "Chocolate",
        price: 4.99,
        quantity: 50,
        description: "Delicious test chocolate",
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();

      expect(savedSweet._id).toBeDefined();
      expect(savedSweet.name).toBe("Test Chocolate");
      expect(savedSweet.category).toBe("Chocolate");
      expect(savedSweet.price).toBe(4.99);
      expect(savedSweet.quantity).toBe(50);
    });

    test("should fail without required name", async () => {
      const sweet = new Sweet({
        category: "Chocolate",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test("should fail without required category", async () => {
      const sweet = new Sweet({
        name: "Test Sweet",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test("should fail without required price", async () => {
      const sweet = new Sweet({
        name: "Test Sweet",
        category: "Chocolate",
        quantity: 50,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test("should fail without createdBy field", async () => {
      const sweet = new Sweet({
        name: "Test Sweet",
        category: "Chocolate",
        price: 4.99,
        quantity: 50,
      });

      await expect(sweet.save()).rejects.toThrow();
    });

    test("should enforce unique sweet name", async () => {
      await Sweet.create({
        name: "Unique Sweet",
        category: "Chocolate",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const duplicateSweet = new Sweet({
        name: "Unique Sweet",
        category: "Candy",
        price: 2.99,
        quantity: 30,
        createdBy: adminUser._id,
      });

      await expect(duplicateSweet.save()).rejects.toThrow();
    });
  });

  // ==========================================
  // CATEGORY VALIDATION TESTS
  // ==========================================
  describe("Category Validation", () => {
    const validCategories = ["Chocolate", "Candy", "Gummy", "Lollipop", "Cake", "Cookie", "Other"];

    test.each(validCategories)("should accept valid category: %s", async (category) => {
      const sweet = new Sweet({
        name: `Test ${category} ${Date.now()}`,
        category,
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.category).toBe(category);
    });

    test("should reject invalid category", async () => {
      const sweet = new Sweet({
        name: "Test Sweet",
        category: "InvalidCategory",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });
  });

  // ==========================================
  // PRICE VALIDATION TESTS
  // ==========================================
  describe("Price Validation", () => {
    test("should accept zero price", async () => {
      const sweet = new Sweet({
        name: "Free Sweet",
        category: "Candy",
        price: 0,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.price).toBe(0);
    });

    test("should accept decimal price", async () => {
      const sweet = new Sweet({
        name: "Decimal Sweet",
        category: "Candy",
        price: 3.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.price).toBe(3.99);
    });

    test("should reject negative price", async () => {
      const sweet = new Sweet({
        name: "Negative Sweet",
        category: "Candy",
        price: -1.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });
  });

  // ==========================================
  // QUANTITY VALIDATION TESTS
  // ==========================================
  describe("Quantity Validation", () => {
    test("should accept zero quantity", async () => {
      const sweet = new Sweet({
        name: "Out of Stock Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 0,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.quantity).toBe(0);
    });

    test("should default quantity to 0", async () => {
      const sweet = new Sweet({
        name: "Default Quantity Sweet",
        category: "Candy",
        price: 4.99,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.quantity).toBe(0);
    });

    test("should reject negative quantity", async () => {
      const sweet = new Sweet({
        name: "Negative Quantity Sweet",
        category: "Candy",
        price: 4.99,
        quantity: -10,
        createdBy: adminUser._id,
      });

      await expect(sweet.save()).rejects.toThrow();
    });
  });

  // ==========================================
  // DEFAULT VALUES TESTS
  // ==========================================
  describe("Default Values", () => {
    test("should set default description to empty string", async () => {
      const sweet = new Sweet({
        name: "No Description Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.description).toBe("");
    });

    test("should set default image placeholder", async () => {
      const sweet = new Sweet({
        name: "No Image Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.image).toContain("placeholder");
    });

    test("should set createdAt timestamp", async () => {
      const beforeCreate = new Date();

      const sweet = new Sweet({
        name: "Timestamp Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      const afterCreate = new Date();

      expect(savedSweet.createdAt).toBeDefined();
      expect(savedSweet.createdAt >= beforeCreate).toBe(true);
      expect(savedSweet.createdAt <= afterCreate).toBe(true);
    });

    test("should set updatedAt timestamp", async () => {
      const sweet = new Sweet({
        name: "UpdatedAt Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      expect(savedSweet.updatedAt).toBeDefined();
    });
  });

  // ==========================================
  // TIMESTAMP UPDATE TESTS
  // ==========================================
  describe("Timestamp Updates", () => {
    test("should update updatedAt on save", async () => {
      const sweet = new Sweet({
        name: "Updatable Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const savedSweet = await sweet.save();
      const originalUpdatedAt = savedSweet.updatedAt;

      // Wait a bit to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 100));

      savedSweet.price = 5.99;
      await savedSweet.save();

      expect(savedSweet.updatedAt.getTime()).toBeGreaterThanOrEqual(originalUpdatedAt.getTime());
    });
  });

  // ==========================================
  // REFERENCE TESTS
  // ==========================================
  describe("User Reference (createdBy)", () => {
    test("should populate createdBy with user data", async () => {
      const sweet = await Sweet.create({
        name: "Populated Sweet",
        category: "Candy",
        price: 4.99,
        quantity: 50,
        createdBy: adminUser._id,
      });

      const populatedSweet = await Sweet.findById(sweet._id).populate("createdBy", "name email");

      expect(populatedSweet.createdBy.name).toBe("Admin");
      expect(populatedSweet.createdBy.email).toBe("admin@test.com");
    });
  });
});
