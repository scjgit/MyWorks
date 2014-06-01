'use strict';
angular.module('logInAngApp').factory('$exceptionHandler',function($log,printStackTrace){
	return function (exception){
		$log.info("In $exceptionHandler");
		//var log4js = require('log4js');
		//var logger = log4js.getLogger();
		//logger.debug("Some debug messages");
		$log.info(exception.message);
	    $log.info(exception.stack);
	    printStackTrace.pushStackTrace(exception.stack);
	};
});

angular.module('logInAngApp').factory('printStackTrace',function($log){
	return {
		pushStackTrace : function (data){
			$log.info('In pushStackTrace');
			$log.info(data);
		}
	};
});