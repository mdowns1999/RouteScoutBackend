const mongodb = require("../db/connect");

const getAllTrips = async (req, res) => {
  try {
    // #swagger.description = 'Get all Trips from the database.'
    const lists = await mongodb
      .getDb()
      .db("routeScoutTrips")
      .collection("sodas")
      .find()
      .toArray();

    res.setHeader("Content-Type", "application/json");
    res.status(200).json(lists);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getAllTrips,
};
