app.controller("productCtrl",['$scope','$http',function($scope,$http){
$scope.data="product";
		
		$http.get('/productskn').success(function(data){
			console.log("data="+data);
			$scope.values=data;
		});
		
	
}])