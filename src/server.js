const express = require("express")
const path = require('path')
const getAlbumsInfo = require('./js/app');

const app = express();

var PORT = 3020

app.use(express.static('src'));


app.get("/", function(req, res){
    res.sendFile((path.join(__dirname + '/index.html')));
})

app.get("/data", async function(req, res) {
    const { subject } = req.query;
    let result;

    result = await getAlbumsInfo(subject);

    res.end(JSON.stringify(result));
});

app.listen(PORT, function(error){
	if(error) throw error
	console.log("Server created Successfully on PORT", PORT)
})