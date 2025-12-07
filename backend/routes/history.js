const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/:asin", async (req, res) => {
  const { asin } = req.params;

  try {
    const [rows] = await db.execute(
      `SELECT *
       FROM optimizations
       WHERE asin = ?
       ORDER BY created_at DESC`,
      [asin]
    );

    const history = rows.map(row => ({
      id: row.id,
      asin: row.asin,
      original: {
        title: row.original_title,
        bulletPoints: JSON.parse(row.original_bullets),
        description: row.original_description
      },
      optimized: {
        title: row.optimized_title,
        bulletPoints: JSON.parse(row.optimized_bullets),
        description: row.optimized_description,
        keywords: JSON.parse(row.keywords)
      },
      createdAt: row.created_at
    }));

    res.json({ asin, history });
  } catch (err) {
    res.status(500).json({ error: "History fetch failed" });
  }
});

module.exports = router;
