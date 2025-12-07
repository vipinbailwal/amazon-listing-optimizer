const express = require("express");
const cors = require("cors");
require("dotenv").config();

const optimizeRoute = require("./routes/optimize");
const historyRoute = require("./routes/history");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("SalesDuo Backend Running"));

app.use("/api/optimize", optimizeRoute);
app.use("/api/history", historyRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port", PORT));
