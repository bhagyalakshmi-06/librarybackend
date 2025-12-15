exports.getProfile = async (req, res) => {
  try {
    res.json({
      user: req.user,
      rentedCount: 0
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    Object.assign(req.user, req.body);
    await req.user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};
