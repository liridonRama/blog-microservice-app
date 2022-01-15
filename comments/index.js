import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { randomBytes } from 'crypto';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  res.send(commentsByPostId[postId] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  const id = randomBytes(4).toString('hex');
  const postId = req.params.id;

  const { content } = req.body;

  if (!commentsByPostId[postId]?.length) {
    commentsByPostId[postId] = [];
  }

  commentsByPostId[postId].push({ id, content, status: 'pending' });

  await axios
    .post('http://localhost:4005/events', {
      type: 'CommentCreated',
      data: {
        id,
        content,
        postId,
      },
    })
    .catch(console.log);

  res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', (req, res) => {
  console.log('Received Event', req.body.type);

  res.status(200).end();
});

app.listen(4001, () => console.log('listening on port 4001'));
