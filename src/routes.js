var ObjectId = require('mongodb').ObjectID;
var _ = require('lodash')

module.exports = function (app, client) {
    //var db = client.db('dashboard-dev');
    app.get('/jira', (req, res) => {
        client.collection('jira', function (err, collection) {
            collection.find().toArray(function (err, items) {
                if (err) throw err;
                console.log(items);
                res.send(items)
            });
        });
    });

    //find One
    app.get('/jira/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) }
        client.collection('jira').findOne(details, (err, item) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(item)
            }
        });
    });
    //update rout
    app.put('/jira/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': id }
        const note = { text: req.body.body, title: req.body.title };
        client.collection('jira').update(details, note, (err, item) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(item)
            }
        });
    });

    /*//delete route
    app.delete('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) }
        client.collection('notes').remove(details, (err, item) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send("Note " + id + "deleted!")
            }
        });
    });*/
    //insert route
    app.post('/jira', (req, res) => {
        const note = { text: req.body.body, title: req.body.title };
        client.collection('jira').insert(note, (err, results) => {
            if (err) {
                res.send({ 'error': "An error has occured" })
            }
            else {
                res.send(results.ops[0])
            }
        });

    });

    app.get('/incidents/bulk', (req, res) => {
        const incidents = [{ "incident_id": "INC000028018217", "severity": "Sev 2", "application_id": "115", "status": "Open", "priority": "High", "description": "TWCP Transactions Failing" }, { "incident_id": "INC000028018220", "severity": "Sev 2", "application_id": "115", "status": "Close", "priority": "High", "description": "TWCP Transactions Failing" }, { "incident_id": "INC000026826701", "severity": "Sev 1", "application_id": "1", "status": "Open", "priority": "Low", "description": "PUMA BladeLogic - Service Request" }, { "incident_id": "INC000027885132", "severity": "Sev 2", "application_id": "1", "status": "Open", "priority": "Low", "description": "MSH - Pre-Prod Support Request form" }]
        client.collection('incidents').insertMany(incidents, forceServerObjectId = true, function (err, data) {
            if (err != null) {
                return console.log(err);
            }
            console.log(data.ops);
            res.send(data.ops);
        });
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
        var itamgroups = [{ "application_id": "1", "itam_group_name": "group1" }, { "application_id": "115", "itam_group_name": "group2" }]
        console.log(itamgroups[1].itam_group_name);
        var map = function () {
            var value = {
                priority: this.priority, severity: this.severity, status: this.status, itamgroups: [{ "application_id": "1", "itam_group_name": "group1" }, { "application_id": "115", "itam_group_name": "group2" }]
            }

            emit(this.application_id, value);
        };
        var reduce = function (k, v) {
            var reducedVal = { sev1open: 0, sev1close: 0, sev2open: 0, sev2close: 0, totalopen: 0, totalclose: 0, totalsev1: 0, totalsev2: 0, totalcreated: 0 };

            for (i = 0; i < v.length; i++) {
                reducedVal.application_id = k;
                reducedVal.sev1open += ((v[i].severity === 'Sev 1' && v[i].status === 'Open') ? 1 : 0);
                reducedVal.sev1close += ((v[i].severity === 'Sev 1' && v[i].status === 'Close') ? 1 : 0);
                reducedVal.sev2open += ((v[i].severity === 'Sev 2' && v[i].status === 'Open') ? 1 : 0);
                reducedVal.sev2close += ((v[i].severity === 'Sev 2' && v[i].status === 'Close') ? 1 : 0);
                reducedVal.totalopen += ((v[i].status === 'Open') ? 1 : 0);
                reducedVal.totalclose += ((v[i].status === 'Close') ? 1 : 0);
                reducedVal.totalsev1 += ((v[i].severity === 'Sev 1') ? 1 : 0);
                reducedVal.totalsev2 += ((v[i].severity === 'Sev 2') ? 1 : 0);
                reducedVal.totalcreated = v.length;
                reducedVal.itam = v[i].itamgroups.find(function (element) {
                    return element.application_id === k;
                }).itam_group_name;
            }
            return reducedVal;
        }

        /*var result = client.collection('incidents').aggregate([
            {
                $lookup: {
                    from: "itamgroup",
                    localField: "application_id",    // field in the orders collection
                    foreignField: "application_id",  // field in the items collection
                    as: "fromItems"
                }
            },
            {
                $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$fromItems", 0] }, "$$ROOT"] } }
            },
            { $project: { fromItems: 0 } }
        ]).toArray(function (err, res) {
            if (err) throw err;
            console.log(JSON.stringify(res));
            return res;
        })*/

        client.collection('incidents')
            .mapReduce(map, reduce, { query: { priority: "High" }, out: { inline: 1 } },
                function (err, results) {
                    console.log(results);
                    res.send(results);
                    /*client.collection('incidents').mapReduce(map, reduce, { query: { priority: "High" }, out: { inline: 1 } },
                        function (err, results) {
                            console.log(results)
                            res.send(results);
                    })*/
                });
    });
    app.get('/itamgroup', (req, res) => {
        console.log(client.collection('itamgroup').findOne({ 'application_id': '1' }));
    });

};
