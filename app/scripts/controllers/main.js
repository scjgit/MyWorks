'use strict';

angular.module('logInAngApp')
  .controller('MainCtrl', function ($scope, applicationLog, ejournalLog) {
    applicationLog.logERROR("logs push to application log file");
    ejournalLog.logINFO("logs push to ejournal log file");
  	dd.yy
  });