//Run: npm run swagger-autogen to update Swagger docs
const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Poppin Soda API",
    description: "The backedn service for Poppin sodas.  The website can be accessed at: https://mdowns1999.github.io/poppin-soda/",
  },
  host: "poppinsodasbackend.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
