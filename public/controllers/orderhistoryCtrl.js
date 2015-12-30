app.controller('orderhistoryCtrl', function($scope,$http,$timeout,$uibModal,$rootScope) {
	$scope.sknvalues=[];
	$scope.orvalues=[];
	$scope.orComments=[];
	$scope.searchorder=function(){
		$scope.order.staffid=sessionStorage.getItem("id");
		$http.post('/searchOrders',{orders:$scope.order}).success(function(response){
			$scope.orvalues=[];
			if(Object.keys(response).length>0){
				$scope.valuesnull=false;
				$scope.valuesshow=true;
				for(var i=0;i<response.length;i++){
					$scope.orvalues.push(response[i][0]);
				}
			}
	
			if(response=='0'){
				$scope.valuesnull=true;
				$scope.valuesshow=false;
			}
		
			
		});
	}
		 $rootScope.$on("callsearchorder", function(){
			$scope.searchorder();
		});
	$scope.getsknvalues=function(){
		$http.get('/getskns').success(function(response){
			$scope.sknvalues=response;
		})
	}
	$scope.orderDetails=function(getorder){
		console.log(getorder.orderid);
			$http.post('/getorderDetails',{id:getorder.orderid}).success(function(response){
				console.log(response);
				var modalInstance = $uibModal.open({
					  animation: true,
					  templateUrl: 'orderdetails.html',
					  controller: 'orderdetailCtrl',
					  size:'lg',
					  resolve: {
							edit: function () {
							 return  response;
							},
							addresses:function(){
								return getorder;
							}
						}			
					});
			});
		
	}
	$scope.cancelOrder=function(orderid){
		console.log(orderid);
		$http.post('/orderCancel',{orderid:orderid}).success(function(response){
			if(response=="1"){
				$scope.searchorder();
			}
			
		});
	}
	$scope.resetOrder=function(){
		$scope.order=[];
		$scope.order.orstatus = 3;
		$scope.orvalues=[];
	}
	$scope.getsknvalues();

});
app.controller('orderdetailCtrl',function($scope,$http,$timeout,$uibModalInstance,edit,addresses,md5,$rootScope){
	$scope.partvalues=[];
	for(var i=0;i<edit.length;i++){
		$scope.partvalues.push(edit[i]);
	}
	console.log($scope.partvalues);
	$scope.editOrder=addresses;
	$scope.oredit={};

	$scope.editStatus=[{name:'open',upstatus:'0'},{name:'Close',upstatus:'1'},{name:'Cancel',upstatus:'2'}];
	$scope.oredit.orstatus=$scope.editStatus[$scope.editOrder.status];
	
	$scope.up=edit.status;
	$scope.successshow=false;
	
	 $scope.saveComment = function () {
		
		 $scope.oredit.staffid=sessionStorage.getItem('id');
		 $scope.oredit.orderid=addresses.orderid;
		
		console.log($scope.oredit);
		  $http.post('/saveComment',{oreditvalues:$scope.oredit,orshipvalues:$scope.orship}).success(function(response){
			console.log(response);
			if(response=="1"){
				$scope.successshow=true;
				$scope.orderComments();
				$timeout(function(){
					$uibModalInstance.close();
				},5000);
				
				$rootScope.$emit("callsearchorder", {});
			}
		});
			
	};
	$scope.saveorder=function(ship,detailid){
		 $http.post('/ordersave',{shipquan:ship,orid:detailid});
			
		
	}
$scope.orderComments=function(){

	$http.post('/getorderComments',{orderid:addresses.orderid}).success(function(response){
		$scope.orComments=response;
		
	});
}
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
  $scope.orderComments();
});
	
	
