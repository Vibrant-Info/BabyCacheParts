app.controller('ProdClassificationListCtrl', function($scope, $http) {
	$scope.prodTypeLoad = function(){
		$http.get('/getTypes').success(function(response){
			$scope.types = response;
		});
	}
	$scope.search = function(val){
		alert(val);
		// $http.post('/chgeSts',{val, id}).success(function(response){
			// if(response.affectedRows == 1)
				// $scope.pblmTypeLoad();
			// else {
				// $scope.error = true;
				// $timeout(function(){
					// $scope.error = false;
				// },3000);
			// }
				
		// });
	}	
	$scope.prodTypeLoad();
});
