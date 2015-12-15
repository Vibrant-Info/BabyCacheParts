app.controller('stafflistCtrl',['$scope','$http','$timeout','$uibModal',function($scope,$http,$timeout,$uibModal){

	$scope.editId="";
	$scope.errmsgshow=false;
	var getValues= function(){
		$http.get('/getStorecode').success(function(response){
		$scope.values=response;
		}); 
	}
	getValues();
	$scope.staffSearch=function(){
		if($scope.staff==undefined || Object.keys($scope.staff).length==0){
			$scope.errmsgshow=true;
			$scope.values={};
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		else{
			
			var a=$scope.staff;
				for (var i in a) 
				{ 
					if (a[i] === '' ) { 
					 delete a[i]; 
					}
				}
			
			$http.post('/getStaffValues',$scope.staff).success(function(response){
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
				
			
			});
		
		}
		
	}
	$scope.resetSearch=function(){
			$scope.staff={};
			$scope.errmsgshow=false;
			$scope.values={};
			destroycode();
			getValues();
		}
	$scope.checkActive=function(st,id){
		$http.post('/staffstatus',{st,id}).success(function(data){
		console.log(data);
		$scope.staffSearch();
		});
	}
	
	//Edit Staff datas
	 
	$scope.editStaff = [];
	$scope.selectStaff=function(id){
		$http.post('/editstaff',{id}).success(function(response){
			$scope.editStaff=response;
			var modalInstance = $uibModal.open({
			  animation: true,
			  templateUrl: 'editStaff.html',
			  controller: 'staffupdateCtrl',			
			  resolve: {
					edit: function () {
					 return  response;
					}
				}			
			}); 
		});
		
	}
	
}]);
app.controller('staffupdateCtrl',function($scope,$http,$timeout,$uibModalInstance,edit,md5){
	$scope.editStaff=edit;
	$scope.successshow=false;
	$scope.updateStaff = function () {
		 if($scope.editStaff.password!=undefined){
			$scope.editStaff.password=md5.createHash($scope.editStaff.password || '');
		} 
		  $http.post('/updateStaff',$scope.editStaff).success(function(response){
			if(response.affectedRows==1){
				$scope.successshow=true;
				$timeout(function(){
					$uibModalInstance.close();
				},3000);
			}
		});
	};

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

function destroycode(){

	$('.selectcode').select2('val', null)
	$('.selectcode').select2();

}
