
var twitter = require('ntwitter');

function Twitter(hub, config) {
  this.hub = hub;
  this.config = config;
  this.online = false;
}

// Standard output module methods.

Twitter.prototype.init = function (cb) {
  var self = this, config = self.config;

  self.twit = new twitter(config.api);

  self.twit.verifyCredentials(function (err, data) {
    if (err) { cb(err); return; }
    else { // Read help/configuration
      self.twit.get('/help/configuration.json', function (err, data) {
        if (err) { cb(err); }
        else { // Save short url length
          config.short_url_length = parseInt(data.short_url_length_https, 10);
          self.online = true;
          cb(null);
        }
      });
    }
  });
};

Twitter.prototype.broadcast = function(message, callback) {
  if (this.online) {
    this.twit.updateStatus(message, callback);
  } else {
    callback(new Error('Twitter offline'));
  }
};


module.exports = Twitter;