/*
 * Serve JSON to our AngularJS client
 */

exports.broadcast = function (hub) {
  return function (req, res) {
    console.log(req.body);
    hub.broadcast(req.body.message, req.body.filter, function  (err) {
      if (err) {
        console.log('broadcast failed', err.stack);
        res.status(500).end('failure');
      }
      res.end('success');
    });
  };
}

exports.messages = function (hub) {
  return function (req, res) {
    hub.outputs['web'].get(req.params.count, function (err, rows) {
      if (err) { res.status(500).end(err.stack); }
      res.json(rows);
    });
  };
}

exports.outputs = function (hub) {
  var outputs = hub.config.outputs;
  return function (req, res) {
    res.json(Object.keys(outputs).map(function (out) {
      var o = outputs[out];
      return {
        id: out,
        name: o.name,
        online: hub.outputs[out].online
      }
    }));
  };
};

