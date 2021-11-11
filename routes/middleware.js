
const shorts_controller = require('./shorts-controller');

// Checks that the short name in the request body does not already exist
const shortNameDoesNotAlreadyExist = async (req, res, next) => {
  const short = await shorts_controller.findOne(req.body.name);
  console.log(short);
  if (short) {
    res.status(400).json({
      error: `Short name ${req.body.name} already exists.`,
    }).end();
    return;
  }
  next();
};

// Checks that the short name in the paramerters exists
const shortNameExists = async (req, res, next) => {
  const short = await shorts_controller.findOne(req.params.name);
  if (short === []) {
    res.status(404).json({
      error: `Short name ${req.params.name} does not exist.`,
    }).end();
    return;
  }
  next();
};

// Checks that the username is set in session, i.e., user logged in
const userIsLoggedIn = (req, res, next) => {
  if (req.session.username === undefined) {
    res.status(403).json({
      error: 'You must be logged in in order to delete a short!'
    }).end();
    return;
  }
  next();
};

module.exports = Object.freeze({
  shortNameDoesNotAlreadyExist,
  shortNameExists,
  userIsLoggedIn,
});