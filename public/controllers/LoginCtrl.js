app.controller('LoginCtrl', function($scope, $rootScope, $http, $location, md5) {
  // This object will be filled by the form
  $scope.msgshow1=true;

  // Register the login() function
  $scope.login = function(){
	   var userinput = $('#username');
        var passinput = $('#password');
	  if($scope.user==undefined){
		    highlight_error(userinput);
            highlight_error(passinput);
			return false;
	  }
	
	   
    $http.post('/login', {
      username: $scope.user.username,
      password: md5.createHash($scope.user.password || '')
    })
    .success(function(user){
      // No error: authentication OK
	  
	 sessionStorage.setItem('user',user.loginname);
	 sessionStorage.setItem('id',user.staffid);
	
      $rootScope.message = 'Authentication successful!';
      $location.url('/home');
    })
    .error(function(){
      // Error: authentication failed
	    highlight_error(userinput);
        highlight_error(passinput);
      $rootScope.msg = 'Sorry Wrong username/Password';
	  $scope.msgshow1=false;
	  $scope.msgshow=true;
      $location.url('/login');
    });
  };
});
function highlight_error(el) {
    if(el.val() == '') {
        el.parent().addClass('has-error');
    } else {
        el.parent().removeClass('has-error');
    }
}