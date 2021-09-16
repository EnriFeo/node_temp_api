const express = require('express');

const app = express()

app.use("/api/", require('./route/api'))

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})