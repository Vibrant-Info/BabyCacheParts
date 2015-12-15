app.controller('getPartsCtrl', function($scope, $http,$timeout) {
	$scope.part = {};
	$scope.error = false;
	$scope.insert = false;
	
	$scope.getPartCodeLoad = function(){
		$http.get('/getCodes').success(function(response){
			$scope.codes = response;
		});
	}
	$scope.getshippingTypes = function(){
		$http.get('/getshippingTypes').success(function(response){
			console.log(response);
			$scope.shipTypes = response;
		});
	}
	$scope.searchByPart = function(){
		console.log($scope.part);
	}
	$scope.addPart = function(){
		var letterNumber = /^[0-9a-zA-Z]+$/;  	
		if($scope.part.code != undefined && $scope.part.name != undefined){	
			$scope.part.code = angular.uppercase($scope.part.code);
			$scope.part.name = angular.uppercase($scope.part.name);
			var res = $scope.part.code.split("-");		
			if(res[0] == 'P' && res[1].match(letterNumber) && res[2] != '' && res[2] != undefined ){					
				$http.post('/addPart',$scope.part).success(function(response){
					console.log(response);
					if(response == 0){
						$scope.part = {};
						$scope.insert = true;
						$timeout(function(){
							 $scope.insert = false;
						},3000);
					}else {
						$scope.error = true;
						$scope.pattern = "Part code is already present";
						$timeout(function(){
							 $scope.error = false;
						},3000);
					}				
				});
			}else {
				$scope.error = true;
				$scope.pattern = "part code format is not supported... sample part code : P-1234-COL-ITEM";
				$timeout(function(){
					 $scope.error = false;
				},5000);
			}
		}else {
			$scope.error = true;
			$scope.pattern = "Please Fill all Fields";
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
	$scope.getPartCodeLoad();
	$scope.getshippingTypes();
});


