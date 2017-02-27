const express = require('express');
const config = require('./config/scripts/main-conf');

const [app, PORT] = [express(), 3000];

//Init configurations defined in ./config/main-conf.js
config.init(app);

app.get('/', (req, res) => {
  res.json("It worked!");
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
