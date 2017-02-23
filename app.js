const [express, config] = [require('express'), require('./config/config')];
const [app, PORT] = [express(), 3000];

//Init configurations defined in ./config/config.js
config.init(app);

app.get('/', (req, res) => {
  res.json("It worked!");
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
