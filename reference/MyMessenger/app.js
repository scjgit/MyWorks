
var app = angular.module('myApp', ['ngSanitize']).config(function ($provide, $httpProvider) {
  var $http;

  // Intercept http calls.
  $provide.factory('AppHttpInterceptor', function ($q,$injector) {
  	var $rootScope,
  	showLoader=function (showloader){// generic method to show/hide the spinner
					var element= document.getElementById('loading');
					if (showloader) {
						element.style.display='block';
					}else{
						element.style.display='none';
						 $rootScope.hideSpinner = false;
					}
				};
    return {
      // On request success
      request: function (config) {
      	console.log('config'); 
       	console.log(config); // Contains the data about the request before it is sent.
 		$rootScope = $rootScope || $injector.get('$rootScope');
      	if(!$rootScope.hideSpinner){
            showLoader(true);
        }
        // Return the config or wrap it in a promise if blank.
        return config || $q.when(config);
      },
 
      // On request failure
      requestError: function (rejection) {
        console.log('rejection');
        console.log(rejection); // Contains the data about the error on the request.
        $rootScope = $rootScope || $injector.get('$rootScope');
        $http = $http || $injector.get('$http');
        if($http.pendingRequests.length < 1) {
            showLoader(false);
        }
        // Return the promise rejection.
        return $q.reject(rejection);
      },
 
      // On response success
      response: function (response) {
      	console.log('response');
      	console.log(response);

        $rootScope = $rootScope || $injector.get('$rootScope');
        $http = $http || $injector.get('$http');
        if($http.pendingRequests.length < 1) {
            showLoader(false);
        }
        
        return response || $q.when(response);
      },
 
      // On response failture
      responseError: function (rejection) {
        console.log('rejection');
        console.log(rejection); // Contains the data about the error.
       
        $rootScope = $rootScope || $injector.get('$rootScope');
        $http = $http || $injector.get('$http');
        if($http.pendingRequests.length < 1) {
            showLoader(false);
        }
        // Return the promise rejection.
        return $q.reject(rejection);
      }
    };
  });
 
  // Add the interceptor to the $httpProvider.
  $httpProvider.interceptors.push('AppHttpInterceptor');
 
}).run(function($injector) {
		'use strict';
		var $rootScope=$injector.get('$rootScope');
		$rootScope.hideSpinner= false;
        
});
// We define the socket service as a factory so that it
// is instantiated only once, and thus acts as a singleton
// for the scope of the application.
app.factory('socket', function ($rootScope) {
	var socket = '';
	return {
		init: function(sock){
		socket=sock;
		},
		on: function (eventName, callback) {
			socket.on(eventName, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					callback.apply(socket, args);
				});
			});
		},
		emit: function (eventName, data, callback) {
			socket.emit(eventName, data, function () {
				var args = arguments;
				$rootScope.$apply(function () {
					if (callback) {
						callback.apply(socket, args);
					}
				});
			})
		}
	};
});

function MainCtrl($scope, socket,$location,$document,$http,$rootScope
	) {
	$scope.message = '';
	$scope.messages = [];
	$scope.showMessenger=false;
	$scope.userName='';
	$scope.toUser='';
	$scope.pre="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>Me: </b>";
	$scope.newMessage=0;
	$scope.appname="My Messenger";
	$scope.loggedInUsers=new Array();
	document.title= "My Messenger";
	$scope.loggedIn=false;
	
	// Tell the server there is a new message
	$scope.broadcast = function() {
		$scope.newMessage=0;
		document.title= $scope.appname;
		if(!angular.equals($scope.toUser,'') && !angular.equals($scope.userName,'') && !angular.equals($scope.message,'')){
			socket.emit('broadcast:msg', {message: $scope.message,to:$scope.toUser,from:$scope.userName});
			$scope.messages.unshift({message:$scope.pre+$scope.message,from:"me-msg"});
			//$scope.messages.unshift($scope.pre+$scope.message);
			$scope.message = '';
		}
	};
	
	$scope.login=function(){
	if($scope.loggedIn)
		return true;
		
	$scope.loggedIn=true;
		if(!angular.equals($scope.userName,'')){
			socket.init(io.connect('http://'+$location.host()+':'+$location.port()));
			socket.emit('user:add', {userName: $scope.userName});
		
			$scope.showMessenger=true;
			
			// When we see a new msg event from the server
			socket.on($scope.userName.toLowerCase(), function (data) {
				for(var i=0;i<data.length;i++){
					if(data[i].from==$scope.userName){
						$scope.messages.unshift({message:"<b>Me</b>: "+data[i].message,from:"me-msg"});
					}
					else{
						$scope.messages.unshift({message:"<b>"+data[i].from+"</b>: "+data[i].message,from:"friend-msg"});
					}
					//$scope.messages.unshift("<b>"+data[i].from+"</b>: "+data[i].message);
					$scope.newMessage++;
				}
				if($scope.newMessage>0){
				document.title= "("+$scope.newMessage+") "+$scope.appname ;
				}
				
				
			});
			
				// When we see a new msg event from the server
			socket.on("newUser", function (data) {
				$scope.loggedInUsers=data;
				//$scope.loggedInUsers=$scope.loggedInUsers.splice($scope.loggedInUsers.indexOf($scope.userName),1)[0]
			
				
			});
			
			
		}
	};
	
	$scope.selectUser=function(friend){
		$scope.toUser=friend;
		
		$http({
		    url: 'dssapp/restapi/product?device=AD08606E37C525',
		    method: "GET"
		    //params: {"device":"sandeep"}
		}).success(function(data,status){
			console.log(data);
		}).error(function(data,status){
			console.log(data);
			console.log(status);
		});
	};	
	
	window.onfocus=function(){
		$scope.newMessage=0;
		window.document.title= $scope.appname;

	};
	
}