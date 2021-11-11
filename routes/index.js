const express = require('express');

const controller = require('./shorts-controller');

const router = express.Router();

/**
 * Serves homepage.
 * @name GET /
 */
router.get(
  '/', 
  [],
  async (req, res) => {
  res.render('index');
});

/**
 * Access short URL.
 * 
 * Note that the ? after shortName makes the shotName param
 * accessible from within this route **even when it is empty**
 * which makes sure that do hit this route
 * 
 * @name GET /:name
 */
router.get(
  '/:name?',
  async (req, res, next) => {
  try {
    // middleware will check that the param is non-empty!
    const shortName = req.params.name;

    // fetch short from DB and ensure it exists
    const short = await controller.findOne(shortName);
    if (!short) {
      res.status(404).json({
        error: `Short URL ${shortName} not found.`,
      }).end();
      return;
    } 
    
    // if the destination URL of the short is specified, 
    // then navigate to it by redirecting 
    if (short.short_original_url) {
      res.redirect(short.short_original_url);
    } else {
      next();
    }

  } catch (error) {
    res.status(503).json({ error: "Could not navigate to desination URL of this short" }).end();
  }
});

module.exports = router;
