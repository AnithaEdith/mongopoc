function dailyIncidentsView(client, res) {
    var itamgroups = [{ "application_id": "1", "itam_group_name": "group1" }, { "application_id": "115", "itam_group_name": "group2" }];
    var map = function () {
        var value = {
            priority: this.priority, severity: this.severity, status: this.status, itamgroups: [{ "application_id": "1", "itam_group_name": "group1" }, { "application_id": "115", "itam_group_name": "group2" }]
        };
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
    };
    client.collection('incidents')
        .mapReduce(map, reduce, { query: {}, out: { inline: 1 } }, function (err, results) {
            console.log(results);
            res.send(results);
            insertIncidentsDaily(client, results, res);
        });
}

function insertIncidentsDaily(client, results, res) {
    client.collection('incidents_daily').insertMany(results, forceServerObjectId = true, function (err, data) {
        if (err != null) {
            return console.log(err);
        }
        console.log(data.ops);
        res.send(data.ops);
    });
}

module.exports = dailyIncidentsView