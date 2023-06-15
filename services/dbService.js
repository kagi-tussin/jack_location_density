const { Pool } = require("pg");
const { user } = require("pg/lib/defaults");

// Create a connection pool to handle database connections
const pool = new Pool({
	user: process.env.USER,
	host: process.env.HOST,
	database: process.env.DATABASE,
	password: process.env.PASSWORD,
	port: process.env.PORT,
	ssl: {
		sslmode: "require",
	},
});

// Function to extract the years from the jack_location table
async function getYearsFromJackLocation() {
	const client = await pool.connect();
	try {
		const query = `SELECT DISTINCT(EXTRACT(YEAR FROM (DATE(sign_up_date))))
						FROM jack_location ORDER BY EXTRACT(YEAR FROM
							(DATE(sign_up_date))) ASC;`;
		const result = await client.query(query);
		return result.rows;
	} finally {
		client.release();
	}
}

// Function to extract data from the jack_location table
async function extractAndAggregateDataFromJackLocation(year) {
	const client = await pool.connect();
	try {
		const query = `
			SELECT
				EXTRACT(MONTH FROM (DATE(sign_up_date))) AS month_,
				EXTRACT(YEAR FROM (DATE(sign_up_date))) AS year_,
				CASE WHEN province IS NULL THEN 'Unidentified' ELSE province END AS province,
				COUNT(*) AS sign_ups
			FROM
				jack_location
			WHERE
				EXTRACT(YEAR FROM (DATE(sign_up_date))) = $1
			GROUP BY
				EXTRACT(MONTH FROM (DATE(sign_up_date))),
				EXTRACT(YEAR FROM (DATE(sign_up_date))),
				province
			ORDER BY
				EXTRACT(MONTH FROM (DATE(sign_up_date))) ASC;
		`;
		const result = await client.query(query, [parseInt(year)]);
		return result.rows;
	} finally {
		client.release();
	}
}

// Function to populate the "jack_location_density" table
async function populateJackLocationDensity(data) {
	try {
		// Get a client from the pool
		client = await pool.connect();

		// Iterate over the aggregated data and insert each row into the table
		for (const row of data) {
			const { month_, year_, province, sign_ups } = row;
			// Execute the INSERT INTO statement
			await client.query(`INSERT INTO jack_location_density (month_, year_, province, sign_ups) VALUES ($1, $2, $3, $4);`, [
				month_,
				year_,
				province,
				sign_ups,
			]);
		}
	} catch (error) {
		console.error("Error inserting aggregated data:", error);
	} finally {
		// Release the client back to the pool
		if (client) {
			client.release();
		}
	}
}

module.exports = {
	getYearsFromJackLocation,
	extractAndAggregateDataFromJackLocation,
	populateJackLocationDensity,
};
