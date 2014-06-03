'use strict';

angular.module('logInAngApp')
  .controller('MainCtrl', function ($scope, applicationLog, ejournelLog) {
    $scope.awesomeThings = "node log4j Example";
    applicationLog.logERROR("node log4j Example");
    ejournelLog.logINFO("node log4j Example");
  });