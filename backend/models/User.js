const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 5 },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String, default: '' },
  profilePic: { type: String, default: '' }, // stores filename e.g. 'abc123.jpg'
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpiry: { type: Date, default: null },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

// ── Pre-save hook: hash password before storing ────────────────
// This runs automatically every time you call user.save()
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return; // skip password hash if unchanged
  }

  const saltRounds = 12;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ── Instance method: compare entered password with stored hash ──
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);