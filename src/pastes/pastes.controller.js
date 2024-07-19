const pastes = require("../data/pastes-data");

function list(req, res) {
  const { userId } = req.params;
  // If userId is provided, it will filter the pastes to only those matching the user ID.
  // If userId is not provided (is falsy), () => true ensures that all pastes are included in the filtered result, effectively applying no filter at all.
  res.json({
    data: pastes.filter(
      userId ? (paste) => paste.user_id === Number(userId) : () => true
    ),
  });
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

// function bodyHasTextProperty(req, res, next) {
//   const { data: { text } = {} } = req.body;
//   if (text) {
//     return next();
//   }
//   next({
//     status: 400,
//     message: "A 'text' property is required.",
//   });
// }

// ↓↓↓
// refactor function to expand to other parameters, not only for text
// validate with any given parameter
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

function create(req, res) {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  const newPaste = {
    id: ++lastPasteId, // Increment last id then assign as the current ID
    name,
    syntax,
    exposure,
    expiration,
    text,
    user_id,
  };
  pastes.push(newPaste);
  res.status(201).json({ data: newPaste });
}

function exposurePropertyIsValid(req, res, next) {
  const { data: { exposure } = {} } = req.body;
  const validExposure = ["private", "public"];
  if (validExposure.includes(exposure)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'exposure' property must be one of ${validExposure}. Received: ${exposure}`,
  });
}

function syntaxPropertyIsValid(req, res, next) {
  const { data: { syntax } = {} } = req.body;
  const validSyntax = [
    "None",
    "Javascript",
    "Python",
    "Ruby",
    "Perl",
    "C",
    "Scheme",
  ];
  if (validSyntax.includes(syntax)) {
    return next();
  }
  next({
    status: 400,
    message: `Value of the 'syntax' property must be one of ${validSyntax}. Received: ${syntax}`,
  });
}

function expirationIsValidNumber(req, res, next) {
  const { data: { expiration } = {} } = req.body;
  if (expiration <= 0 || !Number.isInteger(expiration)) {
    return next({
      status: 400,
      message: `Expiration requires a valid number`,
    });
  }
  next();
}

// validation function
function pasteExists(req, res, next) {
  const { pasteId } = req.params;
  // console.log("====================");
  // console.log("pasteId: ", pasteId);
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    // store the paste record
    res.locals.paste = foundPaste;
    return next();
  }
  next({
    status: 404,
    message: `Paste id not found: ${pasteId}`,
  });
}

function read(req, res, next) {
  // //   after getting the variables (foundPaste) from pasteExists function
  // //   the following code can be updated to 1 line
  //     const { pasteId } = req.params;
  //     const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  //     res.json({ data: foundPaste });
  res.json({ data: res.locals.paste });
}

function update(req, res) {
  //   const { pasteId } = req.params;
  //   const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  const paste = res.locals.paste;
  const { data: { name, syntax, expiration, exposure, text } = {} } = req.body;

  // Update the paste
  // (replaced foundPaste with paste)
  paste.name = name;
  paste.syntax = syntax;
  paste.expiration = expiration;
  paste.exposure = exposure;
  paste.text = text;

  res.json({ data: paste });
}

function destroy(req, res) {
  const { pasteId } = req.params;
  const index = pastes.findIndex((paste) => paste.id === Number(pasteId));
  // `splice()` returns an array of the deleted elements, even if it is one element
  const deletedPastes = pastes.splice(index, 1);
  res.sendStatus(204);
}

module.exports = {
  create: [
    // new validation middleware using a function bodyDataHas()
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposuer"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    bodyDataHas("user_id"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    create,
  ],
  list,
  read: [pasteExists, read],
  update: [
    pasteExists,
    bodyDataHas("name"),
    bodyDataHas("syntax"),
    bodyDataHas("exposure"),
    bodyDataHas("expiration"),
    bodyDataHas("text"),
    exposurePropertyIsValid,
    syntaxPropertyIsValid,
    expirationIsValidNumber,
    update,
  ],
  delete: [pasteExists, destroy],
};
