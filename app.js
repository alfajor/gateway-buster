import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { renderArticleData } from './data-handler.js';

const port = 9000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'pug');

// assets
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.render('index');
});

app.post('/', async (req, res) => {
  try {
    setTimeout(async () => {
      const rawData = await renderArticleData(req.body.result)  
      res.render('index', {data: rawData})
    }, 2000)
  } catch(err) {
    console.error('Unable to fetch the URL: ', err);
    res.render(`index`, { message: 'Unable to fetch the URL. Check the link and try again.' });
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});