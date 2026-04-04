const router = require("express").Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/api/trips", require("./trips"));

module.exports = router;
