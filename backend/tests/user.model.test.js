const mongoose = require("mongoose");

// Set test environment
process.env.NODE_ENV = 'test';

const User = require("../models/User");

/**
 * User Model Unit Tests
 * Following TDD Red-Green-Refactor pattern
 * Tests cover: Schema validation, Password hashing, Methods
 */
describe("User Model Tests", () => {
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
  });

  // ==========================================
  // SCHEMA VALIDATION TESTS
  // ==========================================
  describe("Schema Validation", () => {
    test("should create user with valid data", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const savedUser = await user.save();
      
      expect(savedUser._id).toBeDefined();
      expect(savedUser.name).toBe("Test User");
      expect(savedUser.email).toBe("test@example.com");
      expect(savedUser.role).toBe("user"); // default role
    });

    test("should fail without required name", async () => {
      const user = new User({
        email: "test@example.com",
        password: "password123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should fail without required email", async () => {
      const user = new User({
        name: "Test User",
        password: "password123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should fail without required password", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should fail with invalid email format", async () => {
      const user = new User({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should fail with password less than 6 characters", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "12345",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should convert email to lowercase", async () => {
      const user = new User({
        name: "Test User",
        email: "TEST@EXAMPLE.COM",
        password: "password123",
      });

      const savedUser = await user.save();
      expect(savedUser.email).toBe("test@example.com");
    });

    test("should trim name whitespace", async () => {
      const user = new User({
        name: "  Test User  ",
        email: "test@example.com",
        password: "password123",
      });

      const savedUser = await user.save();
      expect(savedUser.name).toBe("Test User");
    });

    test("should default role to 'user'", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const savedUser = await user.save();
      expect(savedUser.role).toBe("user");
    });

    test("should accept 'admin' role", async () => {
      const user = new User({
        name: "Admin User",
        email: "admin@example.com",
        password: "password123",
        role: "admin",
      });

      const savedUser = await user.save();
      expect(savedUser.role).toBe("admin");
    });

    test("should fail with invalid role", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        role: "superadmin",
      });

      await expect(user.save()).rejects.toThrow();
    });

    test("should enforce unique email", async () => {
      const user1 = new User({
        name: "User One",
        email: "same@example.com",
        password: "password123",
      });
      await user1.save();

      const user2 = new User({
        name: "User Two",
        email: "same@example.com",
        password: "password456",
      });

      await expect(user2.save()).rejects.toThrow();
    });

    test("should set createdAt timestamp", async () => {
      const beforeCreate = new Date();
      
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      const savedUser = await user.save();
      
      const afterCreate = new Date();
      
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.createdAt >= beforeCreate).toBe(true);
      expect(savedUser.createdAt <= afterCreate).toBe(true);
    });
  });

  // ==========================================
  // PASSWORD HASHING TESTS
  // ==========================================
  describe("Password Hashing", () => {
    test("should hash password before saving", async () => {
      const plainPassword = "password123";
      
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: plainPassword,
      });

      const savedUser = await user.save();
      
      expect(savedUser.password).not.toBe(plainPassword);
      expect(savedUser.password.length).toBeGreaterThan(50); // bcrypt hash length
    });

    test("should not rehash password if not modified", async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      const savedUser = await user.save();
      const originalHash = savedUser.password;

      // Modify non-password field
      savedUser.name = "Updated Name";
      await savedUser.save();

      expect(savedUser.password).toBe(originalHash);
    });
  });

  // ==========================================
  // PASSWORD MATCH METHOD TESTS
  // ==========================================
  describe("matchPassword Method", () => {
    let user;

    beforeEach(async () => {
      user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await user.save();
      
      // Need to fetch with password field
      user = await User.findOne({ email: "test@example.com" }).select("+password");
    });

    test("should return true for correct password", async () => {
      const isMatch = await user.matchPassword("password123");
      expect(isMatch).toBe(true);
    });

    test("should return false for incorrect password", async () => {
      const isMatch = await user.matchPassword("wrongpassword");
      expect(isMatch).toBe(false);
    });

    test("should return false for empty password", async () => {
      const isMatch = await user.matchPassword("");
      expect(isMatch).toBe(false);
    });

    test("should return false for null password", async () => {
      const isMatch = await user.matchPassword(null);
      expect(isMatch).toBe(false);
    });
  });

  // ==========================================
  // PASSWORD FIELD VISIBILITY TESTS
  // ==========================================
  describe("Password Field Visibility", () => {
    beforeEach(async () => {
      const user = new User({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });
      await user.save();
    });

    test("should not include password by default", async () => {
      const user = await User.findOne({ email: "test@example.com" });
      expect(user.password).toBeUndefined();
    });

    test("should include password when explicitly selected", async () => {
      const user = await User.findOne({ email: "test@example.com" }).select("+password");
      expect(user.password).toBeDefined();
    });
  });
});
