function dailyIncidents2View(client, res) {
    var map = function () {
        var value = {
            priority: this.priority, severity: this.severity, status: this.status, application_id: this.application_id
        };
        emit(new Date(this.created_dt).getFullYear() + '_' + (new Date(this.created_dt).getMonth() + 1), value);
    };
    var reduce = function (k, v) {
        var reducedVal = { sev1open: 0, sev1close: 0, sev2open: 0, sev2close: 0, totalopen: 0, totalclose: 0, totalsev1: 0, totalsev2: 0, totalcreated: 0 };
        for (i = 0; i < v.length; i++) {
            reducedVal.application_id = v[i].application_id;
            reducedVal.sev1open += ((v[i].severity === 'Sev 1' && v[i].status === 'Open') ? 1 : 0);
            reducedVal.sev1close += ((v[i].severity === 'Sev 1' && v[i].status === 'Close') ? 1 : 0);
            reducedVal.sev2open += ((v[i].severity === 'Sev 2' && v[i].status === 'Open') ? 1 : 0);
            reducedVal.sev2close += ((v[i].severity === 'Sev 2' && v[i].status === 'Close') ? 1 : 0);
            reducedVal.totalopen += ((v[i].status === 'Open') ? 1 : 0);
            reducedVal.totalclose += ((v[i].status === 'Close') ? 1 : 0);
            reducedVal.totalsev1 += ((v[i].severity === 'Sev 1') ? 1 : 0);
            reducedVal.totalsev2 += ((v[i].severity === 'Sev 2') ? 1 : 0);
            reducedVal.totalcreated = v.length;
            reducedVal.date = k;
        }
        return reducedVal;
    };
    client.collection('incidents2')
        .mapReduce(map, reduce, { query: {}, out: { inline: 1 } }, function (err, results) {
            console.log(results);
            res.send(results);
        });
}

module.exports = dailyIncidents2View
