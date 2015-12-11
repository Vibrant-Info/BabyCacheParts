app.controller('storelistCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout){
	$scope.pageSize = 25;
	$scope.currentPage = 1;
	$scope.tablevaluesshow = true;
	$scope.errmsgshow=false;
	
	var getValues=function(){
		$http.get('/storelist').success(function(data){
			console.log(data);
			//$scope.tablevaluesshow=true;
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
	
	$scope.datasearch=function(){
		getValues();
		if($scope.tablevaluesshow == true){
			$scope.tablevaluesshow	 = false;		
		}	
		else
			$scope.tablevaluesshow = true;
	}
	
	$scope.searchValues=function(){
		console.log($scope.search);
		
		if($scope.search ==undefined || Object.keys($scope.search).length==0 ){
			$scope.errmsgshow=true;
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		else {
			
			$scope.errmsgshow=false;
			$scope.tablevaluesshow=true;
			$scope.searchQuery = angular.copy($scope.search);
		   $scope.searchResult=true;
		} 
    }
	$scope.Reset=function(){
		$scope.tablevaluesshow=false;
		$scope.search={};
		$scope.errmsgshow=false;
		destroycode();
	}
}]);
function destroycode(){

	$('.selectcode').select2('val', null)
	$('.selectcode').select2();

}
