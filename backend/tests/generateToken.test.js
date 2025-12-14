const jwt = require("jsonwebtoken");
const generateToken = require("../utils/generateToken");

/**
 * Token Generation Utility Tests
 * Following TDD Red-Green-Refactor pattern
 */
describe("generateToken Utility", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.JWT_SECRET = "test-secret-key";
    process.env.JWT_EXPIRE = "7d";
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  // ==========================================
  // TOKEN GENERATION TESTS
  // ==========================================
  describe("Token Generation", () => {
    test("should generate a valid JWT token", () => {
      const userId = "507f1f77bcf86cd799439011";
      const token = generateToken(userId);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3); // JWT has 3 parts
    });

    test("should include user ID in token payload", () => {
      const userId = "507f1f77bcf86cd799439011";
      const token = generateToken(userId);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.id).toBe(userId);
    });

    test("should generate different tokens for different users", () => {
      const token1 = generateToken("507f1f77bcf86cd799439011");
      const token2 = generateToken("507f1f77bcf86cd799439012");

      expect(token1).not.toBe(token2);
    });

    test("should include expiration in token", () => {
      const userId = "507f1f77bcf86cd799439011";
      const token = generateToken(userId);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      expect(decoded.exp).toBeDefined();
      expect(decoded.iat).toBeDefined();
    });
  });

  // ==========================================
  // TOKEN VERIFICATION TESTS
  // ==========================================
  describe("Token Verification", () => {
    test("should be verifiable with correct secret", () => {
      const userId = "507f1f77bcf86cd799439011";
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, process.env.JWT_SECRET);
      }).not.toThrow();
    });

    test("should fail verification with wrong secret", () => {
      const userId = "507f1f77bcf86cd799439011";
      const token = generateToken(userId);

      expect(() => {
        jwt.verify(token, "wrong-secret");
      }).toThrow();
    });
  });
});
