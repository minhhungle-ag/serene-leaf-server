const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const checkAuth = require('../middlewares/checkAuth');

// Add to cart
router.post('/add', checkAuth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalAmount: 0 });
    }

    // Check if the product is already in the cart
    const cartItemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (cartItemIndex > -1) {
      // Update quantity if product is already in cart
      cart.items[cartItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity: quantity,
        price: product.price
      });
    }

    // Recalculate total amount
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product added to cart successfully', cart });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'An error occurred while adding to cart' });
  }
});

module.exports = router;
