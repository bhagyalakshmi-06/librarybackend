const express = require("express");
const router = express.Router();

const bookController = require("../controllers/bookController");

// Get all books
router.get("/", bookController.getBooks);

// Get single book
router.get("/:id", bookController.getBookById);

// Update book (admin or rental status)
router.put("/:id", bookController.updateBook);

module.exports = {router};
