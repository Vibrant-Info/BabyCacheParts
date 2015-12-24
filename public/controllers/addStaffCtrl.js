app.controller('addStaffCtrl',['$scope','$http','$timeout','md5',function($scope,$http,$timeout,md5){

		$http.get('/storecodelist').success(function(data){
			$scope.values=data;
		}).error(function(err){
			console.log("err="+err);
		});
		$scope.addStaff=function(){
			
			$scope.staff.password= md5.createHash($scope.staff.password || '');
			
			$http.post('/addStaff',$scope.staff).success(function(data){
				if(data=="1"){
					$scope.successmsgshow=true;
					$timeout(function(){
						$scope.successmsgshow=false;
					},3000);
				}
				if(data=="0"){
					$scope.logmsgshow=true;
					$timeout(function(){
						$scope.logmsgshow=false;
					},3000);
				}
				
				
			}).error(function(err){
				$scope.errmsgshow=true;
				$timeout(function(){
					$scope.errmsgshow=false;
				},3000);
				
			});
		}
	

}]);