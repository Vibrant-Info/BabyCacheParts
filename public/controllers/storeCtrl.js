app.controller('storeCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout){
	$scope.successmsgshow=false;
	$scope.errmsgshow=false;
	$scope.addStore=function(){
		console.log($scope.store);
		
		$http.post('/addstore',$scope.store).success(function(data){
			console.log(data);
			if(data=="0"){
				$scope.errmsgshow=true;
				$scope.errmsg="Store Code already exist";
				  $timeout(function() {
					   $scope.errmsgshow=false;
					  
			}, 3000);
			}
			if(data=="1"){
				$scope.errmsgshow=true;
				$scope.errmsg="Store name already exist";
				 $timeout(function() {
					   $scope.errmsgshow=false;
					  
			}, 3000);
			}
			if(data=="2"){
			
			$scope.successmsgshow=true;
			$scope.successmsg="Store Inserted Successfully";
			 $timeout(function() {
					   $scope.successmsgshow=false;
					   $scope.store="";
			}, 3000);
			}
		}).error(function(err){
			console.log("Error="+err);
		});
	}
	
	 
}]);
 