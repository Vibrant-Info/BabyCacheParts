app.controller('storelistCtrl',['$scope','$http',function($scope,$http){
	
	$scope.getValues=function(){
		
	$http.get('/storelist').success(function(data){
		$scope.values=data;
	});
	}
	$scope.checkActive=function(st,id){
		$http.post('/storestatus',{st,id}).success(function(data){
		console.log(data);
		getValues();
	});
		
	}
}]);