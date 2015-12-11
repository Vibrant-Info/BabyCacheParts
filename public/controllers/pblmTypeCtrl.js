app.controller('problemTypeCtrl', function($scope, $http) {
	$scope.pblmTypeLoad = function(){
		$http.get('/getPblm').success(function(response){
			$scope.pblmData = response;
		});
	}
	$scope.changeSts = function(val, id){
		$http.post('/chgeSts',{val, id}).success(function(response){
			if(response.affectedRows == 1)
				$scope.pblmTypeLoad();
			else {
				$scope.error = true;
				$timeout(function(){
					$scope.error = false;
				},3000);
			}
				
		});
	}	
	$scope.pblmTypeLoad();
});