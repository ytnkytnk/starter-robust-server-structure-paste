require("dotenv").config();
const {
  NODE_ENV = "development",
  DEVELOPMENT_DATABASE_URL,
  PRODUCTION_DATABASE_URL,
} = process.env;
const URL =
  NODE_ENV === "production"
    ? PRODUCTION_DATABASE_URL
    : DEVELOPMENT_DATABASE_URL;

console.log("====================");
console.log(`Current environment: ${NODE_ENV}`);
console.log(`Database URL: ${URL}`);

module.exports = {
  development: {
    client: "postgresql",
    connection: URL,
    useNullAsDefault: true,
  },

  production: {
    client: "postgresql",
    connection: URL,
    useNullAsDefault: true,
  },
};
