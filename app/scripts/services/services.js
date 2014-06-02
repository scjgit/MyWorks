'use strict';
angular.module('logInAngApp').factory('$exceptionHandler',function($log,printStackTrace){
	return function (exception){
		$log.info("In $exceptionHandler");
		//var log4js = require('log4js');
		//var logger = log4js.getLogger();
		//logger.debug("Some debug messages");
		$log.info(exception.message);
	    $log.info(exception.stack);
	    printStackTrace.pushStackTrace({data:exception.message});
	};
});

angular.module('logInAngApp').factory('printStackTrace',function($log,$injector){
	return {
		pushStackTrace : function (logData){
			$log.info('In pushStackTrace');
			$log.info(logData);
			var http = $injector.get('$http');
			
			$.ajax({
				type: "POST",
				url: 'http://localhost:9002/log', 
				contentType: "application/json",
				data: logData
			});
			
		}
	};
});