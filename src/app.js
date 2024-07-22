const express = require("express");
const app = express();

const usersRouter = require("./users/users.router");
const pastesRouter = require("./pastes/pastes.router");
const productsRouter = require("../api/products/products.router");

// built-in middleware that adds a body property to the request (req.body).
// The req.body object contains the parsed data.
// If there's no body to parse, the Content-Type isn't matched, or an error occurs, then it returns an empty object ({}).
app.use(express.json());

// debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// TODO: Follow instructions in the checkpoint to implement ths API.
const pastes = require("./data/pastes-data");

app.use("/users", usersRouter);
app.use("/pastes", pastesRouter); // Note: app.use
app.use("/api/products", productsRouter);

// for debugging
app.use((req, res, next) => {
  console.log(`Request made to: ${req.url}`);
  next();
});

require("dotenv").config();
console.log("Development Database URL:", process.env.DEVELOPMENT_DATABASE_URL);
console.log("Production Database URL:", process.env.PRODUCTION_DATABASE_URL);

// // return one paste from /:pasteId
// app.use("/pastes/:pasteId", (req, res, next) => {
//   const { pasteId } = req.params;
//   // console.log("-----------------------");
//   // console.log(req.params.pasteId);
//   const foundPaste = pastes.find((paste) => paste.key === Number(pasteId));

//   if (foundPaste) {
//     res.json({ data: foundPaste });
//   } else {
//     next({
//       status: 404,
//       message: `Paste id not found: ${pasteId}`,
//     });
//   }
// });

// Defines a handler for the /pastes path
// By changing the code from app.use(...) to app.get(...),
// the handler is only called if the HTTP method of the incoming request is GET.
// GET
// app.get("/pastes", (req, res) => {
//   res.json({ data: pastes });
// });

// note
// *** app.use([path,] callback [, callback...])
// default path = '/' (root)
// https://expressjs.com/en/4x/api.html#res.json
// *** res.json([body])
// JSON file format: {"Prefecture": "Hyogo", "Capital": "Kobe"}

// // New middleware function to validate the request body
// function bodyHasTextProperty(req, res, next) {
//   const { data: { text } = {} } = req.body;
//   if (text) {
//     return next(); // Call `next()` without an error message if the result exists
//   }
//   next({
//     status: 400, // Bad request
//     message: "A 'text' property is required.",
//   });
// }

// // Variable to hold the next ID
// // Because some IDs may already be used, find the largest assigned ID
// // reduce method: reduce(callbackFn, initialValue)
// let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// app.post(
//   "/pastes",
//   bodyHasTextProperty, // Add validation middleware function
//   (req, res) => {
//     // Route handler no longer has validation code.
//     const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
//       req.body;
//     const newPaste = {
//       id: ++lastPasteId, // Increment last id then assign as the current ID
//       name,
//       syntax,
//       exposure,
//       expiration,
//       text,
//       user_id,
//     };
//     pastes.push(newPaste);
//     res.status(201).json({ data: newPaste });
//   }
// );

// // POST ... without middleware, it has validation logic
// app.post("/pastes", (req, res, next) => {
//   // if the body doesn't contain a data property, the destructuring still succeeds because you're supplying a default value of {} for the data property.
//   const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
//     req.body;
//   if (text) {
//     const newPaste = {
//       id: ++lastPasteId, // Increment last ID, then assign as the current ID
//       name,
//       syntax,
//       exposure,
//       expiration,
//       text,
//       user_id,
//     };
//     pastes.push(newPaste);
//     res.status(201).json({ data: newPaste });
//   } else {
//     res.sendStatus(400);
//   }
// });

// Not found handler
app.use((req, res, next) => {
  next(`Not found: ${req.originalUrl}`);
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.send(err);
});

app.use((error, req, res, next) => {
  console.error(error);
  const { status = 500, message = "Something went wrong!" } = error;
  res.status(status).json({ error: message });
});

module.exports = app;

// entire code for the reference
// https://github.com/Thinkful-Ed/starter-robust-server-structure-paste/tree/05-advanced-tips/src
