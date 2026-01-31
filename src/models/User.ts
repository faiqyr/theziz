import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
}, { timestamps: true });

// Cek apakah model sudah ada? Kalau ada pakai itu, kalau belum buat baru.
// Ini wajib di Next.js agar tidak error "OverwriteModelError"
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;