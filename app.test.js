const express = require('express');
const config = require('./config/scripts/main-conf');

const [app, PORT] = [express(), process.env.PORT || 3000];

//Init configurations defined in ./config/main-conf.js
config.init(app);

app.listen(PORT);

module.exports = app;

