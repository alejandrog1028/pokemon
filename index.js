const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/get-pokemon-type', async (req, res) => {
  const name = req.query.name?.toLowerCase();
  console.log(`[TYPE] Requested: ${name}`);

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const types = response.data.types.map(t => t.type.name);
    console.log(`[TYPE] Types: ${types}`);
    res.json({ name, types });
  } catch (error) {
    console.error('[TYPE] Error:', error.message);
    res.status(404).json({ error: 'Pokémon not found' });
  }
});

app.get('/get-pokemon-image', async (req, res) => {
  const name = req.query.name?.toLowerCase();
  console.log(`[IMAGE] Requested: ${name}`);

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const image = response.data.sprites.front_default;
    console.log(`[IMAGE] URL: ${image}`);
    res.json({ name, images: [image] });
  } catch (error) {
    console.error('[IMAGE] Error:', error.message);
    res.status(404).json({ error: 'Pokémon not found' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Pokédex server running at http://localhost:${PORT}`);
});
