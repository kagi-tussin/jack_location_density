const dbService = require("../services/dbService");

async function initiateETL(req, res) {
	try {
		console.log("Started ETL Pipeline ...");

		// Get distinct years from the jack_location table
		const years = await dbService.getYearsFromJackLocation();
		const yearArray = years.map((obj) => parseInt(obj.extract));
		for (const year of yearArray) {
			// Extract and aggregate data for the current year
			const strYear = year.toString();
			const aggregatedData = await dbService.extractAndAggregateDataFromJackLocation(strYear);
			// Populate the jack_location_density table for the current year
			await dbService.populateJackLocationDensity(aggregatedData);

			console.log(`ETL pipeline completed for year ${strYear}`);
		}
		// Send success response
		res.status(200).json({ message: "ETL pipeline Completed Successfully" });
	} catch (error) {
		console.error("ETL pipeline failed,", error);
		// Send error response
		res.status(500).json({ error: "An error occurred during the ETL pipeline" });
	}
}

module.exports = {
	initiateETL,
};
