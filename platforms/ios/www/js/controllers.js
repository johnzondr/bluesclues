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

.controller('CoursesCtrl', function($scope, $http, $localstorage) {
  var userId = $localstorage.get('userId');
  console.log(userId);

  var d = new Date();
  $scope.n = d.getDay();

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

  $scope.getSchedule = function(day) {
    
      $http({
      method: 'GET',
      url: 'https://keep-backend.herokuapp.com/schedules',
      headers: {'Accept': 'application/vnd.keepup.v1'},
      params: {user_id: userId, day: day }
      }).then(function(response){
        $scope.courses = response.data.schedule;
        console.log($scope.courses)
      }), function(response){
        console.log(response);
      }
      ;
  }

  $scope.getSchedule($scope.n);

  // $scope.courses = [
  //   { title: 'Accounting 201', id: 1 },
  //   { title: 'Business 101', id: 2 },
  //   { title: 'Engineering 185', id: 3 },
  //   { title: 'Art 300', id: 4 },
  //   { title: 'History 125', id: 5 },
  // ];
})

.controller('CourseCtrl', function($scope, $stateParams) {
})

.controller('ClearCtrl', function($scope, $http, $localstorage) {
  userId = $localstorage.get('userId')
  $scope.clear = $http({
  method: 'DELETE',
  url: 'https://keep-backend.herokuapp.com/ocr?user_id='+userId
}).then(function successCallback(response) {
  alert('schedule cleared');
    // this callback will be called asynchronously
    // when the response is available
  }, function errorCallback(response) {
    alert('something went wrong');
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });



})


.controller('IntroCtrl', function($scope, $cordovaInAppBrowser, $localstorage, $http) {
  $scope.prototypeLink = function()
    {
     // Open in external browser
     window.open('https://www.flinto.com/p/6fc91ba2','_system'); 
    };

    var getUserId = function() {
      console.log('starting registering')
      var req = {
       method: 'POST',
       url: 'https://keep-backend.herokuapp.com/users',
       headers: {
         'Accept': 'application/vnd.keepup.v1'
       },
      }
      
      $http(req)
        .then(function(response){
        $localstorage.set('userId', response.data.user.id);
        console.log($localstorage.get('userId'));
        }, function(data){
        alert('something went wrong: ' + data);
      });

    };
    $scope.$on('$ionicView.afterEnter', function(object, info) {
      if (! localStorage.getItem('userId') && info.title == "Onboard") {
        getUserId();
      }
    });
})

.controller('CameraCtrl', function($scope, $cordovaCamera, $cordovaFileTransfer, $http, $localstorage) {

    $scope.send = function(taskId) {
      userId = $localstorage.get('userId')
      console.log(taskId)
      $scope.working = 'analyzing'
      var req = {
       method: 'POST',
       url: 'https://keep-backend.herokuapp.com/ocr?user_id='+userId+'&task_id='+taskId,
       headers: {
         'Accept': 'application/vnd.keepup.v1'
       },
      }
      
      $http(req)
        .then(function(response){
          // course list
        console.log(response.data);
        alert(response.data.courses);
        $scope.working = false;
      }, function(data){
        alert('something went wrong: ' + data);
        $scope.working = false;
      });
    };
  
  $scope.working = false;
  
  $scope.postOcr = function() {
    console.log('posting to ocr')
    $scope.working = 'uploading image';
    console.log($scope.working);
    
    // Destination URL 
    var url = "https://cloud.ocrsdk.com/processImage?exportFormat=txt";
     
    //File for Upload
    // var targetPath = "/img/camera.JPG"
     
    // File name only
    // var filename = targetPath.split("/").pop();
     
    var options = {
         fileKey: "file",
         chunkedMode: false,
         headers: {
          'Content-Type': undefined,
          'Authorization': 'Basic S2VlcCBVcCBBcHA6R293MVVLcW1XL0FNSXRkZ0Q0SWhHMTVJIA=='
          },
     };

     var parse_task = function(result) {
      var x2js = new X2JS();
      var task_id = x2js.xml_str2json(result).response.task._id;
      return task_id;
     };
          
     $cordovaFileTransfer.upload(url, $scope.lastPhoto, options).then(function (result) {
         // var xmlDoc = result.response;
         task_id = parse_task(result.response);
         $scope.send(task_id);
     }, function (err) {
         console.log("ERROR: " + JSON.stringify(err));
     }, function (progress) {
         // PROGRESS HANDLING GOES HERE
     });
  };
  // 





  $scope.takePicture = function() {

        var options = { 
            quality : 50, 
            encodingType: 1,
            targetWidth: 800,
            targetHeight: 500,
            saveToPhotoAlbum: true
        };

        $cordovaCamera.getPicture(options).then(function(imageData) {
            $scope.lastPhoto = imageData;
            $scope.postOcr();
        }, function(err) {
            // An error occured. Show a message to the user
        });
    }



})
;
