angular.module('keepup.factories', ['ionic', 'ngResource'])

.factory('Schedule', function($resource) {
  return $resource('https://keep-backend.herokuapp.com/schedules', {user_id: 1, day: 'm'});
})