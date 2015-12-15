app.controller('addProdsCtrl', function($scope, $http,$timeout) {
	$scope.part = {};
	$scope.error = false;
	$scope.insert = false;
	$scope.prodTypeLoad = function(){
		$http.get('/getTypes').success(function(response){
			$scope.types = response;
		});
	}
	$scope.addPart = function(){
		var letterNumber = /^[0-9a-zA-Z]+$/;  	
		if($scope.part.code != undefined && $scope.part.name != undefined){			
			var res = $scope.part.code.split("-");
			if(res[0] == 'P' && res[1].match(letterNumber) && res[2] != ''){					
				$http.post('/addPart',$scope.part).success(function(response){
					if(response.affectedRows == 1){
						$scope.insert = true;
						$timeout(function(){
							 $scope.insert = false;
						},3000);
					}				
				});
			}
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
