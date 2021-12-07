import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError } from '@nkgittix/common';

const app = express();

// let nodejs trust the ingress-nginx proxy
app.set('trust proxy', true);

app.use(json());
app.use(
  cookieSession({
    // don't encrypt the JWT inside the cookie
    signed: false,
    // if true, send through HTTPS only
    secure: process.env.NODE_ENV !== 'test',
  })
);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
