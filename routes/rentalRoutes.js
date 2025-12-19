const express = require("express");
const router = express.Router();

const rentalController = require("../controllers/rentalController");
const { authMiddleware, adminAuthMiddleware } = require("../middleware/authMiddleware");

// ================= USER ROUTES =================

// User requests a rental
router.post("/", authMiddleware, rentalController.createRentalRequest);

// User sees their own rentals
router.get("/my", authMiddleware, rentalController.getMyRentals);

// ================= ADMIN ROUTES =================

// Admin sees all rental requests
router.get("/", adminAuthMiddleware, rentalController.getAllRentals);

// Admin approves a rental request
router.put("/:id/approve", adminAuthMiddleware, rentalController.approveRental);

// Admin rejects a rental request
router.put("/:id/reject", adminAuthMiddleware, rentalController.rejectRental);

// Admin marks a book as returned
router.put("/:id/return", adminAuthMiddleware, rentalController.returnBook);

module.exports = {router};
