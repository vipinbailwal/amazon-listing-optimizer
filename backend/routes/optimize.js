// backend/routes/optimize.js
const express = require("express");
const router = express.Router();

const scrapeAmazonProduct = require("../services/scraper");
const { optimizeContent } = require("../services/ai");
const pool = require("../db");

router.post("/", async (req, res) => {
  try {
    const { asin } = req.body;

    if (!asin) {
      return res.status(400).json({ error: "ASIN is required" });
    }

    console.log("Scraping product for ASIN:", asin);
    const scraped = await scrapeAmazonProduct(asin);

    if (!scraped) {
      return res.status(500).json({ error: "Failed to scrape product" });
    }

    // Normalize original data
    const originalTitle = scraped.title || "";
    const originalBullets = Array.isArray(scraped.bulletPoints)
      ? scraped.bulletPoints
      : [];
    const originalDescription = scraped.description || "";

    // Call AI optimizer
    console.log("Sending data to AI optimizer...");
    const optimized = await optimizeContent(
      originalTitle,
      originalBullets,
      originalDescription
    );

    const optimizedTitle = optimized.title || originalTitle;
    const optimizedBullets = Array.isArray(optimized.bullets)
      ? optimized.bullets
      : [];
    const optimizedDescription = optimized.description || originalDescription;
    const optimizedKeywords = Array.isArray(optimized.keywords)
      ? optimized.keywords
      : [];

    // Ensure nothing is undefined before DB insert
    const safeAsin = asin || "";
    const safeOriginalTitle = originalTitle;
    const safeOriginalBullets = JSON.stringify(originalBullets);
    const safeOriginalDescription = originalDescription;
    const safeOptimizedTitle = optimizedTitle;
    const safeOptimizedBullets = JSON.stringify(optimizedBullets);
    const safeOptimizedDescription = optimizedDescription;
    const safeKeywords = JSON.stringify(optimizedKeywords);

    // Insert product row (if not exists)
    await pool.execute(
      "INSERT IGNORE INTO products (asin, title) VALUES (?, ?)",
      [safeAsin, safeOriginalTitle]
    );

    // Insert optimization history row
    await pool.execute(
      `INSERT INTO optimizations
      (asin, original_title, original_bullets, original_description,
       optimized_title, optimized_bullets, optimized_description, keywords)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        safeAsin,
        safeOriginalTitle,
        safeOriginalBullets,
        safeOriginalDescription,
        safeOptimizedTitle,
        safeOptimizedBullets,
        safeOptimizedDescription,
        safeKeywords,
      ]
    );

    return res.json({
      original: {
        title: originalTitle,
        bulletPoints: originalBullets,
        description: originalDescription,
      },
      optimized: {
        title: optimizedTitle,
        bulletPoints: optimizedBullets,
        description: optimizedDescription,
        keywords: optimizedKeywords,
      },
    });
  } catch (err) {
    console.error("Optimize Route Error:", err);
    return res.status(500).json({ error: "AI optimization or DB failed" });
  }
});

module.exports = router;
