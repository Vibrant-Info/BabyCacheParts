
app.controller('problemTypeCtrl', function($scope, $http) {
		$http.get('/getPblm').success(function(response){
			console.log(response);
		});
 
});