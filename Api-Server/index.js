const express = require("express");
const { generateSlug } = require("random-word-slugs");

const app = express();
const PORT = 8000;

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`));
