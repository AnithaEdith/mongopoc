var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash')
var dailyIncidentsView = require('./dailyIncidentsView.js')
var bulkinsertIncidents = require('./bulkinsertIncidents.js')
var dailyIncidents1View = require('./dailyIncidents1View.js')
var dailyIncidents2View = require('./dailyIncidents2View.js')

module.exports = function (app, client) {

    app.get('/incidents/bulk', (req, res) => {
        bulkinsertIncidents(client, res);
    });

    app.post('/incidents', (req, res) => {
        const incident = { incident: req.body.incident };
        client.collection('incidents').insertOne(incident, (err, results) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(results.ops[0])
            }
        });
    });

    app.get('/incidents/daily', (req, res) => {
        dailyIncidentsView(client, res);
    });

    app.get('/itamgroup', (req, res) => {
        console.log(client.collection('itamgroup').findOne({ 'application_id': '1' }));
    });

    app.delete('/incidents', (req, res) => {
        client.collection('incidents').deleteMany({});
    });

    app.delete('/incidents/daily', (req, res) => {
        client.collection('incidents_daily').deleteMany(incidents_daily, (err, results) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(results.ops[0])
            }
        });
    });

    app.get('/incidents1/daily/:type', (req, res) => {
        dailyIncidents1View(client, res, req.params.type === 'incidentSev2' ? 'incidentSev2' : 'incidentsAll');
    });

    app.get('/incidents2/daily', (req, res) => {
        dailyIncidents2View(client, res);
    });

    app.get('/incidents1', (req, res) => {
        client.collection('incidents1').find({}).toArray(function (err, results) {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(results)
            }
        });
    });

    app.get('/incidents2', (req, res) => {
        client.collection('incidents2').find({}).toArray(function (err, results) {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(results)
            }
        });
    });

};
