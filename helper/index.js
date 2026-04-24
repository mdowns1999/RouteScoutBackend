const Joi = require("joi");

const stopSchema = Joi.object({
  id: Joi.string(),
  name: Joi.string(),
  address: Joi.string(),
  latLng: Joi.object({ lat: Joi.number(), lng: Joi.number() }),
  rating: Joi.number(),
  totalRatings: Joi.number(),
  photoUrl: Joi.string().allow(null, ""),
  types: Joi.array().items(Joi.string()),
  distanceFromStart: Joi.number(),
  driveTimeFromStart: Joi.string(),
  phone: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  mapsUrl: Joi.string().allow(null, ""),
  priceLevel: Joi.number().integer().min(0).max(4),
});

const tripSchema = Joi.object({
  startLocation: Joi.string().required(),
  endLocation: Joi.string().required(),
  startLatLng: Joi.object({ lat: Joi.number(), lng: Joi.number() }),
  endLatLng: Joi.object({ lat: Joi.number(), lng: Joi.number() }),
  budget: Joi.string(),
  rankPreference: Joi.string(),
  searchRadius: Joi.string(),
  selectedInterests: Joi.array().items(Joi.string()),
  selectedStops: Joi.array().items(stopSchema).required(),
  totalDistanceMiles: Joi.number(),
  totalDriveTime: Joi.string(),
}).options({ allowUnknown: false, abortEarly: false });

function validateTrip(req, res, next) {
  const { error } = tripSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }
  next();
}

module.exports = { validateTrip };
