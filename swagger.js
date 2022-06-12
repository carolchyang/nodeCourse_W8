const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Meta API",
    description: "Node 直播班 - W8",
  },
  host: "https://warm-ridge-65785.herokuapp.com",
  schemes: ["http", "https"],
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      in: "headers",
      name: "authorization",
      description: "請加上 JWT Token",
    },
  },
};

const outputFile = "./swagger-output.json";

const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc);
