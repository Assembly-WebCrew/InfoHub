var colors = require('colors')
  , async = require('async')
  , webui = require('./webui');

function InfoHub(config) {
  var self = this;

  self.outputs = [];

  self.config = config;
  self.webui = new webui(this);

  self.initOutputs();
}

InfoHub.prototype.initOutputs = function(cb) {
  var self = this, outputs = self.config.outputs || {};
  
  outputs = Object.keys(outputs).map(function loadModules(out) {
    var module = outputs[out].module;
    try { // Try to require module
      console.log(outputs[out]);
      self.outputs[out.toLowerCase()] = 
          new (require(__dirname + '/output/' + module + '/' + module))(self, outputs[out].config);
      return out.green;
    } catch (e) {
      console.error('Failed to load module "%s".', out);
      console.error(e.stack);
      return out.red;
    }
  });

  console.log('Loaded %s output module(s): %s', String(outputs.length), outputs.join(', '));

  // Initializes a module by it's name, returns true/false
  function moduleInit(module, cb) {
    process.stdout.write('Starting ' + module + ' module...');
    self.outputs[module].init(function (e) {
      console.log(' -> ' + (e === null ? ' ok'.green : ' fail'.red));
      cb(e === null);
    });
  }

  // Initialize output modules
  function initializeModules(cb) {
    var keys = Object.keys(self.outputs);
    async.filterSeries(keys, moduleInit, function (results) { cb(null); });
  }

  // Time to use these functions above
  console.log('Initializing output modules...');
  initializeModules(function  (err) {
    console.log('Modules initialized!');
  });
  /*async.parallel([initializeModules],
  // Init done!
  function (e, d) {
    //cb(null);
  });*/

};

InfoHub.prototype.broadcast = function(message, filter, callback) {
  var self = this, modules = Object.keys(self.outputs);
  console.log('filtering', modules);

  modules = modules.filter(function (id) {
    return filter[id];
  })

  console.log('broadcasting', message, filter, modules);

  async.forEach(modules, function (module, cb) {
    self.outputs[module].broadcast(message, cb);  
  }, callback);
};

var hub = new InfoHub(require('./config').hub || {});