import UrlModel from "./models/url.js";

import bodyParser from "body-parser";
import cors from 'cors'
import dns from "dns";
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import {nanoid} from "nanoid";
import validUrl from 'valid-url'


const app = express();
dotenv.config()

const publicDir = process.cwd() + '/src/public'

// Basic Configuration
const port = process.env.PORT || 4564;

app.use(cors());

// Allow parsing of JSON payload in body
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json())

// Load static assets in /public directory
app.use(express.static(publicDir));
app.use('/public', express.static(publicDir));


// Connect to database
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('\x1b[33m %s\x1b[0m', 'Connected to database'))
    .catch((error) => console.error('\x1b[31m %s\x1b[0m', 'Error connecting to database:', error))

app.get('/', (req, res) => {
    res.sendFile(publicDir + '/index.html');
});

// Create new short url
app.post('/api/shorturl', (req, res) => {
    const _url = req.body.url
    // Validate url
    const isValidUrl = validUrl.isUri(_url)

    if (!isValidUrl) {
        return res.json({error: 'invalid url'})
    }

    try {
        // Look up dns
        dns.lookup(new URL(_url).hostname, async (err, address) => {
            if (err || !address) {
                return res.json({error: 'invalid url'})
            }

            // Find if url exists in database
            const existingEntry = await UrlModel.findOne({
                original_url: _url
            })

            if (existingEntry) {
                return res.json({
                    original_url: existingEntry.original_url,
                    short_url: existingEntry.short_url
                });
            } else {
                // Add url to database (if not exist)
                const newEntry = new UrlModel({
                    original_url: _url,
                    short_url: nanoid(10),
                })

                await newEntry.save()
                
                return res.json({
                    original_url: newEntry.original_url,
                    short_url: newEntry.short_url
                });
            }
        })
    } catch (error) {
        // Return 500 if error
        console.error(error)
        res.status(500).json('Internal server error')
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
