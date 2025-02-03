const db = require("../config/database");

exports.saveFile = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.execute(
      "INSERT INTO files (user_id, content) VALUES (?, ?)",
      [userId, content]
    );

    res.json({ id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFile = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [files] = await db.execute(
      "SELECT * FROM files WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(files[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
