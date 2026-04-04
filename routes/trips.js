const router = require("express").Router();
const ctrl = require("../controller/trips");
const { validateTrip } = require("../helper");

router.post("/", validateTrip, ctrl.createTrip);
router.get("/:id/share", ctrl.getTripById);
router.get("/:id", ctrl.getTripById);
router.put("/:id", ctrl.updateTrip);
router.delete("/:id", ctrl.deleteTrip);

module.exports = router;
