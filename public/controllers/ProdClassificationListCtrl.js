app.controller('ProdClassificationListCtrl', function($scope, $http,$timeout) {
	$scope.prod = {};
	$scope.error = false;
	$scope.prodTypeLoad = function(){
		$http.get('/getTypes').success(function(response){
			$scope.types = response;
		});
	}
	$scope.search = function(){	
		if($scope.prod.types != undefined || $scope.prod.name != undefined || $scope.prod.check != undefined){
			$http.post('/searchClassification',$scope.prod).success(function(response){
				console.log(response);
				$scope.classification = response;						
			});
		}else {
			$scope.error = true;
			$timeout(function(){
				 $scope.error = false;
			},3000);
		}	
	}
	$scope.value = {};
	$scope.changeSts = function(val,id){		
		 $scope.value.val = val;
		$scope.value.id = id; 
		$http.put('/chgeSts',$scope.value).success(function(response){
			if(response.affectedRows == 1)
				$scope.search();			
		});
	}	
	$scope.prodTypeLoad();
});
