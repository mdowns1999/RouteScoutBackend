//Run: npm run swagger-autogen to update Swagger docs
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "RouteScout Trips API",
    description: "Backend service for the RouteScout web app. Stores and retrieves trip data including stops, routes, and preferences.",
  },
  host: "routescoutbackend.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
