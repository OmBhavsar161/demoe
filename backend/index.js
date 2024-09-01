require("dotenv").config();
const port = process.env.PORT;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const stripe = require("stripe")(process.env.STRIP_BACKEND_KEY);

const INR_TO_USD_CONVERSION_RATE = 83.91;

const convertINRToUSD = (amountInINR) => {
  return Math.round((amountInINR / INR_TO_USD_CONVERSION_RATE) * 100); // Convert to cents
};

app.use(express.json());

app.use(
  cors({
    origin: "https://demoe.vercel.app", // Allow requests from your frontend
    methods: ["POST", "GET"], // Allow specific methods
    allowedHeaders: ["Content-Type", "Authorization"], // Ensure necessary headers are alloweds
  })
);

// Connect to MongoDB without deprecated options
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// API Root Endpoint
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Serve Uploaded Images
app.use("/images", express.static("upload/images"));

// Image Upload Endpoint
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Product Schema
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Add Product Endpoint
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product = products[products.length - 1];
    id = last_product.id + 1;
  } else {
    id = 1;
  }

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });

  await product.save();
  console.log("saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Remove Product Endpoint
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Define the SupportPage schema
const supportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Create a Support model from the schema
const Support = mongoose.model("support_form_data", supportSchema);

app.post("/support", async (req, res) => {
  try {
    // Extract form data from request body
    const { name, email, phoneNumber, productId, issueDescription } = req.body;

    // Create a new support request document
    const supportRequest = new Support({
      name,
      email,
      phoneNumber,
      productId,
      issueDescription,
    });

    // Save the support request to the database
    await supportRequest.save();

    // Send a success response
    res.json({
      success: true,
      message:
        "Your response has been recorded. Our team will contact you within 24 hours.",
    });
  } catch (error) {
    console.error("Error saving support request:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to submit support request." });
  }
});

// Stripe Payment Endpoint
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body; // Extract items from request body

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // Payment methods accepted
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd", // Currency for the payment
          product_data: {
            name: item.name, // Name of the product
          },
          unit_amount: convertINRToUSD(item.price), // Price in cents (USD)
        },
        quantity: item.quantity, // Quantity of the product
      })),
      mode: "payment", // Mode of the checkout session
      success_url: "https://demoe.vercel.app/success", // Redirect URL after successful payment
      cancel_url: "https://demoe.vercel.app/cancel", // Redirect URL after payment cancellation
    });

    // Send session ID to the client to redirect to the Stripe checkout
    res.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start Server
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error : " + error);
  }
});
