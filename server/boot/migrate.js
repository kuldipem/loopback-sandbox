var async = require('async');
module.exports = function(app) {
  /* Running the autoupdates results in a memory leak error
   * unless maxListeners is set. I change it back to the
   * original value after the updates complete. */
  var maxListeners = require('events').EventEmitter.prototype._maxListeners;
  require('events').EventEmitter.prototype._maxListeners = 100;

  var datasource = app.dataSources.mysqlDs;
  var modelNames = [
      'answer'
  ];

  var fs = require('fs');
  var seedFolder = 'production';

  if (process.env.SEED_DB) {
    async.forEach(modelNames, function (modelName, callback){
       datasource.automigrate(modelName, function (err) {
         if (err) throw err;
         if (process.env.SEED_DB == 'dev') {
           seedFolder = 'dev';
         }

         var filename = __dirname + '/../../common/data/' + seedFolder + '/' + modelName + '.json';
         if (fs.existsSync(filename)) {
           var json_str = fs.readFileSync(filename);
           var data = JSON.parse(json_str);
           app.models[modelName].create(data, function (err, Model) {
             if (err) throw err;
             console.log(modelName + ' data created');
             callback(); // tell async that the iterator has completed
           });
         } else {
            callback(); // tell async that the iterator has completed
         }
       });

      }, function(err) {
       console.log('seed done');
       process.exit();
    });
  }

  require('events').EventEmitter.prototype._maxListeners = maxListeners;
};
