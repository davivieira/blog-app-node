const express = require('express');
const path = require('path');
const config = require('./config/config');

const app = express();
const PORT = 3000;

//Init configurations defined in ./config/config.js
config.init(app);

// Setting the static files folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.send('Invalid route');
})

app.listen(PORT, () => {
  console.log('Listening to port ' + PORT);
})
