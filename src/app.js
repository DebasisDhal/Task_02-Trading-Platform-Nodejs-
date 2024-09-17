const express = require("express");
const hbs = require("hbs")
const mysql = require('mysql2')
const axios = require('axios');
var cors = require('cors');
var path = require('path')

const app = express();
app.use(cors());
app.use(express.json());


// mySQL connection
const connection = mysql.createConnection({ 
    host: 'localhost',
    database: 'crypto_db',
    user: 'root',
    password: 'tiger',
    //port: 5432,
}).promise();

// Set view engine to hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

app.use('/static',express.static("public"))



app.get('/fetch-crypto', async (req, res) => {
    try {
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const tickers = Object.values(response.data).slice(0, 10); // Get top 10

        // Clear existing records in the database
        await connection.execute('DELETE FROM crypto_data');

        // Insert new data
        for (const ticker of tickers) {
            const { name, last, buy, sell, volume, base_unit } = ticker;

            await connection.execute(
                'INSERT INTO crypto_data (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)',
                [name, last, buy, sell, volume, base_unit]
            );
        }

        res.status(200).send('Crypto data fetched and stored successfully');
    } catch (error) {
        console.error('Error fetching crypto data', error);
        res.status(500).send('Error fetching crypto data');
    }
});



app.get('/', async (req, res) => {
    try {
        // Destructure only the rows from the result of pool.execute
        const [rows] = await connection.execute('SELECT * FROM crypto_data');

         // Add IDs dynamically (1-10)
         rows.forEach((item, index) => {
            item.id = index + 1; // Adding an 'id' property to each item
        });
        
        // Pass rows to the template
        res.render('index', { cryptoData: rows });

         
    } catch (error) {
        console.error('Error fetching data from the database', error);
        res.status(500).send('Error fetching data from the database');
    }
});


// Test MySQL connection
app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await connection.execute('SELECT 1');
        res.json({ message: 'Database connection successful', result: rows });
    } catch (error) {
        console.error('Error connecting to the database', error);
        res.status(500).send('Database connection failed');
    }
});



const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

console.log("Hey this my web")