
var sqlite = require('sqlite3').verbose();

function HTTPAPI(hub, config) {
  this.hub = hub;
  this.filename = config.filename;
  this.online = false;
}

// Standard output module methods.

HTTPAPI.prototype.init = function (cb) {
  var self = this, db = this.db = new sqlite.Database(__dirname + '/dbs/' + this.filename);
  db.serialize(function() {
    // Create table if it doen'st exist.
    db.run('create table if not exists messages(message text, timestamp datetime)', function (err) {
      if (err) { throw err; }
      self.online = true;
      console.log('success');
    });
  })
  cb(null);
};

HTTPAPI.prototype.broadcast = function(message, callback) {
  var db = this.db;
  if (this.online) {
    db.run('insert into messages values(?, CURRENT_TIMESTAMP)', message, function (err) {
      if (err) { callback(err); return; }
      console.log('added to db');
      callback(null);
    });
  } else {
    callback(new Error('Error, output module offline.'));
  }
};

// Extra output module methods.

HTTPAPI.prototype.get = function(n, callback) {
  var db = this.db;
  console.log('getting');
  if (this.online) {
    db.all('select * from messages order by timestamp desc limit ?', n, function (err, rows) {
      console.log(err, rows);
      if (err) { callback(err); return; }
      callback(null, rows);
    });
  } else {
    callback(new Error('Error, output module offline.'));
  }
};

module.exports = HTTPAPI;