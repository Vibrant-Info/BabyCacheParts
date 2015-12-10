app.controller('navCtrl',['$scope','$location',function($scope,$location){
	$scope.uname= sessionStorage.getItem('user'); 
		$scope.isActive=function(destination){
			return destination===$location.path()
	}

}]);