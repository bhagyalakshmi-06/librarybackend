const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/login", adminController.adminLogin);
router.get("/users", adminController.getUsers);
router.get("/books", adminController.getBooks);
router.post("/books", adminController.addBook);
router.put("/books/:id", adminController.updateBookStatus);

module.exports = router;
