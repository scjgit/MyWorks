'use strict';
angular.module('logInAngApp').factory('$exceptionHandler',function($log){
	return function (exception){
	$log.info("In $exceptionHandler");
	//var log4js = require('log4js');
	//var logger = log4js.getLogger();
	//logger.debug("Some debug messages");
	$log.info(exception.message);
    $log.info(exception.stack);
}
});