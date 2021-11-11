const express = require('express');

const controller = require('./shorts-controller');

const validateThat = require('./middleware');

const router = express.Router();

/**
 * List all shorts.
 * 
 * @name GET /api/shorts
 * 
 * @return {Short[]} - list of all stored shorts
 */
router.get('/', async (req, res) => {
  const shorts = await controller.getAll();
  res.status(200).json(shorts).end();
})

/**
 * Create a short.
 * 
 * @name POST /api/shorts
 * 
 * @param {string} name - name of short (link will be /:short)
 * @param {string} url - link short points to
 * @return {Short} - the created short
 * @throws {400} - if name is already taken
 */
router.post('/', [validateThat.shortNameDoesNotAlreadyExist], async (req, res) => {
  const short = await controller.addOne(req.body.url, req.body.name, req.session.username); 
  res.status(200).json(short).end();
});

/**
 * Update a short.
 * 
 * @name PUT /api/shorts/:name
 * 
 * @param {string} url - the new URL to point to
 * @return {Short} - the updated short
 * @throws {404} - if short does not exist
 */
router.put('/:name?', [validateThat.shortNameExists], async (req, res) => {
  const short = (req.body.isCount) 
    ? await controller.incrementOne(req.params.name) 
    : await controller.updateOne(req.body.url, req.params.name);
  res.status(200).json(short).end();
});

/**
 * Delete a short.
 * 
 * @name DELETE /api/shorts/:name
 * 
 * @return {Short} - the deleted short
 * @throws {404} - if short does not exist
 */
router.delete(
  '/:name?', 
  [
    validateThat.userIsLoggedIn,
    validateThat.shortNameExists,
  ],
  async (req, res) => {
  const short = await controller.deleteOne(req.params.name);
  res.status(200).json(short).end();
});

module.exports = router;