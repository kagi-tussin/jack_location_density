const express = require("express");
const etlRouter = require("./routes/etl");
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api", etlRouter);

// Error handling middleware
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(port, () => {
	console.log(`ETL Pipeline Initiated. Server is running on port ${port}`);
});
