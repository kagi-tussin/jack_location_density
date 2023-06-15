const { DataTypes } = require("sequelize");
const db = require("../config/database");

const JackLocationDensity = db.define("jack_location_density", {
	sign_up_date: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	province: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	month_: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
	year_: {
		type: DataTypes.INTEGER,
		allowNull: true,
	},
});

module.exports = JackLocationDensity;
