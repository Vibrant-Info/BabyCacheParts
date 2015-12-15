app.controller('stafflistCtrl',['$scope','$http','$timeout','$uibModal',function($scope,$http,$timeout,$uibModal){
	$scope.editStaff={};
	$scope.editId="";
	$scope.errmsgshow=false;
	 $http.get('/getStorecode').success(function(response){
		$scope.values=response;
	}); 
	$scope.staffSearch=function(){
		if($scope.staff==undefined || Object.keys($scope.staff).length==0){
			$scope.errmsgshow=true;
			$scope.values={};
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		else{
			$http.post('/getStaffValues',$scope.staff).success(function(response){
				$scope.values=response;
			});
		}
	}
	$scope.resetSearch=function(){
			$scope.staff={};
			$scope.errmsgshow=false;
			$scope.values={};
			destroycode();
		}
	$scope.checkActive=function(st,id){
		$http.post('/staffstatus',{st,id}).success(function(data){
		console.log(data);
		$scope.staffSearch();
		});
	}
	
	//Edit Staff datas
	$scope.editStaff={};
	$scope.selectStaff=function(id){
			
			var modalInstance = $uibModal.open({
			  animation: $scope.animationsEnabled,
			  templateUrl: 'editStaff.html',
			  controller: 'staffupdateCtrl',
			
				resolve: {
					editStaff: function () {
						console.log(id);
					  return getStaff(id);
					}
							
					
			 }
			
			});
	}
	var getStaff=function(id){
		$http.post('/editstaff',id).success(function(response){
			console.log(response);
			$scope.editStaff=response;
			console.log($scope.editStaff.firstname);		
		});
	}
	
}]);
app.controller('staffupdateCtrl',['$scope','$http','$timeout','$uibModalInstance',function($scope,$http,$timeout,$uibModalInstance,editStaff){
	
	
	$scope.update = function () {
    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
}]);

	function destroycode(){

		$('.selectcode').select2('val', null)
		$('.selectcode').select2();

}
