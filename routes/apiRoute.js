const express = require('express');
const uuid = require('uuid');
const fs = require('fs').promises;

const router = express.Router();
const filePath = 'db/db.json';

// read and parse the json file
const readJsonFile = async () => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return await JSON.parse(data);
  } catch (error) {
    console.error(error);
    throw new Error('Error reading JSON file');
  }
};

// write the json file
const writeJsonFile = async (data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data));
  } catch (error) {
    console.error(error);
    throw new Error('Error writing JSON file');
  }
};

// GET request to '/api/notes'
router.get('/notes', async (req, res) => {
  try {
    const dbJson = await readJsonFile();
    res.json(dbJson);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST request to '/api/notes'
router.post('/notes', async (req, res) => {
  try {
    const dbJson = await readJsonFile();
    const newFeedback = {
      title: req.body.title,
      text: req.body.text,
      id: uuid(),
    };
    dbJson.push(newFeedback);
    await writeJsonFile(dbJson);
    res.json(dbJson);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE request to '/api/notes/:id'
router.delete('/notes/:id', async (req, res) => {
  try {
    let dataJSON = await readJsonFile();
    dataJSON = dataJSON.filter((note) => note.id !== req.params.id);
    await writeJsonFile(dataJSON);
    res.json({ message: 'Note deleted.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
