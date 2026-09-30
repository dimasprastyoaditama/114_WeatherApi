const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/lokasi', async (req, res) => {
    // 1. Ambil nama kota dari parameter URL (contoh: /api/lokasi?kota=bandung)
    const kota = req.query.kota;

    // Jika tidak ada input kota, kembalikan error
    if (!kota) {
        return res.status(400).json({ message: "Parameter kota wajib diisi" });
    }

    const apikey = "TmW3n2IbOKaZxkghOoYB";
    // Gunakan encodeURIComponent agar spasi pada nama kota diproses dengan benar di URL
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(kota)}.json?key=${apikey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        // Cek jika lokasi tidak ditemukan oleh MapTiler
        if (!data.features || data.features.length === 0) {
            return res.status(404).json({ message: "Lokasi tidak ditemukan" });
        }

        const feature = data.features[0];
        
        // 2. Siapkan variabel default
        let negara = "-";
        let provinsi = "-";
        let kecamatan = feature.text; // Default mengambil nama tempat utama
        
        // 3. Ekstrak data spesifik dari array 'context' MapTiler
        if (feature.context) {
            feature.context.forEach(item => {
                if (item.id.startsWith('country')) negara = item.text;
                if (item.id.startsWith('region') || item.id.startsWith('province')) provinsi = item.text;
                if (item.id.startsWith('county') || item.id.startsWith('municipality')) kecamatan = item.text;
            });
        }

        const koordinat = feature.geometry.coordinates;

        // 4. Kirim respon JSON yang sudah lengkap ke frontend
        res.json({ 
            lokasi: feature.text,
            negara: negara,
            provinsi: provinsi,
            kecamatan: kecamatan,
            longitude: koordinat[0],
            latitude: koordinat[1]
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            message: 'Gagal mengambil data dari MapTiler'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});