function dailyIncidents1View(client, res, type) {
    var singleAggregation = [{ "$project": { "application_id": "$application_id", "createdMonth": { "$let": { "vars": { "column": "$created_date" }, "in": { "___date": { "$dateToString": { "format": "%Y-%m", "date": "$$column" } } } } }, "severity": "$severity" } }, { "$match": { "severity": { "$eq": "Sev 2" } } }, { "$project": { "_id": "$_id", "___group": { "application_id": "$application_id", "createdMonth": "$createdMonth", "severity": "$severity" } } }, { "$group": { "_id": "$___group", "count": { "$sum": 1 } } }, { "$sort": { "_id": 1 } }, { "$project": { "_id": false, "count": true, "application_id": "$_id.application_id", "createdMonth": "$_id.createdMonth.___date", "severity": "$_id.severity" } }, { "$sort": { "application_id": 1, "createdMonth": 1, "severity": 1 } }]
    var multipleAggregation = [{ "$facet": { "Sev1": [{ "$project": { "application_id": "$application_id", "createdMonth": { "$let": { "vars": { "column": "$created_date" }, "in": { "___date": { "$dateToString": { "format": "%Y-%m", "date": "$$column" } } } } }, "severity": "$severity" } }, { "$match": { "severity": { "$eq": "Sev 1" } } }, { "$project": { "_id": "$_id", "___group": { "application_id": "$application_id", "createdMonth": "$createdMonth", "severity": "$severity" } } }, { "$group": { "_id": "$___group", "count": { "$sum": 1 } } }, { "$sort": { "_id": 1 } }, { "$project": { "_id": false, "count": true, "application_id": "$_id.application_id", "createdMonth": "$_id.createdMonth.___date", "severity": "$_id.severity" } }, { "$sort": { "application_id": 1, "createdMonth": 1, "severity": 1 } }], "Sev2": [{ "$project": { "application_id": "$application_id", "createdMonth": { "$let": { "vars": { "column": "$created_date" }, "in": { "___date": { "$dateToString": { "format": "%Y-%m", "date": "$$column" } } } } }, "severity": "$severity" } }, { "$match": { "severity": { "$eq": "Sev 2" } } }, { "$project": { "_id": "$_id", "___group": { "application_id": "$application_id", "createdMonth": "$createdMonth", "severity": "$severity" } } }, { "$group": { "_id": "$___group", "count": { "$sum": 1 } } }, { "$sort": { "_id": 1 } }, { "$project": { "_id": false, "count": true, "application_id": "$_id.application_id", "createdMonth": "$_id.createdMonth.___date", "severity": "$_id.severity" } }, { "$sort": { "application_id": 1, "createdMonth": 1, "severity": 1 } }] } }]

    client.collection('incidents1')
        .aggregate(type === 'incidentSev2' ? singleAggregation : multipleAggregation).toArray()
        .then(results => { res.json({ "AggregatedIncidents": results }); });
}

module.exports = dailyIncidents1View