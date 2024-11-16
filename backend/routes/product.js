const express = require('express');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');
const cloudinary = require('../cloudinary');
const multer = require('multer'); 

const router = express.Router();

// Middleware to authenticate JWT
// Configure multer storage (in memory storage)
const storage = multer.memoryStorage(); // Using memory storage to store image data in buffer
const upload = multer({ storage: storage });  // Using multer with memory storage

// Middleware to authenticate JWT token
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Token is required' });
  }

  jwt.verify(token, 'secretkey', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.userId;
    next();
  });
};

// Create a new product with image upload
router.post('/', authenticate, upload.array('images', 10), async (req, res) => {
  const { title, description, tags } = req.body;
  const images = req.files;  // 'images' is the field name sent from the frontend

  // Basic validation for required fields
  if (!title || !description || !images || images.length === 0 || images.length > 10) {
    return res.status(400).json({ message: 'Title, description, and at least 1 image are required' });
  }

  try {
    const uploadedImages = [];

    // Loop through each image and upload to Cloudinary
    for (const image of images) {
      const result = await cloudinary.uploader.upload_stream(
        { folder: 'products' }, // Optional: You can specify a folder on Cloudinary
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Error uploading to Cloudinary' });
          }
          uploadedImages.push(result.secure_url);  // Collect the Cloudinary image URL
        }
      );
      result.end(image.buffer);  // Upload image buffer to Cloudinary
    }

    // After successful image upload, create a new product
    const newProduct = new Product({
      title,
      description,
      tags,
      images: uploadedImages,  // Store Cloudinary URLs of images
      userId: req.userId,
    });

    await newProduct.save();  // Save the product to the database
    res.status(201).json(newProduct);  // Send the created product as response

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Search Products (Global Search by Keyword)
router.get('/', authenticate, async (req, res) => {
  const { keyword } = req.query;

  try {
    const products = await Product.find({
      userId: req.userId,
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { tags: { $in: [keyword] } },
      ],
    });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Single Product Details
router.get('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a Product Details
router.put('/:id', authenticate, async (req, res) => {
  const { title, description, tags, images } = req.body;

  // Validate input data
  if (!title || !description || !images || images.length === 0 || images.length > 10) {
    return res.status(400).json({ message: 'Title, description, and 1-10 images are required' });
  }

  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If images are updated, upload them to Cloudinary
    const uploadedImages = [];
    if (images.length > 0) {
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image, {
          folder: 'products',
        });
        uploadedImages.push(result.secure_url);
      }
      product.images = uploadedImages; // Replace old images with the new ones
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.tags = tags || product.tags;

    await product.save();
    res.status(200).json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a Product
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
