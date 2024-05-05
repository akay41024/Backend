import express from 'express'
import dotenv from "dotenv";

const app = express()
const port = process.env.PORT || 5000;


dotenv.config({
  path: "./env",
});


app.get('/', (req, res) => {
  res.send('Server is in running state !!!')
})

app.get('/twitter', (req, res) => {
  res.send('Twitter Yaha hai');
})

app.get('/login', (req, res) => {
  res.send('<h1>Login Yaha hai</h1>');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
