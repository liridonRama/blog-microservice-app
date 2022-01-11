import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/posts', (req, res) => {
  res.end();
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.status(200).end();
});

app.listen(4002, () => console.log('listening on port 4002'));
