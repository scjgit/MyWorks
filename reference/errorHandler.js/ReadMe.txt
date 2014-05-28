Config: 
1.       Inject 'logger' into your main app
2.       modify the service url value

var loggerModule = angular.module('logger', []);
loggerModule.value('ServiceUrl','http://loggerServiceUrl'); // provide service url


Usage:
       var log=loggerService('chromeapp-memberLookupCntrl');

       log.log("goAsGuestonSuccess",data );
log.error(data.responseStatus.errorMessge);
