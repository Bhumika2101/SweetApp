const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Sweet = require("./models/Sweet");

// Load environment variables
dotenv.config();

const sweets = [
  {
    name: "Milk Chocolate Bar",
    category: "Chocolate",
    price: 249,
    quantity: 150,
    description: "Smooth and creamy milk chocolate bar",
    image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400",
  },
  {
    name: "Dark Chocolate Truffle",
    category: "Chocolate",
    price: 399,
    quantity: 80,
    description: "Rich dark chocolate truffle with cocoa dusting",
    image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400",
  },
  {
    name: "Gummy Bears",
    category: "Gummy",
    price: 149,
    quantity: 200,
    description: "Colorful fruity gummy bears",
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400",
  },
  {
    name: "Strawberry Lollipop",
    category: "Lollipop",
    price: 79,
    quantity: 250,
    description: "Sweet strawberry flavored lollipop",
    image: "https://images.unsplash.com/photo-1625869016774-3a92be2ae2cd?w=400",
  },
  {
    name: "Chocolate Chip Cookies",
    category: "Cookie",
    price: 279,
    quantity: 120,
    description: "Fresh baked chocolate chip cookies",
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
  },
  {
    name: "Rainbow Candy Strips",
    category: "Candy",
    price: 119,
    quantity: 180,
    description: "Colorful tangy candy strips",
    image: "https://images.unsplash.com/photo-1581798459219-c8f5e27b7b76?w=400",
  },
  {
    name: "Vanilla Cupcake",
    category: "Cake",
    price: 199,
    quantity: 90,
    description: "Moist vanilla cupcake with buttercream frosting",
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400",
  },
  {
    name: "Sour Gummy Worms",
    category: "Gummy",
    price: 179,
    quantity: 160,
    description: "Tangy sour gummy worms",
    image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400",
  },
  {
    name: "Peppermint Candy Cane",
    category: "Candy",
    price: 59,
    quantity: 300,
    description: "Classic red and white peppermint candy cane",
    image: "https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?w=400",
  },
  {
    name: "White Chocolate Macadamia Cookie",
    category: "Cookie",
    price: 319,
    quantity: 100,
    description: "Premium white chocolate and macadamia nut cookie",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400",
  },
  {
    name: "Caramel Lollipop",
    category: "Lollipop",
    price: 99,
    quantity: 220,
    description: "Creamy caramel swirl lollipop",
    image: "https://images.unsplash.com/photo-1514517521153-1be72277b32f?w=400",
  },
  {
    name: "Chocolate Fudge Cake",
    category: "Cake",
    price: 479,
    quantity: 50,
    description: "Decadent triple layer chocolate fudge cake",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
  },
  {
    name: "Fruit Jellies",
    category: "Gummy",
    price: 199,
    quantity: 140,
    description: "Assorted fruit flavored jellies",
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400",
  },
  {
    name: "Mint Chocolate Bar",
    category: "Chocolate",
    price: 259,
    quantity: 110,
    description: "Refreshing mint chocolate bar",
    image: "https://images.unsplash.com/photo-1610450949065-1f2841536c88?w=400",
  },
  {
    name: "Cotton Candy",
    category: "Other",
    price: 149,
    quantity: 130,
    description: "Light and fluffy cotton candy",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
  },
  {
    name: "Butterscotch Candy",
    category: "Candy",
    price: 139,
    quantity: 190,
    description: "Classic butterscotch hard candy",
    image: "https://images.unsplash.com/photo-1582058091505-be62327df9cf?w=400",
  },
  {
    name: "Red Velvet Cake",
    category: "Cake",
    price: 519,
    quantity: 45,
    description: "Classic red velvet cake with cream cheese frosting",
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400",
  },
  {
    name: "Oatmeal Raisin Cookie",
    category: "Cookie",
    price: 239,
    quantity: 135,
    description: "Chewy oatmeal cookie with plump raisins",
    image: "https://images.unsplash.com/photo-1590080876849-b5c82c8555aa?w=400",
  },
  {
    name: "Assorted Chocolate Box",
    category: "Chocolate",
    price: 999,
    quantity: 60,
    description: "Premium assorted chocolate gift box",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400",
  },
  {
    name: "Bubble Gum Lollipop",
    category: "Lollipop",
    price: 89,
    quantity: 200,
    description: "Fun bubble gum flavored lollipop",
    image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400",
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected...");

    // Clear existing data
    await User.deleteMany({});
    await Sweet.deleteMany({});
    console.log("Existing data cleared...");

    // Create admin user
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@sweetbhumi.com",
      password: "bhumi123",
      role: "admin",
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@sweetbhumi.com");
    console.log("Password: bhumi123");

    // Create sweets with admin as creator
    const sweetsWithCreator = sweets.map((sweet) => ({
      ...sweet,
      createdBy: adminUser._id,
    }));

    await Sweet.insertMany(sweetsWithCreator);
    console.log(`${sweets.length} sweet records created successfully!`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Admin User: 1`);
    console.log(`   - Sweet Records: ${sweets.length}`);
    console.log("\n🔐 Admin Credentials:");
    console.log(`   Email: admin@sweetbhumi.com`);
    console.log(`   Password: bhumi123`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
