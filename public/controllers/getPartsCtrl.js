app.controller('getPartsCtrl', function($scope, $http,$timeout,$uibModal,$rootScope) {
	$scope.part = {};
	$scope.pageSize = 25;
	$scope.currentPage = 1;
	$scope.error = false;
	$scope.insert = false;
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
					$scope.valuesnull=false;
					$scope.valuesshow=true;
					console.log(response);
					$scope.values=response;
				}
			});}
	}
	$scope.searchByProduct=function(){
		
		$scope.values=[];
			if($scope.part == undefined ||  Object.keys($scope.part).length==0 ){
			$scope.errproductmsgshow=true;
			$timeout(function(){
				$scope.errproductmsgshow=false;
			},3000);
		}
		else {
		
			var productvalues=$scope.part;
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
		$http.put('/chgeSts',$scope.value).success(function(response){
			if(response.affectedRows == 1)
				$scope.searchByProduct();			
					
		});
	}

$scope.editPart = [];
$scope.partids={};
	$scope.selectPart=function(pid,sid){
		
		$scope.partids.pid=pid;
		$scope.partids.sid=sid;
		$http.post('/editPart',$scope.partids).success(function(response){
			$scope.editPart=response;
			var modalInstance = $uibModal.open({
			  animation: true,
			  templateUrl: 'editPart.html',
			  controller: 'partupdateCtrl',			
			  resolve: {
					edit: function () {
					 return  response;
					}
				}			
			}); 
		});
		
	}
	$scope.resetAll=function(){
		$scope.part={};
		$scope.errmsgshow=false;
		$scope.values={};
		destroycode();
		$scope.getProductcodeLoad();
		$scope.getPartCodeLoad();
		$scope.getshippingTypes();
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
	
	$scope.editPart=edit;
	$scope.successshow=false;
	$http.get('/getshippingTypes').success(function(response){
		$scope.shipTypes = response;
	});
	$scope.updatePart = function () {
		  $http.post('/updatePart',$scope.editPart).success(function(response){
			if(response.affectedRows==1){
				$scope.successshow=true;
				$timeout(function(){
					$uibModalInstance.close();
				},3000);
				$rootScope.$emit("callsearch", {});
			}
		});
	};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
	
	

