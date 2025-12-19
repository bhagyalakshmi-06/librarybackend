const Rental = require("../models/Rental");
const Book = require("../models/Book");

// ================= USER =================

// User requests rental
exports.createRentalRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book || !book.available) {
      return res.status(400).json({ message: "Book not available" });
    }

    // Prevent duplicate requests
    const existingRental = await Rental.findOne({
      user: req.user.id,
      book: bookId,
      status: { $in: ["pending", "rented"] },
    });

    if (existingRental) {
      return res.status(400).json({ message: "Rental already requested" });
    }

    const rental = new Rental({
      user: req.user.id,
      book: bookId,
      status: "pending",
      returnDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    await rental.save();

    res.status(201).json({ message: "Rental request sent", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User sees own rentals
exports.getMyRentals = async (req, res) => {
  try {
    const rentals = await Rental.find({ user: req.user.id })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN =================

// Admin sees all rentals
exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.find()
      .populate("user", "name email")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin approves rental
exports.approveRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    rental.status = "rented";
    await rental.save();

    await Book.findByIdAndUpdate(rental.book, {
      available: false,
      rentedBy: rental.user,
      rentedAt: new Date(),
    });

    res.json({ message: "Rental approved", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin rejects rental
exports.rejectRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ message: "Rental not found" });

    rental.status = "rejected";
    await rental.save();

    res.json({ message: "Rental rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin marks return
// ADMIN → Return book
exports.returnBook = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Update rental status and return date
    rental.status = "returned";
    rental.returnDate = new Date();
    await rental.save();

    // Update the book to be available again
    await Book.findByIdAndUpdate(rental.book, {
      available: true,
      rentedBy: null,
      rentedAt: null,
    });

    res.json({ message: "Book returned successfully", rental });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

