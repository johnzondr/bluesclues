angular.module('keepup.factories', ['ionic', 'ngResource'])

.factory('Schedule', function($http, $localstorage) {
  return  {
  	getDay: function(day) {
  		console.log('attemping to get schedule for ' + day)
	    token = $localstorage.get('token');
	    return $http({
	    	method: 'GET',
	    	url: 'https://keep-backend.herokuapp.com/schedules',
	    	headers: {'Accept': 'application/vnd.keepup.v1'},
	    	params: {token: token, day: day }
	    	})
  	},
  	remove: function(course) {

  		console.log('attemping to unenroll user from course ' + course.name)
	    token = $localstorage.get('token');
	    return $http({
	    	method: 'DELETE',
	    	url: 'https://keep-backend.herokuapp.com/schedules/'+course.id,
	    	headers: {'Accept': 'application/vnd.keepup.v1'},
	    	params: {token: token}
	    	})
  	} 
  };
})


.factory('RegisterUser', function($http) {
	return {

		getToken: function(uuid){
			console.log('attemping to register user')
			var req = {
			       method: 'POST',
			       url: 'https://keep-backend.herokuapp.com/users?uuid='+uuid,
			       headers: {
			         'Accept': 'application/vnd.keepup.v1'
			       },
			      }
		    return $http(req)
		}
	};
})

.factory('Ocr', function($q, $http, $cordovaCamera, $cordovaFileTransfer, $localstorage){
	return {
		takePicture: function(){

			var q = $q.defer();

	        var options = { 
	            quality : 50, 
	            encodingType: 1,
	            targetWidth: 800,
	            targetHeight: 500,
	            saveToPhotoAlbum: true
	        };

	        $cordovaCamera.getPicture(options).then(function(imageURI) {
	             q.resolve(imageURI);
	        }, function(err){
	        	q.reject(err)
	        });

	        return q.promise
		},
		postOcr: function(ImageUri){

			var q = $q.defer();

			var url = "https://cloud.ocrsdk.com/processImage?exportFormat=txt";
		    var options = {
		         fileKey: "file",
		         chunkedMode: false,
		         headers: {
		          'Content-Type': undefined,
		          'Authorization': 'Basic S2VlcCBVcCBBcHA6R293MVVLcW1XL0FNSXRkZ0Q0SWhHMTVJIA=='
		          },
		     };


		     $cordovaFileTransfer.upload(url, ImageUri, options).then(function (result) {
		    	var x2js = new X2JS();
		    	console.log(X2JS);
		    	taskId = x2js.xml_str2json(result.response).response.task._id;
      			// var taskId = x2js.xml_str2json(result).response.task._id;
		         q.resolve(taskId);
		     }, function (err) {
		         q.reject(err);
		     }, function (progress) {
		         // PROGRESS HANDLING GOES HERE
		     });

		     return q.promise

		},

		parseTask: function(taskId){
			var q = $q.defer()

			var token = $localstorage.get('token')

			var req = {
				method: 'POST',
				url: 'https://keep-backend.herokuapp.com/ocr?token='+token+'&task_id='+taskId,
				headers: {
				 'Accept': 'application/vnd.keepup.v1'
				}
			}

			$http(req)
			.then(function(response){
			q.resolve(response.data);
			// alert(response.data.courses);
			
			}, function(data){
			q.reject(data)
			
			});


			return q.promise
		}

	}
})

;