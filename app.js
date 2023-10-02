const express = require('express');
const {getTopics, getApi} = require("./db/controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);
app.get('/api', getApi);




module.exports = app;