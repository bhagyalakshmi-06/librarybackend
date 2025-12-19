const mongoose = require("mongoose"); // ✅ ADD THIS

const Book = require("../models/Book");
const User = require("../models/User");

// Admin Login
exports.adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      role: "admin",
      token: "admin-token",
    });
  }

  res.status(401).json({ message: "Invalid admin credentials" });
};

// View all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Add new book (FIXED)
exports.addBook = async (req, res) => {
  try {
    console.log("DB NAME:", mongoose.connection.name); // 🔴 ADD

    const book = new Book(req.body);
    await book.save();

    console.log("SAVED BOOK:", book); // 🔴 ADD

    res.status(201).json(book);
  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


// Update book rental status
exports.updateBookStatus = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
