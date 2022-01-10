import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  res.send(commentsByPostId[postId] || []);
});
app.post('/posts/:id/comments', (req, res) => {
  const id = randomBytes(4).toString('hex');
  const postId = req.params.id;

  const { content } = req.body;

  if (!commentsByPostId[postId]?.length) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push({ id, content });

  res.status(201).send(commentsByPostId[postId]);
});

app.listen(4001, () => console.log('listening on port 4001'));
