const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use("/", routes)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})