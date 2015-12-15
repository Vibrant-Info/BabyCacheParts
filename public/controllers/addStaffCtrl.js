app.controller('addStaffCtrl',['$scope','$http','$timeout','md5',function($scope,$http,$timeout,md5){

		$http.get('/storecodelist').success(function(data){
			$scope.values=data;
		}).error(function(err){
			console.log("err="+err);
		});
		$scope.addStaff=function(){
			
			$scope.staff.password= md5.createHash($scope.staff.password || '');
			if($scope.staff.emailid==undefined){
				$scope.staff.emailid="";
			}
			if($scope.staff.initial==undefined){
				$scope.staff.initial="";
			}
			$http.post('/addStaff',$scope.staff).success(function(data){
				
			if(data=="0"){
				$scope.errmsgshow=true;
				$scope.errmsg="Username already exist";
				$scope.staff.loginname=" ";
				$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
			}
			if(data=="1"){
				$scope.errmsgshow=false;
				$scope.successmsgshow=true;
				$scope.successmsg="Staff Inserted successfully";
				$timeout(function(){
				$scope.successmsgshow=false;
				$scope.staff="";
			},3000);
			}
		}).error(function(err){
			console.log("err="+err);
		});
		}
	

}]);