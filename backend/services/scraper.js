// backend/services/scraper.js
const puppeteer = require("puppeteer");

async function scrapeAmazonProduct(asin) {
    const url = `https://www.amazon.in/dp/${asin}`;

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    );

    console.log("Navigating to:", url);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Evaluate Amazon page
    const data = await page.evaluate(() => {
        // ---------- Get Title ----------
        const title =
            document.querySelector("#productTitle")?.innerText.trim() ||
            document.querySelector("h1")?.innerText.trim() ||
            "No title found";

        // ---------- Extract Description ----------
        let description = "";

        // 1. Amazon description box
        const descBox = document.querySelector("#productDescription");
        if (descBox) description += descBox.innerText.trim();

        // 2. A+ Content fallback (common on amazon.in)
        document.querySelectorAll(".a-section.a-spacing-small p")
            .forEach(p => description += "\n" + p.innerText.trim());

        description = description.trim() || "No description available";

        // ---------- Extract Bullet Points (New Best Logic) ----------
        let bulletPoints = [];

        // Amazon default (US/EU)
        document.querySelectorAll("#feature-bullets ul li")
            .forEach(li => bulletPoints.push(li.innerText.trim()));

        // Amazon India layout (New UI)
        document.querySelectorAll("div.a-section.a-spacing-small ul.a-unordered-list li")
            .forEach(li => bulletPoints.push(li.innerText.trim()));

        // Mobile / fallback layout
        document.querySelectorAll("ul.a-unordered-list.a-vertical.a-spacing-mini li")
            .forEach(li => bulletPoints.push(li.innerText.trim()));

        // Clean bullet points
        bulletPoints = bulletPoints
            .map(b => b.replace(/•/g, "").trim())
            .filter(
                b =>
                    b.length > 2 &&
                    !b.toLowerCase().includes("helpful") &&
                    !b.toLowerCase().includes("read more") &&
                    !b.toLowerCase().includes("report")
            );

        // Remove duplicates
        bulletPoints = [...new Set(bulletPoints)];

        return { title, description, bulletPoints };
    });

    await browser.close();

    // ---------- Final Validation ----------
    if (!data.title && !data.description) {
        throw new Error("Unable to extract product details.");
    }

    console.log("SCRAPER SUCCESS:", data);
    return data;
}

module.exports = scrapeAmazonProduct;


      