
/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  api = require('./routes/api'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  config = require('./config').webui;

function findById(id, fn) {
  var idx = id - 1;
  if (config.users[idx]) {
    fn(null, config.users[idx]);
  } else {
    fn(new Error('User ' + id + ' does not exist'));
  }
}

function findByUsername(username, fn) {
  for (var i = 0, len = config.users.length; i < len; i++) {
    var user = config.users[i];
    if (user.username === username) {
      return fn(null, user);
    }
  }
  return fn(null, null);
}

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  console.log('Unauthorized action!');
  res.status(401).end();
}

function WebUI(hub) {
  var self = this;

  self.hub = hub;

  // Set up logging in with passport
  passport.serializeUser(function (user, done) { done(null, user.id); });
  passport.deserializeUser(function (id, done) {
    findById(id, function (err, user) { done(err, user); });
  });
  passport.use(new LocalStrategy(
    function verify(username, password, done) {
      findByUsername(username, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (user.password != password) { return done(null, false); }
        return done(null, user);
      });
    }
  ));

  var app = self.app = express();

  // Configuration

  app.configure(function () {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(express.cookieSession({secret: config.secret}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
  });

  app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });

  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  // Routes

  app.get('/', routes.index);

  app.post('/login', passport.authenticate('local'), function(req, res) {
    res.status(200).end();
  });

  // JSON API
  app.post('/api/broadcast', ensureAuthenticated, api.broadcast(hub));
  app.get('/api/outputs', api.outputs(hub))
  app.get('/api/messages/:count', api.messages(hub));

  // redirect all others to the index (HTML5 history)
  app.get('*', routes.index);

  // Start server

  app.listen(config.port, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });

}

module.exports = WebUI;