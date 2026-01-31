const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Agar frontend bisa akses backend

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper: Baca Data
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper: Simpan Data
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API: Ambil Semua Data (GET)
app.get('/api/vault', (req, res) => {
    const data = readData();
    res.json(data);
});

// API: Tambah Data Baru (POST)
app.post('/api/vault', (req, res) => {
    const { site, username, password } = req.body;
    const data = readData();
    
    const newItem = {
        id: Date.now(),
        site,
        username,
        password
    };

    data.unshift(newItem); // Tambah ke paling atas
    saveData(data);
    res.json(newItem);
});

// API: Hapus Data (DELETE)
app.delete('/api/vault/:id', (req, res) => {
    const { id } = req.params;
    let data = readData();
    data = data.filter(item => item.id != id); // Hapus item berdasarkan ID
    saveData(data);
    res.json({ message: "Deleted successfully" });
});

// Jalankan Server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});