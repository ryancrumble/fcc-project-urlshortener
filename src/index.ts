import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'

const app = express();
dotenv.config()


// Basic Configuration
const port = process.env.PORT || 4564;

app.use(cors());

app.use(express.static(process.cwd() + '/src/public'));
app.use('/public', express.static(process.cwd() + '/src/public'));

app.get('/', function(req, res) {
// res.json({path: __dirname})
  res.sendFile(process.cwd() + '/src/public/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
