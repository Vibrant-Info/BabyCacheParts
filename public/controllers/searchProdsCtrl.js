app.controller('searchProdsCtrl', function($scope, $http,$timeout,$uibModal) {
	$scope.prod={};
	$scope.product=[];
	$scope.value = {};
	$scope.valuesnull=false;
	$scope.valuesshow=false;
	$scope.getProdCodeLoad = function(){
		$http.get('/getProdCodes').success(function(response){
			$scope.codes = response;
		});
	}
	$scope.getClassificationType = function(){
		$http.get('/getClassificationType').success(function(response){
			$scope.collection = response.collection;
			$scope.color = response.color;
			$scope.producttype = response.prod;
			
		});
	}
	$scope.prodSearch=function(){
		if($scope.prod == undefined ||  Object.keys($scope.prod).length==0 ){
			$scope.errmsgshow=true;
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		$http.post('/getProducts',$scope.prod).success(function(response){	
			if(response.length>0){
				$scope.product=[];
				$scope.valuesnull=false;
				$scope.valuesshow=true;
				for(var i=0;i<response.length;i++){
					if(response[i][0] === undefined ){
						$scope.product=response;
					}
					else{
						$scope.product.push(response[i][0]);
					}
				}
			}
			if(response=="0"){
				$scope.valuesnull=true;
				$scope.valuesshow=false;
			}
			
		});
	}
	
	$scope.editProduct = function(val){
			var modalInstance = $uibModal.open({
			  animation: true,
			  templateUrl: 'editProd.html',
			  controller: 'produpdateCtrl',			
			  resolve: {
					edit: function () {
					 return  val;
					}
				}		
			}); 
	}
	
	$scope.changeSts = function(val,id){		
		$scope.value.val = val;
		$scope.value.id = id; 
	
		$http.put('/chgeStsProduct',$scope.value).success(function(response){
			if(response == 0)
				$scope.prodSearch();			
		});
	}	
	$scope.resetProduct=function(){
		$scope.valuesnull=false;
		$scope.valuesshow=false;
		$scope.product=[];
		$scope.prod={};
		$scope.getClassificationType();
		$scope.getProdCodeLoad();
	}
	$scope.getClassificationType();
	$scope.getProdCodeLoad();
});
app.controller('produpdateCtrl',function($http,$scope,edit,$timeout,$uibModalInstance){
	$scope.item = edit;
	$scope.colors = $scope.item.color;
	$scope.type = $scope.item.type;
	$scope.style = $scope.item.style;

		$http.get('/getClassificationType').success(function(response){
			$scope.collection = response.collection;
			$scope.color = response.color;
			$scope.producttype = response.prod;			
		});
		$scope.clear = function() {
			$scope.item.selected = undefined;
		};
		
		$scope.updateProd = function(){
			
			$scope.error = false;
			
			var letterNumber = /\d/;
			var number = /^[0-9]+$/;
			var sku = $scope.item.skn;
			$scope.item.code = angular.uppercase($scope.item.code);
			$scope.item.name = angular.uppercase($scope.item.name);
			$scope.item.sku = angular.uppercase($scope.item.skn);			
		
			$scope.item.color = $scope.colors;
			$scope.item.style = $scope.style;
			$scope.item.type = $scope.type;
			$scope.update = false;
			
			var codeSplit = $scope.item.code.split('-');
			console.log($scope.type);
			console.log($scope.style); 
			console.log($scope.colors);
			
			if($scope.item.code != '' && $scope.item.name != '' && $scope.item.color != undefined && $scope.item.skn != ''  && $scope.item.style != undefined && $scope.item.type != undefined ){
				if(sku.match(number)){
					$http.post('/updateProduct',$scope.item).success(function(response){
						if(response == 0){							
							$scope.update = true;
							$timeout(function(){
								 $scope.update = false;
								$uibModalInstance.close();
							},3000);
						}else if(response == 1) {
							$scope.error = true;
							$scope.pattern = "Item code is already present";
							$timeout(function(){
								 $scope.error = false;
							},3000);
						}else if(response == 2) {
							$scope.error = true;
							$scope.pattern = "Item Name is already present";
							$timeout(function(){
								 $scope.error = false;
							},3000);
						}else if(response == 3) {
							$scope.error = true;
							$scope.pattern = "SKU code is already present";
							$timeout(function(){
								 $scope.error = false;
							},3000);
						}
					});
				}else{
					$scope.error = true;
					$scope.pattern = "SKU Number should be Number";
					$timeout(function(){
						 $scope.error = false;
					},5000);
					
				}
			}else{
				$scope.error = true;
				$scope.pattern = "Fill All the Fields";
				$timeout(function(){
					 $scope.error = false;
				},5000);				
			}	
		}
		
		$scope.cancel = function(){
			$uibModalInstance.close();
		}

});