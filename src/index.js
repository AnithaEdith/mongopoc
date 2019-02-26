var mongoClient = require("mongodb").MongoClient;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var dbUrl = "mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb";
app.use(bodyParser.urlencoded({ extened: true }));

mongoClient.connect(dbUrl, { useNewUrlParser: true }, function (error, database) {
    var db = database.db('dashboard-dev');
    if (error) return console.log(err)
    require('./routes')(app, db);

    app.listen(3000, () => {
        console.log("we are live on : " + 3000);
    })
    //perform operations here
});

