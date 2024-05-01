const express = require('express')
const app = express()
const port = 5000
require('dotenv').config();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/twitter', (req, res) => {
  res.send('Twitter Yaha hai');
})

app.get('/login', (req, res) => {
  res.send('<h1>Login Yaha hai</h1>');
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
});
