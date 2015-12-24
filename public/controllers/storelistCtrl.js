app.controller('storelistCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout){
	$scope.pageSize = 25;
	$scope.currentPage = 1;
	$scope.valuesnull=false;
	$scope.errmsgshow=false;
	
	var getValues=function(){
		$http.get('/storelist').success(function(data){
			$scope.codevalues=data;
		});
	}
	getValues();
	
	$scope.checkActive=function(st,id){
		$http.post('/storestatus',{st,id}).success(function(data){
		$scope.searchValues();
		});
	}
	
	$scope.searchValues=function(){
		console.log($scope.search);
		if($scope.search == undefined ||  Object.keys($scope.search).length==0 ){
			$scope.errmsgshow=true;
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		else {
			var a=$scope.search;
				for (var i in a) 
				{ 
					if (a[i] === '' || a[i] == undefined ) { 
					 delete a[i]; 
					}
				}
			$http.post('/getStoreValues',a).success(function(response){
				
				if(Object.keys(response).length==0 ){
					console.log("response");
					$scope.valuesshow=false;
					$scope.valuesnull=true;
				}
				else{
					$scope.valuesnull=false;
					$scope.valuesshow=true;
					$scope.values=response;
				}
			});}
	}
	$scope.Reset=function(){
		$scope.search={};
		$scope.values={};
		$scope.errmsgshow=false;
		destroycode();
	}
}]);
function destroycode(){

	$('.selectcode').select2('val', null)
	$('.selectcode').select2();

}