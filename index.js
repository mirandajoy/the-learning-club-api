import cors from 'cors';
import express from 'express';

import usersRouter from './routes/users.js';
import profilesRouter from './routes/profiles.js';
import groupsRouter from './routes/groups.js';

import 'dotenv/config';

const app = express();
const { PORT, CROSS_ORIGIN } = process.env;

app.use(cors({ origin: CROSS_ORIGIN }));
app.use(express.json());
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/groups', groupsRouter);

app.listen(PORT, () => {
  console.log(`This app is listening on port ${PORT}`);
});