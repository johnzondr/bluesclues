angular.module('keepup.factories', ['ionic', 'ngResource'])

.factory('Schedule', function($resource) {
  return $resource('https://keep-backend.herokuapp.com/schedules', {user_id: 1, day: 'm'});
})

.factory('RegisterUser', function($http) {
	return {
		speak: function() {
			return "hi"
		},

		getToken: function(uuid){
			var req = {
			       method: 'POST',
			       url: 'https://keep-backend.herokuapp.com/users',
			       headers: {
			         'Accept': 'application/vnd.keepup.v1'
			       },
			      }
		    return $http(req)
		}
	};
})

;