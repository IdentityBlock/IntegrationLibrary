const express = require("express")
const app = express()
  
app.use("/loadContract", (req, res, next) => {
    res.send("This is the express server")
})
  
app.get("/getQR", (req, res, next) => {
    res.send("This is the hello response");
})

app.get("/getTokenVerified", (req, res, next) => {
    res.send("This is the hello response");
})
  
app.listen(3000, () => {
    console.log("Server is Running")
})