const db = require("../config/database");

exports.saveFile = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;

  try {
    const [result] = await db.query(
      "INSERT INTO files (user_id, content) VALUES (?, ?)",
      [userId, content]
    );

    res.json({ id: result.insertId });
  } catch (error) {
    console.error("Save file error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFile = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const [rows] = await db.query(
      "SELECT * FROM files WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get file error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
