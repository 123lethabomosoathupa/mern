const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const graphqlSchema = require('./graphql/schema/index.js');
const graphqlResolvers = require('./graphql/resolvers/index.js');
const isAuth = require('./middleware/is-auth.js');

const app = express();

app.use(bodyParser.json());

// FIX #2: CORS — allow the React dev server (port 3000) to reach this backend
app.use(cors());

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@testcluster1.wxdgvkq.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true`
  )
  .then(() => {
    // FIX #1: PORT — backend runs on 8000 to match all frontend fetch URLs
    console.log('Successfully connected to database and listening on port: 8000');
    app.listen(8000);
  })
  .catch(err => {
    console.log('Error connecting to database: ' + err);
  });
