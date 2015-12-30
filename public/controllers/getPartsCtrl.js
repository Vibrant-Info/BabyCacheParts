app.controller('addProdsCtrl', function($scope, $http,$timeout,$uibModal,$rootScope) {
	$scope.part = {};
	$scope.byproduct = {};
	$scope.pageSize = 25;
	$scope.currentPage = 1;
	$scope.error = false;
	$scope.insert = false;	
	$scope.prod = {};
	$scope.valuesnull=false;

	$scope.getPartCodeLoad = function(){
		$http.get('/getCodes').success(function(response){
			$scope.codes = response;
		});
	}

	$scope.getProductcodeLoad=function(){
		$http.get('/getProductCodes').success(function(response){
			$scope.productcode = response;
		});
	}
	$scope.getshippingTypes = function(){
		$http.get('/getshippingTypes').success(function(response){		
			$scope.shipTypes = response;
		});
	}
	 $rootScope.$on("callsearch", function(){
		
        $scope.searchByPart();
	});
	$rootScope.$on("callshiptypes", function(){
			 
	 $scope.getshippingTypes();
	});

	$scope.searchByPart = function(){
		
		if($scope.part == undefined ||  Object.keys($scope.part).length==0 ){
			$scope.errmsgshow=true;
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		else {
			sessionStorage.setItem("partclick","searchByPart");
		
			var partvalues=$scope.part;
				for (var i in partvalues) 
				{ 
					if (partvalues[i] === '' || partvalues[i] == undefined ) { 
					 delete partvalues[i]; 
					}
				}
			$http.post('/searchPart',partvalues).success(function(response){
				if(Object.keys(response).length==0 ){
					$scope.valuesshow=false;
					$scope.valuesnull=true;
				}
				else{
					$scope.values=[];
					$scope.byproduct = {};
					$scope.valuesnull=false;
					$scope.valuesshow=true;
					$scope.values=response;
				}
			});}
	}
	$scope.searchByProduct=function(){
		console.log($scope.byproduct);
	
			if($scope.byproduct == undefined ||  Object.keys($scope.byproduct).length==0 ){
			$scope.errproductmsgshow=true;
			$timeout(function(){
				$scope.errproductmsgshow=false;
			},3000);
		}
		else {
				sessionStorage.setItem("partclick","searchByProduct");
				var productvalues=$scope.byproduct;
				for (var i in productvalues) 
				{ 
					if (productvalues[i] === '' || productvalues[i] == undefined ) { 
					 delete productvalues[i]; 
					}
				}
		$http.post('/searchbyproduct',productvalues).success(function(response){
			
			if(response=="0" ){
					$scope.valuesshow=false;
					$scope.valuesnull=true;
				}
				else{
					$scope.valuesnull=false;
					$scope.valuesshow=true;
					$scope.values=[];
					$scope.part = {};
					for(var i=0;i<response.length;i++){
						$scope.values.push(response[i][0]);
					}
					
				}
			});
		}
		
	}
	$scope.addPart = function(){
		var letterNumber = /^[0-9a-zA-Z]+$/;  	
		if($scope.part.code != undefined && $scope.part.name != undefined){	
			$scope.part.code = angular.uppercase($scope.part.code);
			$scope.part.name = angular.uppercase($scope.part.name);
			var res = $scope.part.code.split("-");		
			if(res[0] == 'P' && res[1].match(letterNumber) && res[2] != '' && res[2] != undefined ){					
				$http.post('/addPart',$scope.part).success(function(response){
					
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
		$http.put('/chgepartSts',$scope.value).success(function(response){
			if(response.affectedRows == 1)
				var partupdate=sessionStorage.getItem("partclick");
						
					if(partupdate == "searchByProduct"){
						$scope.searchByProduct();
					}
					if(partupdate == "searchByPart"){
						$scope.searchByPart();
					}
		});
	}

$scope.editPart = [];
$scope.partids={};
	$scope.selectPart=function(part){
		var modalInstance = $uibModal.open({
		  animation: true,
		  templateUrl: 'editPart.html',
		  controller: 'partupdateCtrl',			
		  resolve: {
				edit: function () {
				 return  part;
				}
			}			
		});
		
	}
	$scope.resetAll=function(){
		$scope.part={};
		$scope.byproduct={};
		$scope.errmsgshow=false;
		$scope.values={};
		destroycode();
		$scope.getProductcodeLoad();
		$scope.getPartCodeLoad();
		$scope.getshippingTypes();
	}
	//Product Functions
	$scope.addProduct = function(){		
		var letterNumber = /\d/;
		var number = /^[0-9]+$/;
		var sku = $scope.prod.sku;
		$scope.prod.code = angular.uppercase($scope.prod.code);
		$scope.prod.name = angular.uppercase($scope.prod.name);
		$scope.prod.color = angular.uppercase($scope.prod.color);
		$scope.prod.sku = angular.uppercase($scope.prod.sku);
		$scope.prod.product = angular.uppercase($scope.prod.product);
		$scope.prod.item = angular.uppercase($scope.prod.item);
		
		if($scope.prod.code != undefined && $scope.prod.name != undefined && $scope.prod.color != undefined && $scope.prod.sku != undefined  && $scope.prod.product != undefined && $scope.prod.item != undefined ){				
			var res = $scope.prod.code.split("-");		
			if(letterNumber.test(res[0])){
				if(sku.match(number)){
					$http.post('/addProduct',$scope.prod).success(function(response){
							console.log(response);
					if(response == 0){
						$scope.prod = {};
						$scope.insert = true;
						$timeout(function(){
							 $scope.insert = false;
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
					$scope.pattern = "SKU/SKN should be number";
					$timeout(function(){
						 $scope.error = false;
					},5000);
				}
			}else{
				$scope.error = true;
				$scope.pattern = "Item code format is not supported..";
				$timeout(function(){
					 $scope.error = false;
				},5000);
			}
		}else{
			$scope.error = true;
			$scope.pattern = "Please Fill all Fields";
			$timeout(function(){
				 $scope.error = false;
			},3000);
		}
	}
	$scope.getProductcodeLoad();
	$scope.getPartCodeLoad();
	$scope.getshippingTypes();
});
function destroycode(){

	$('select').select2('val','');
	$('select').select2();

}

app.controller('partupdateCtrl',function($scope,$http,$timeout,$uibModalInstance,edit,md5,$rootScope){
	$scope.uperror=false;
	$scope.part=edit;
	$scope.successshow=false;
	$http.get('/getshippingTypes').success(function(response){
		$scope.shipTypes = response;
	});
	$scope.updatePart = function () {
		var letterNumber = /^[0-9a-zA-Z]+$/;  	
		if($scope.part.code != undefined){	
		
			$scope.part.code = angular.uppercase($scope.part.code);
			$scope.part.name = angular.uppercase($scope.part.name);
			var res = $scope.part.code.split("-");		
			if(res[0] == 'P' && res[1].match(letterNumber) && res[2] != '' && res[2] != undefined ){	
			  $http.post('/updatePart',$scope.part).success(function(response){
				if(response.affectedRows==1){
					$scope.successshow=true;
					$timeout(function(){
						$uibModalInstance.close();
					},3000);
					//$rootScope.$emit("callsearch", {});
					}
					if(response=="0"){
						$scope.uperror = true;
						$scope.uppattern = "Part code is already present";
						$timeout(function(){
							 $scope.uperror = false;
						},3000);
					}
				});
			}
			else{
				$scope.uperror = true;
				$scope.uppattern = "part code format is not supported... sample part code : P-1234-COL-ITEM";
				$timeout(function(){
					 $scope.uperror = false;
				},5000);
			}
		}
	}

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
	
	

