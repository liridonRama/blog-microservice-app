import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import axios from 'axios';

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.post('/events', async (req, res) => {
  console.log('Received Event', req.body.type);

  const { type, data } = req.body;

  if (type === 'CommentCreated') {
    const status = data.content.includes('orange') ? 'rejected' : 'approved';

    await axios
      .post('http://localhost:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        },
      })
      .catch();
  }

  res.end();
});

app.listen(4003, () => console.log('listening on port 4003'));
