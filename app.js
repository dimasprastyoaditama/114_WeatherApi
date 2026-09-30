const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    const kota = " jakarta";

    const apikey = "TmW3n2IbOKaZxkghOoYB";

    const  url = `https://api.maptiler.com/geocoding/${kota}.json?key=${apikey}`;

});