
var irc = require('irc');

function IRC(hub, config) {
  this.hub = hub;
  this.online = false;
  this.config = config;
}

// Standard output module methods.

IRC.prototype.init = function (cb) {
  var self = this, config = self.config
    , client = self.client = new irc.Client(config.server, config.nick,
  {
    userName: 'hubbot',
    realName: 'InfoHub Bot',
    autoRejoin: false,
    floodProtection: true,
    channelPrefixes: "&#!",
    channels: [config.channel]
  });
  client.on('join', function (channel, nick) {
    console.log('joined', channel, nick);
    if (nick == client.nick) {
      self.config.channel = channel;
      self.online = true;
    }
  })
  client.on('error', function (err) {
    console.log('error', err);
    self.online = false;
  });

  client.on('disconnect', function () {
    self.online = false;
  });

  client.on('part', function (channel, nick) {
    if (client.nick == nick) {
      self.online = false;
    }
  });

  client.on('quit', function (nick) {
    if (client.nick == nick) {
      self.online = false;
    }
  });

  client.on('kick', function (channel, nick) {
    if (client.nick == nick) {
      self.online = false;
    }
  });

  client.on('kill', function (nick) {
    if (client.nick == nick) {
      self.online = false;
    }
  });

  cb(null);
};

IRC.prototype.broadcast = function(message, callback) {
  if (this.online) {
    this.client.say(this.config.channel, message);
    callback(null);
  } else {
    callback(new Error('Unable to send, client offline.'));
  }
};

module.exports = IRC;