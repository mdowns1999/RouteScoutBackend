const { ObjectId } = require("mongodb");
const mongodb = require("../db/connect");

const getCollection = () =>
  mongodb.getDb().db("routeScoutTrips").collection("trips");

const parseObjectId = (id, res) => {
  try {
    return new ObjectId(id);
  } catch {
    res.status(400).json({ error: "Invalid trip ID format" });
    return null;
  }
};

const createTrip = async (req, res, next) => {
  // #swagger.description = 'Create a new trip and return its ID.'
  // #swagger.tags = ['Trips']
  try {
    const now = new Date();
    const doc = { ...req.body, createdAt: now, updatedAt: now };
    const result = await getCollection().insertOne(doc);
    res.status(201).json({ tripId: result.insertedId.toString() });
  } catch (err) {
    next(err);
  }
};

const getTripById = async (req, res, next) => {
  // #swagger.description = 'Retrieve a single trip by its MongoDB ObjectId.'
  // #swagger.tags = ['Trips']
  try {
    const objectId = parseObjectId(req.params.id, res);
    if (!objectId) return;

    const trip = await getCollection().findOne({ _id: objectId });
    if (!trip) return res.status(404).json({ error: "Trip not found" });

    res.status(200).json(trip);
  } catch (err) {
    next(err);
  }
};

const updateTrip = async (req, res, next) => {
  // #swagger.description = 'Partially update a trip by its MongoDB ObjectId.'
  // #swagger.tags = ['Trips']
  try {
    const objectId = parseObjectId(req.params.id, res);
    if (!objectId) return;

    const result = await getCollection().updateOne(
      { _id: objectId },
      { $set: { ...req.body, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ error: "Trip not found" });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

const deleteTrip = async (req, res, next) => {
  // #swagger.description = 'Delete a trip by its MongoDB ObjectId.'
  // #swagger.tags = ['Trips']
  try {
    const objectId = parseObjectId(req.params.id, res);
    if (!objectId) return;

    const result = await getCollection().deleteOne({ _id: objectId });

    if (result.deletedCount === 0) return res.status(404).json({ error: "Trip not found" });

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTrip, getTripById, updateTrip, deleteTrip };
