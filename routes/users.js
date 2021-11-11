const express = require('express');

const controller = require("./users-controller");

const router = express.Router();

/**
 * Set username of active user.
 * 
 * @name POST /api/session
 */
router.post('/', async (req, res) => {
  if (req.session.username === null || req.session.username === undefined) {
    if (req.body.username.length === 0) {
      res.status(400).json({ message: 'The user name must be at least 1 character.' }).end();
    } else {
      req.session.username = req.body.username;
      const existing = await controller.findOne(req.body.username);
      if(existing !== []){
        await controller.addOne(req.body.username);
      }
      res.status(200).json({ username: req.session.username }).end();
    }
  } else {
    res.status(400).json({ message: 'You are already signed in.' }).end();
  }
});

/**
 * Disassociate the username signed in with their session.
 * 
 * @name DELETE /api/session
 */
router.delete('/', (req, res) => {
  if (req.session.username === undefined) {
    res.status(400).json({message: "You must be logged in to log out"}).end();
  } else {
    let name = req.session.username;
    req.session.username = undefined;
    res.status(200).json({ message: `User ${name} has been logged out`}).end();
  }
});

module.exports = router;