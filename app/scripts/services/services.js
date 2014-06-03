'use strict';
angular.module('logInAngApp').factory('$exceptionHandler',function($log,printStackTrace){
	return function (exception){
		$log.info("In $exceptionHandler");
		$log.info(exception.message);
	    $log.info(exception.stack);
	    printStackTrace.pushStackTrace("ERROR",exception.message);
	    printStackTrace.pushStackTrace("ERROR",exception.stack);
	};
});

angular.module('logInAngApp').factory('printStackTrace',function($log){
	return {
		pushStackTrace : function (logFile,logType,logMessage){
			$log.info(logFile,':',logMessage);
			$.ajax({
				type: "POST",
				url: 'http://localhost:9002/log', 
				contentType: "application/json",
				data: { 
					"logFile" : logFile,
					"logType" : logType,
					"logData" : logMessage
					}
			});			
		}
	};
});

angular.module('logInAngApp').factory('applicationLog',function($log,printStackTrace){
	return {
		logWARN : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','WARN',logMessage);
		},
		logDEBUG : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','DEBUG',logMessage);
		},
		logINFO : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','INFO',logMessage);
		},
		logTRACE : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','TRACE',logMessage);
		},
		logERROR : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','ERROR',logMessage);
		},
		logFATAL : function (logMessage){
			printStackTrace.pushStackTrace('APPLOG','FATAL',logMessage);
		}
	};
});

angular.module('logInAngApp').factory('ejournelLog',function($log,printStackTrace){
	return {
		logWARN : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','WARN',logMessage);
		},
		logDEBUG : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','DEBUG',logMessage);
		},
		logINFO : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','INFO',logMessage);
		},
		logTRACE : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','TRACE',logMessage);
		},
		logERROR : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','ERROR',logMessage);
		},
		logFATAL : function (logMessage){
			printStackTrace.pushStackTrace('EJLOG','FATAL',logMessage);
		}
	};
});