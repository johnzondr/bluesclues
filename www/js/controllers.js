angular.module('keepup.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('CoursesCtrl', function($scope, $http, $localstorage, $state) {

  $scope.$on('$ionicView.afterEnter', function(object, info) {

    switch (new Date().getDay()) {
        case 2:
            $state.go('app.courses.day', {'day':2})
            break;
        case 3:
            $state.go('app.courses.day', {'day':3})
            break;
        case 4:
            $state.go('app.courses.day', {'day':4})
            break;
        case 5:
            $state.go('app.courses.day', {'day':5})
            break;
        default:
            $state.go('app.courses.day', {'day':1});
    }
  });


  //update button bars with correct state
  $scope.$watch(function(){
    return $state.params;
  }, function(params){
    $scope.day = params.day;
  });


  // $scope.courses = [
  //   { title: 'Accounting 201', id: 1 },
  //   { title: 'Business 101', id: 2 },
  //   { title: 'Engineering 185', id: 3 },
  //   { title: 'Art 300', id: 4 },
  //   { title: 'History 125', id: 5 },
  // ];
})


.controller('CourseDayCtrl', function($scope, $stateParams, $cordovaInAppBrowser, courses) {
  $scope.day = $stateParams.day
  console.log(courses)
  $scope.courses = courses

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes;
    return time;
  }

  $scope.directions = function(location){
    cordova.InAppBrowser.open("http://maps.apple.com/?saddr=Current%20Location&daddr=Everitt Elec & Comp Engr Lab, 61820", '_blank', 'location=yes');
  }


})

.controller('CourseCtrl', function($scope, $stateParams) {
})

.controller('ClearCtrl', function($scope, $http, $localstorage) {


//   $scope.clear = $http({
//   method: 'DELETE',
//   url: 'https://keep-backend.herokuapp.com/ocr?user_id='+userId
// }).then(function successCallback(response) {
//   alert('schedule cleared');
//     // this callback will be called asynchronously
//     // when the response is available
//   }, function errorCallback(response) {
//     alert('something went wrong');
//     // called asynchronously if an error occurs
//     // or server returns response with an error status.
//   });



})


.controller('IntroCtrl', function($scope, $cordovaInAppBrowser) {
  console.log('triggering onboard controller');
  $scope.prototypeLink = function()
    {
     // Open in external browser
     window.open('https://www.flinto.com/p/6fc91ba2','_system'); 
    };

})

.controller('CameraCtrl', function($scope, $cordovaFileTransfer, $http, $localstorage, Ocr, $cordovaDevice, RegisterUser) {

  var token = $localstorage.get('token');
  console.log('token  ' +token);

  $scope.takePicture = function () {
    return Ocr
      .takePicture()
      .then( function(ImageUri) {
        $scope.working = "uploading image"
        return Ocr.postOcr(ImageUri)
      })
      .then( function(taskId) {
        $scope.working = "analyzing image"
        console.log('task id ' +taskId);
        return Ocr.parseTask(taskId)
      })
      .then ( function(response){
        $scope.working = false;
        alert(response);
      });

  }

    //register user and get user token
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    console.log('triggering event device ready');
  // Now safe to use device APIs  
    $scope.uuid = $cordovaDevice.getUUID();
    console.log($scope.uuid);

    var saveToken = function (response) {
      console.log('getting success callback for user token!');
      console.log(response);
      $localstorage.set('token', response.data.token)
    }

    RegisterUser.getToken($scope.uuid).then(saveToken);
    
  };


})
;
