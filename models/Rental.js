import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
    rentedAt: { type: Date, default: Date.now },
    returnDate: Date,
    status: { type: String, default: "Rented" }
  },
  { timestamps: true }
);

export default mongoose.model("Rental", rentalSchema);
