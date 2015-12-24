app.controller('orderpartsCtrl', function($scope,$http,$timeout,$uibModal,$rootScope) {
	$scope.tab1=false;
	$scope.tab2=true;
	$scope.tab3=true;
	$scope.tab4=true;
	
	$scope.skus = true;
	$scope.Part = true;
	$scope.PartDes = true;
	$scope.Des = true;
	$scope.ProdDate = true;
	$scope.FacCode = true;
	$scope.PurDate = true;
	$scope.qty = true;
	$scope.typeS = true;
	
	$scope.tabSec1=true;
	$scope.tab1Sec = "tab-active";
	$scope.tab2Sec = "tab-inactive";
	$scope.tab3Sec = "tab-inactive";
	$scope.tab4Sec = "tab-inactive";
	
	$scope.collectionsdisable=false;
	$scope.skndisable=false;
	$scope.showvalues=false;
	$scope.valuesnull=false;
	$scope.cartshow=false;
	$scope.tab1active=true;
	$scope.values=[];
	$scope.orders=[];
	$scope.viewcart=[];
	
	$scope.orparts=[];
	$scope.order={};
	$scope.or={};
	$scope.myproduct = {};
	
  $scope.factorycodes = [{code:'02'},{code:'03'},{code:'04'},{code:'05'},{code:'06'},{code:'07'},{code:'08'},{code:'09'},{code:'M1'},{code:'M2'},{code:'T1'},{code:'V1'}];

				
  $scope.getProductsknLoad=function(){
	$http.get('/getProductskn').success(function(response){
		$scope.productskn = response;
	});
}
	$scope.getstyle=function(){
		$http.get('/getstyle').success(function(response){
			$scope.styles = response;
		});
	}
	$scope.getprtype=function(){
		$http.get('/getprtype').success(function(response){
			$scope.pr_type = response;
		});
	}
	$scope.getColor=function(){
		$http.get('/getColor').success(function(response){
			$scope.colors = response;
		});
	}
	$scope.getProblemTypes=function(){
		$http.get('/getProblemTypes').success(function(response){
			$scope.prblmtype = response;
		
		});
	}
	$scope.getStore=function(){
		$http.get('/getStore').success(function(response){
			$scope.stores = response;
		
		});
		
	}

	$scope.address;
	$scope.city;
	$scope.country;
	$scope.state;
	$scope.zipcode;
	$scope.getStoreValues=function(storeid){
		$http.post('/storeDetails',{storeid:storeid}).success(function(response){
			$scope.address=response[0].address;
			$scope.city=response[0].city;
			$scope.country=response[0].country;
			$scope.state=response[0].state;
			$scope.zipcode=response[0].zipcode;
			$scope.ship.address=$scope.address;
			$scope.ship.city=$scope.city;
			$scope.ship.country=$scope.country;
			$scope.ship.state=$scope.state;
			$scope.ship.zipcode=$scope.zipcode;
	
		});
	}
	$scope.addressValue=function(value){
		if( value=='store'){
			$scope.ship.address=$scope.address;
			$scope.ship.city=$scope.city;
			$scope.ship.country=$scope.country;
			$scope.ship.state=$scope.state;
			$scope.ship.zipcode=$scope.zipcode;
			
		}
		if( value=='store_guest'){
			$scope.ship.address=$scope.address;
			$scope.ship.city=$scope.city;
			$scope.ship.country=$scope.country;
			$scope.ship.state=$scope.state;
			$scope.ship.zipcode=$scope.zipcode;
			
		}
		if( value=='guest'){
			$scope.ship.address="";
			$scope.ship.city="";
			$scope.ship.country="";
			$scope.ship.state="";
			$scope.ship.zipcode="";
			
		}
	}
	
	$scope.collectionDisable=function(){
			$scope.collectionsdisable=true;
	}
	$scope.sknDisable=function(){
			$scope.skndisable=true;
	}
	
	
	//getting order items
	$scope.searchItem=function(){
		if($scope.myproduct == undefined ||  Object.keys($scope.myproduct).length==0 ){
			$scope.errmsgshow=true;
			$timeout(function(){
				$scope.errmsgshow=false;
			},3000);
		}
		var productvalues=$scope.myproduct;
		for (var i in productvalues) 
		{ 
			if (productvalues[i] === '' || productvalues[i] == undefined ) { 
			 delete productvalues[i]; 
			}
		}
		$http.post('/searchOrderItem',productvalues).success(function(response){
			
			if(response=="0"){
				$scope.showvalues=false;
				$scope.valuesnull=true;
			}
			else{
				$scope.valuesnull=false;
				$scope.showvalues=true;
				$scope.values=[];
				for(var i=0;i<response.length;i++){
					$scope.values.push(response[i][0]);
				}
					
			}
		}).error(function(err){
			$scope.showvalues=false;
			$scope.valuesnull=true;
		});
	
	}
	//cart functions
	$scope.addCart=function(){
		$scope.cartshow=true;
		$scope.order=$scope.orders;
	}
	$scope.getOrders= function(part){
	  $scope.orders.push(part);
	}
	
	
  
  $scope.nextCart=function(tab){
	  
	
	  if(tab=='tab2'){
		 $scope.tabSec2=true;
		 $scope.tabSec1=false;
		$scope.tab1Sec = "tab-inactive";
		$scope.tab2Sec = "tab-active";
		$scope.tab3Sec = "tab-inactive";
		$scope.tab4Sec = "tab-inactive";
		  var sl=Object.keys($scope.orders).length;
		  for(var i=0;i<sl;i++){
			  var j=i+1;
			  $scope.orders[i].factorycode=$scope.orders[i].factory[j].code;
			  $scope.orders[i].ponum=$scope.orders[i].ponumber[j];
			  $scope.orders[i].productdate=$scope.orders[i].prdate[j];
			  $scope.orders[i].purchasedate=$scope.orders[i].prsdate[j];
		  }
		  $scope.orparts=$scope.orders;
		  $scope.tab2=false;
		  $scope.tab1=true;
	  } 
	  if(tab == 'tab3'){
			$scope.tabSec3=true;
			$scope.tabSec2=false;
			$scope.tabSec1=false;
			$scope.tab1Sec = "tab-inactive";
			$scope.tab2Sec = "tab-inactive";
			$scope.tab3Sec = "tab-active";
			$scope.tab4Sec = "tab-inactive";
		 var sl=Object.keys($scope.orparts).length;
		  for(var i=0;i<sl;i++){
			  var j=i+1;
			  $scope.orparts[i].add_info=$scope.orparts[i].add_info[j];
			  $scope.orparts[i].quantity=$scope.orparts[i].quantity[j];
			  $scope.orparts[i].prblmname=$scope.orparts[i].prblmtype[j].prblmname;
			  $scope.orparts[i].problemtypeid=$scope.orparts[i].prblmtype[j].problemtypeid;
		  }
		  $scope.viewcart=$scope.orparts;
		
		  $scope.tab3=false;
		  $scope.tab2=true;
	  }
  }
  $scope.previousCart=function(tab){
	  if(tab=='tab1'){
		$scope.tabSec4=false;
		$scope.tabSec3=false;
		$scope.tabSec2=false;
		$scope.tabSec1=true;
		$scope.tab1Sec = "tab-active";
		$scope.tab2Sec = "tab-inactive";
		$scope.tab3Sec = "tab-inactive";
		$scope.tab4Sec = "tab-inactive";
	  }
	   if(tab=='tab2'){
		$scope.tabSec4=false;
		$scope.tabSec3=false;
		$scope.tabSec2=true;
		$scope.tabSec1=false;
		$scope.tab1Sec = "tab-inactive";
		$scope.tab2Sec = "tab-active";
		$scope.tab3Sec = "tab-inactive";
		$scope.tab4Sec = "tab-inactive";
	  }
	   if(tab=='tab3'){
		$scope.tabSec4=false;
		$scope.tabSec3=true;
		$scope.tabSec2=false;
		$scope.tabSec1=false;
		$scope.tab1Sec = "tab-inactive";
		$scope.tab2Sec = "tab-inactive";
		$scope.tab3Sec = "tab-active";
		$scope.tab4Sec = "tab-inactive";
	  }
  }
  $scope.cancelCart=function(){
	  	$scope.cartshow=false;
		$scope.tabSec4=false;
		$scope.tabSec3=false;
		$scope.tabSec2=false;
		$scope.tabSec1=true;
		$scope.tab1Sec = "tab-active";
		$scope.tab2Sec = "tab-inactive";
		$scope.tab3Sec = "tab-inactive";
		$scope.tab4Sec = "tab-inactive";
	  	$scope.orparts=[];
		$scope.orders=[];
		$scope.order=[];
  }
	//for calender function
 $scope.open1 = function($event) {
    $scope.status1.opened1 = true;
  };
  $scope.open2 = function($event) {
    $scope.status2.opened2 = true;
  };
  $scope.status1 = {
    opened1: false
  };
  $scope.status2 = {
    opened2: false
  };

  $scope.format='dd-MMMM-yyyy';
	$scope.resetAll=function(){
		 
		$scope.myproduct={};
		$scope.collectionsdisable=false;
		$scope.skndisable=false;
		$scope.cartshow=false;
		$scope.values={};
		$scope.orparts=[];
		$scope.orders=[];
		$scope.order=[];
	}
	
	$scope.confirmOrder = function(){
	
		$scope.ship.staffid=sessionStorage.getItem('id');
		
		 console.log($scope.viewcart[0].productiondate);
		
		 if($scope.ship.guestemail == undefined){
			 $scope.ship.guestemail="''";
		 } 
		 if($scope.ship.guestfax == undefined){
			 $scope.ship.guestfax="''";
		 } 
		 if($scope.ship.guestfname == undefined){
			 $scope.ship.guestfname="''";
		 }
		 if($scope.ship.guestphone == undefined){
			 $scope.ship.guestphone="''";
		 }
		
		$http.post('/postOrder',{address:$scope.ship,carts:$scope.viewcart}).success(function(response){
			console.log(response);
		});
		$scope.tabSec4=true;
		$scope.tabSec3=false;
		$scope.tabSec2=false;
		$scope.tabSec1=false;
		$scope.tab1Sec = "tab-inactive";
		$scope.tab2Sec = "tab-inactive";
		$scope.tab3Sec = "tab-inactive";
		$scope.tab4Sec = "tab-active";
	}
	$scope.getProductsknLoad();
	$scope.getColor();
	$scope.getprtype();
	$scope.getstyle();
	$scope.getProblemTypes();
	$scope.getStore();

});
