app.controller('addStaffCtrl',['$scope','$http','$timeout','md5',function($scope,$http,$timeout,md5){

		$http.get('/storecodelist').success(function(data){
			$scope.values=data;
		}).error(function(err){
			console.log("err="+err);
		});
		$scope.addStaff=function(){
			
			$scope.staff.password= md5.createHash($scope.staff.password || '');
			
			$http.post('/addStaff',$scope.staff).success(function(data){
			$scope.values=data;
		}).error(function(err){
			console.log("err="+err);
		});
		}
	

}]);