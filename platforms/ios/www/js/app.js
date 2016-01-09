// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('keepup', ['ionic', 'keepup.controllers', 'keepup.services', 'keepup.factories', 'keepup.directives', 'ngCordova', 'ionic.utils'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $compileProvider) {
  
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);

  var defaultRoute = "/intro/loading";
    if (localStorage.getItem('token')) {
        console.log('wizard has been run - skip!');
        defaultRoute = '/app/courses';
    }


  $stateProvider

    .state('intro', {
        url: '/intro',
        abstract: true,
        template: '<ion-nav-view></ion-nav-view>',
        // controller: 'IntroCtrl'
    })

    .state('intro.loading', {
      url: '/loading',
      templateUrl: 'templates/loading.html',
      controller: 'OnboardLoadingCtrl'
    })

    .state('intro.onboard', {
      url: '/onboard',
      templateUrl: 'templates/onboard.html',
      controller: 'IntroCtrl'
    })

    .state('intro.camera', {
      cache: false,
      url: '/camera',        
      templateUrl: 'templates/camera.html',
      controller: 'CameraCtrl'
    })


    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
    })


  .state('app.clear', {
    url: '/clear',
    views: {
      'menuContent': {
        templateUrl: 'templates/clear.html',
        controller: 'ClearCtrl',
      }
    },
  })

  .state('app.edit', {
    url: '/edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/edit.html',
        controller: 'EditClassesCtrl',
        resolve: {
          courses: function() {
            return [
  { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' }
];
          },

          courses: function(Schedule) {
            return Schedule.getDay(0).then(function(response){
              return response.data.schedule
            })
          }

        
        }
      }
    }
  })

    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

    .state('app.courses', {
      url: '/courses',
      views: {
        'menuContent': {
          templateUrl: 'templates/courses.html',
          controller: 'CoursesCtrl'
        }
      }
    })

    .state('app.courses.day', {
      url: '/:day',
      views: {
        'courseDay': {
          templateUrl: 'templates/courseday.html',
          controller: 'CourseDayCtrl',
          resolve: {
            courses: function($stateParams, Schedule) {
              return Schedule.getDay($stateParams.day).then(function(response){
                return response.data.schedule
              })
            }
  //           courses: function() {
  //             return [
  //   { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  //   { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  //   { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  //   { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' },
  //   { department: 'BADM', course_number: '51271', name: 'Undergraduate Open Seminar', room: '243', building: 'Wohlers Hall', start_time: '50400' }
  // ];
  //           }
          }
        }
      }
      
    })


  // .state('app.single', {
  //   url: '/courses/:courseId',
  //   views: {
  //     'menuContent': {
  //       templateUrl: 'templates/course.html',
  //       controller: 'CourseCtrl'
  //     }
  //   }
  // });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise(defaultRoute);
});
