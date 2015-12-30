app.controller('navCtrl',['$scope','$location','$rootScope','userservice',function($scope,$location,$rootScope,userservice){
	$scope.uname= sessionStorage.getItem('user'); 
	//$scope.uname= $rootScope.uname;
	$scope.uid=sessionStorage.getItem('id');
		$scope.isActive=function(destination){
			return destination===$location.path()
	}
		$scope.isOpen=function(destination1,d2){
			if(destination1==$location.path() || d2 == $location.path())
			return true;
	}

}]);