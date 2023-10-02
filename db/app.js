const express = require('express');
const {} = require("./controllers/controllers");
const app = express();

app.get('/api/topics', getTopics);