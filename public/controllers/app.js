'use strict';

var app = angular.module('app', ['ngResource', 'ngRoute','ui.bootstrap','ui.utils','angular-md5','ngSanitize','ui.select','angularjs-dropdown-multiselect'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
   
    $routeProvider
      .when('/', {
        redirectTo:'/login'
      })
	   .when('/login', {
        templateUrl: 'login.html',
        controller: 'LoginCtrl',
		
      })
      .when('/home', {
        templateUrl: 'home.html',
		
        resolve: {
          loggedin: checkLoggedin
        }
      })
     
	   .when('/product', {
        templateUrl: 'product.html',
		  resolve: {
          loggedin: checkLoggedin
        }
		})     
	   .when('/add-part', {
        templateUrl: 'add-part.html',
		  resolve: {
          loggedin: checkLoggedin
        }
		})
	   .when('/product-part-list', {
        templateUrl: 'product-par-list.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	  
	   .when('/orders-order-parts', {
        templateUrl: 'orders-order-parts.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/order-status', {
        templateUrl: 'order-status.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      }) .when('/store-list', {
        templateUrl: 'store-list.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      }) .when('/add-store', {
        templateUrl: 'add-store.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/staff-list', {
        templateUrl: 'staff-list.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/add-staff', {
        templateUrl: 'add-staff.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/productclassificationlist', {
        templateUrl: 'productclassificationlist.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/problemtypelist', {
        templateUrl: 'problemtypelist.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/shipping-type-list', {
        templateUrl: 'shipping-type-list.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
	   .when('/add-product', {
        templateUrl: 'add-product.html',
		  resolve: {
          loggedin: checkLoggedin
        }
        
      })
      .otherwise({
        redirectTo: '/home'
      });


  }) 
  .run(function($rootScope, $http,$location){
	
    $rootScope.message = '';
	$rootScope.uname='';
	  var rootpermission=['/home','/product','/product-part-list','/orders-order-parts','/order-status','/store-list','/add-store','/staff-list','/add-staff','/productclassificationlist','/problemtypelist','/shipping-type-list','/add-product','/add-part'];
		$rootScope.$on('$routeChangeStart',function(){
			sessionStorage.setItem("page",rootpermission[rootpermission.indexOf($location.path())]);
		
			if(rootpermission.indexOf($location.path())==-1 ){
					$http.get('/loggedin').success(function(user){
					
						// Authenticated
						if (user !== '0')
						{
							$location.url(sessionStorage.getItem("page"));
							return;
							

						}
						// Not Authenticated
						else {
						  console.log("no login");
						}
					  });
			
			
			}
		} )  
    // Logout function is available in any pages
    $rootScope.logout = function(){
     sessionStorage.removeItem('user');
     sessionStorage.removeItem('id');
     sessionStorage.removeItem('partclick');
     sessionStorage.removeItem('page');
      $http.post('/logout');
    };
  });

app.filter('startFrom',function(){
	return function(data,start){
		 if (!data || !data.length) { return; }
		start=0+start;
		return data.slice(start);
	}
});
app.filter('propsFilter', function() {
  return function(items, props) {
    var out = [];

    if (angular.isArray(items)) {
      items.forEach(function(item) {
        var itemMatches = false;

        var keys = Object.keys(props);
        for (var i = 0; i < keys.length; i++) {
          var prop = keys[i];
          var text = props[prop].toLowerCase();
          if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
            itemMatches = true;
            break;
          }
        }

        if (itemMatches) {
          out.push(item);
        }
      });
    } else {
      // Let the output be the input untouched
      out = items;
    }

    return out;
  }
});
app.service('userservice', function() {
	var users;
	var userid;
	this.saveuser=function(user){
		users=user;
	}
	this.saveid=function(id){
		userid=id;
	}
	this.getuser=function(){
		return users;
	}
	this.getid=function(){
		return userid;
	}
});



