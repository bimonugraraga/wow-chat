const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes')
const params = require('strong-params')
const err = require('./err_handler')
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(params.expressMiddleware())
app.use("/", routes)
app.use(err)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})