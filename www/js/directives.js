
angular.module('keepup.directives', [])

.directive('scheduleItem', function() {
  return {
    restrict: 'E',
    // template: "hello",
    templateUrl: function() {
      if (ionic.Platform.isAndroid()) {
          return  "templates/directives/schedule-item-android.html";
      }
      return "templates/directives/schedule-item.html";
    },
    scope: {course: '='},
    replace: true
  }
})

.directive('classEditItem', function() {
  return {
    restrict: 'E',
    transclude: 'true',
    // template: "hello",
    templateUrl: 'templates/directives/class-edit-item.html',
    scope: {
      course: '=',
      removeCourse: '&',
      update: '&'
    },
    replace: true
  }
})
;