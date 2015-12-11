app.controller('storelistCtrl',['$scope','$http',function($scope,$http){
	
	var getValues=function(){
	$http.get('/storelist').success(function(data){
		$scope.values=data;
	});
	}
	getValues();
	$scope.checkActive=function(st,id){
		$http.post('/storestatus',{st,id}).success(function(data){
		console.log(data);
		getValues();
	});
		
	}
}]);