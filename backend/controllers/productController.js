// controllers/productController.js
const Product = require('../models/product');
const cloudinary = require('../cloudinary.js'); // Import cloudinary config

// Create a new product
const createProduct = async (req, res) => {
  const { title, description, tags, userId } = req.body;
  const images = req.files ? req.files.images : []; // Assuming files are sent via multipart/form-data

  try {
    // Upload images to Cloudinary
    const imageUrls = [];
    for (let image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath); // Upload to cloudinary
      imageUrls.push(result.secure_url); // Push the secure URL of the uploaded image
    }

    // Create a new product in MongoDB
    const newProduct = new Product({
      title,
      description,
      tags: tags.split(','), // Assuming tags are comma-separated
      images: imageUrls,
      userId,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading product' });
  }
};

module.exports = { createProduct };
