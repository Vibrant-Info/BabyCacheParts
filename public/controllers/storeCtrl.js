app.controller('storeCtrl',['$scope','$http','$timeout',function($scope,$http,$timeout){
	$scope.successmsgshow=false;
	$scope.addStore=function(){
		console.log($scope.store);
		$http.post('/addstore',$scope.store).success(function(data){
			console.log(data);
			$scope.successmsgshow=true;
			 $timeout(function() {
					   $scope.successmsgshow=false;
					   $scope.store="";
					}, 3000);
		}).error(function(err){
			console.log("Error="+err);
		});
	}
}]);
 /* INSERT INTO store (storeid, address, archived, city, code, country, emailid, enabled, fax, lastmodified, name, phone, state, zipcode) VALUES (509, '20111 Route 19', false, ' Cranberry Township', '26478', 'US', NULL, true, '724-772-2563', '2012-09-21 00:00:00', 'Cranberry', '724-772-2500', 'PA', '16066') */