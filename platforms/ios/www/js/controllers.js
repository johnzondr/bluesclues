angular.module('keepup.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading) {
  
  $scope.progress = "progress"
  $scope.show = function() {
    $ionicLoading.show({
      template: '<div>Installing... </div><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };


})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $localstorage, $ionicLoading, Update) {

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


  // kick off the platform web client
  Ionic.io();

  // this will give you a fresh user or the previously saved 'current user'
  var user = Ionic.User.current();

  // if the user doesn't have an id, you'll need to give it one.
  if (!user.id) {
  
    // attempt to get token
    token = $localstorage.get('token');
  
    if(typeof token !== undefined) {
      user.id = token;
    } else{
      user.id = Ionic.User.anonymousId();
    }

    console.log('user id ' + user.id);  
  }

  //persist the user
  user.save();

  var deploy = new Ionic.Deploy();
  deploy.setChannel("production");

   var showConfirm = function() {
    return Update.confirm().then( function() {
      $scope.doUpdate();
    })
   }

  
  
  // Update app code with new release from Ionic Deploy
  $scope.doUpdate = function() {
    $scope.progress = "progress"
    $ionicLoading.show({
      template: '<div>{{progress}} Installing... </div><ion-spinner></ion-spinner>'
    });
    deploy.update().then(function(res) {
      $ionicLoading.hide();
      console.log('Ionic Deploy: Update Success! ', res);
    }, function(err) {
      $ionicLoading.hide();
      console.log('Ionic Deploy: Update error! ', err);
    }, function(prog) {
      console.log('Ionic Deploy: Progress... ', prog);
    });
  };

  // Check Ionic Deploy for new code
  var checkForUpdates = function() {
    console.log('Ionic Deploy: Checking for updates');
    deploy.check().then(function(hasUpdate) {
      console.log('Ionic Deploy: Update available: ' + hasUpdate);
      if (hasUpdate) {
        showConfirm();
      };

    }, function(err) {
      console.error('Ionic Deploy: Unable to check for updates', err);
    });
  }

  checkForUpdates();
  
})

.controller('CoursesCtrl', function($scope, $http, $localstorage, $state) {

  // $cordovaGoogleAnalytics.setUserId($localstorage.get('token'));
  // $cordovaGoogleAnalytics.startTrackerWithId('UA-72218613-1');
  // $cordovaGoogleAnalytics.trackView('Home Screen');
  // if(typeof analytics !== undefined) { analytics.trackView("Home View"); }

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


.controller('CourseDayCtrl', function($scope, $stateParams, $cordovaInAppBrowser, courses, $ionicPopup, $ionicLoading) {
  $scope.day = $stateParams.day
  console.log(courses)
  $scope.courses = courses

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var cycle = "AM"

    if (hours > 12) {cycle = "PM"; hours = hours - 12}

    // if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    
    var time    = hours+':'+minutes + ' ' + cycle;
    return time;
  }

  $scope.directions = function(location){
    cordova.InAppBrowser.open("http://maps.apple.com/?saddr=Current%20Location&daddr=Everitt Elec & Comp Engr Lab, 61820", '_blank', 'location=yes');
  }   


})

.controller('CourseCtrl', function($scope, $stateParams) {
})

.controller('EditClassesCtrl', function($scope, courses, Schedule, $localstorage, Ocr, $timeout, $ionicModal) {

  $scope.courses = courses;
  $scope.working = "Looks like you're enrolled in the following:";

  var token = $localstorage.get('token');

  $scope.removeCourse = function(course) {
    Schedule.remove(course);
    $scope.courses.splice($scope.courses.indexOf(course),1);
  };

  $scope.takePicture = function () {
    return Ocr
      .takePicture()
      .then( function(ImageUri) {
        $scope.working = "Uploading your picture to our servers..."
        return Ocr.postOcr(ImageUri)
      })
      .then( function(taskId) {
        $scope.working = "Analyzing the image..."
        console.log('task id ' +taskId);
        return Ocr.parseTask(taskId)
      })
      .then ( function(response){
        $scope.working = "Success!";
        console.log(response.courses);
        $scope.courses = response.courses;
        $timeout(function(){
          $scope.working = "Looks like you're enrolled in the following:"
        }, 2500);
      });

  }

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var cycle = "AM"

    if (hours > 12) {cycle = "PM"; hours = hours - 12}

    // if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    
    var time    = hours+':'+minutes + ' ' + cycle;
    return time;
  }

  // Form data for the login modal
  $scope.searchTerms = "hello what";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/search-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeSearch = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.openSearch = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doSearch = function() {
    var searchArray = $scope.searchTerms.split(" ");
    console.log('Searching terms', searchArray);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
  };

  // var search = function() {
  //   $http.
    
  // }

  // $http({
  //   method:'GET',
  //   url: ' ',
  //   params: {'product_ids[]': productIds}  
  // )

  
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

.controller('OnboardLoadingCtrl', function($timeout, $state) {
$timeout($state.go('intro.onboard'), 2000);
})

.controller('IntroCtrl', function($scope, $cordovaInAppBrowser, $window) {
  console.log('triggering onboard controller');
  $scope.prototypeLink = function()
    {
     // Open in external browser
     window.open('https://www.flinto.com/p/6fc91ba2','_system'); 
    };

  
  $scope.wheight = $window.innerHeight;

})



.controller('CameraCtrl', function($scope, $cordovaFileTransfer, $http, $localstorage, Ocr, $cordovaDevice, RegisterUser, $timeout, $state) {

  var token = $localstorage.get('token');
  console.log('token  ' +token);


  takePicture = function () {
    return Ocr
      .takePicture()
      .then( function(ImageUri) {
        $scope.working = "uploading"
        return Ocr.postOcr(ImageUri)
      })
      .then( function(taskId) {
        $scope.working = "analyzing"
        console.log('task id ' +taskId);
        return Ocr.parseTask(taskId)
      })
      .then ( function(response){
        $scope.working = "success";
        $timeout(function(){
          return $state.go('app.courses')
        }, 2500);
      });

  }

  takePicture();

    // register user and get user token
  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
    console.log('triggering event device ready');
  // Now safe to use device APIs  
    $scope.uuid = $cordovaDevice.getUUID();
    console.log('uuid is ' + $scope.uuid);

    var saveToken = function (response) {
      console.log('getting success callback for user token!');
      console.log(response);
      $localstorage.set('token', response.data.token)
    }

    RegisterUser.getToken($scope.uuid).then(saveToken);
    
  };


})
;
