function bulkinsertIncidents(client, res) {
    const incidents = [{ "incident_id": "INC000028018217", "severity": "Sev 2", "application_id": "115", "status": "Open", "priority": "High", "description": "TWCP Transactions Failing" }, { "incident_id": "INC000028018220", "severity": "Sev 2", "application_id": "115", "status": "Close", "priority": "High", "description": "TWCP Transactions Failing" }, { "incident_id": "INC000026826701", "severity": "Sev 1", "application_id": "115", "status": "Open", "priority": "Low", "description": "PUMA BladeLogic - Service Request" }, { "incident_id": "INC000027885132", "severity": "Sev 2", "application_id": "1", "status": "Open", "priority": "Low", "description": "MSH - Pre-Prod Support Request form" }, { "incident_id": "INC000026826702", "severity": "Sev 2", "application_id": "1", "status": "Close", "priority": "Low", "description": "PUMA BladeLogic - Service Request" }, { "incident_id": "INC000026826703", "severity": "Sev 1", "application_id": "1", "status": "Close", "priority": "Low", "description": "PUMA BladeLogic - Service Request" }];
    client.collection('incidents').insertMany(incidents, forceServerObjectId = true, function (err, data) {
        if (err != null) {
            return console.log(err);
        }
        console.log(data.ops);
        res.send(data.ops);
    });
}

module.exports = bulkinsertIncidents;