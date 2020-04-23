var myService = angular.module('myService', ['ngCookies']);



myService.factory("User", ['$http', '$location', '$q', function($http, $location, $q) {
	var signIn;
	var currentUser = {};
	var user = {};
	user.checkDuplicate = function(_json) {
		return $http.post('/users/checkDuplicate', _json).then(function(resJson) {
			return $q.resolve(resJson.data);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.postUser = function(_json) {
		return $http.post('/users/signup', _json).then(function(resJson) {
			if (resJson.data.status) {
				signIn = true;
				return $q.resolve(resJson.data.res);
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.signinPost = function(_json) {
		return $http.post('/users/signin', _json).then(function(resJson) {
			if (resJson.data.status) {
				signIn = true;
				return $q.resolve(resJson.data.res);
			} else {
	    		return $q.reject(resJson.data.res);
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.logOut = function() {
		return $http.get('/users/logout').then(function() {
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.checkIfsignin = function() {
		return $http.get('/users/checkIfsignin').then(function(resJson) {
			return resJson.data.status ? $q.resolve(resJson.data.res) : $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	user.setSignin = function(value) {
		signIn = value;
	};
	user.getSignin = function() {
		return signIn;
	};
	user.setUser = function(_json) {
		currentUser = _json;
	};
	user.getUser = function() {
		return currentUser;
	};

	return user;
}]);

myService.factory("DataCheck", function() {
	var _password;
	var registInfo = {
		username: '6-18 letters, numbers or underscores, must start with English letter',
		password: '6-12 digits, upper and lower case letters, underline',
		repassword: 'Please repeat the password',
		nikiname: 'English letters, numbers or underscores',
		email: 'Please enter the commonly used email'
	};
	var signinInfo = {
		'empty':'Can not be empty',
		'username': 'User does not exist',
		'password': 'Wrong password'
	};
	var regist = {
	username: function(message) {
		if ("" === message) return "Can not be empty";
		else if (message.length < 6) return "At least 6 signs";
		else if (message.length > 18) return "No more than 18 signs";
		else if (!/^[a-z]/i.test(message)) return "Must start with an English letter";
		else if (!/^\w*$/.test(message)) return "Can only be English letters, numbers or underscores";
		else return "ok";
		},
	password: function(message) {
		if ("" === message) return "Can not be empty";
		else if (message.length < 6 || message.length > 12) return "Password has 6-12 digits";
		else if (!/^[a-z0-9_\-]*$/i.test(message)) return "The password must have numbers, uppercase and lowercase letters, underscores.";
		else {
		_password = message;
			return "ok";
			}     
		}, 
	repassword: function(message) {
		if ("" === message) return "Can not be empty";
		else return _password == message ? "ok" : "Two passwords are inconsistent";
		},
	nikiname: function(message) {
		if ("" === message) return "Can not be empty";
		else return /^\w*$/.test(message) ? "ok" : "Can only be English letters, numbers or underscores";
		},
	email: function(message) {
		if ("" === message) return "Can not be empty";
		else if (!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(message)) return "Error mailbox format";
		else return "ok";
		}
	};
	return {
		regist: regist,
		registInfo: registInfo,
		signinInfo: signinInfo
	};
});


myService.factory("Comment", ['$http', '$location', '$q', '$cookies', '$cookieStore', 'Post', function($http, $location, $q, $cookies, $cookieStore, Post) {
	var comments = [];
	var comment = {};
	comment.loadComment = function() {
		return $http.post('/comments/getComment', {id: $cookieStore.get("currentPost")._id}).then(function(resJson) {
			if (resJson.data.status) {
				comments = resJson.data.comments;
				return $q.resolve(resJson.data.comments);
			}
			else return $q.reject(resJson.data.err);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.addComment = function(dataJson) {
		return $http.post('/comments/addComment', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject(resJson.data.err);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.getComments = function() {
		return comments;
	};
	comment.setComments = function(dataJson) {
		comments = dataJson;
	};
	comment.deleteComment = function(dataJson) {
		return $http.post('/comments/deleteComment', {_id: dataJson}).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.editCommentstatus = function(dataJson) {
		return $http.post('/comments/editCommentstatus', {_id: dataJson}).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.editComment = function(dataJson) {
		return $http.post('/comments/editComment', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function() {
			return $q.reject();
		});
	};
	comment.cancel = function(dataJson) {
		return $http.post('/comments/cancel', {_id: dataJson}).then(function() {
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	comment.showComment = function(dataJson) {
		return $http.post('/comments/showComment', {_id: dataJson}).then(function(resJson) {
			return resJson.data.status ? $q.resolve() : $q.reject();
		});
	};
	comment.hideComment = function(dataJson) {
		return $http.post('/comments/hideComment', {_id: dataJson}).then(function(resJson) {
			return resJson.data.status ? $q.resolve() : $q.reject();
		});
	};	
	return comment;
}]);


app.factory("Post", ['$http', '$location', '$q', '$cookies', '$cookieStore', function($http, $location, $q, $cookies, $cookieStore) {
	var currentPost = {};
	var post = {};
	var posts = [];
	var editPost = {};
	var ifEdit = false;
	var isSearch = false;
	post.submitPost = function(dataJson) {
		return $http.post('/posts/addPost', dataJson).then(function(resJson) {
			if (resJson.data.status) return $q.resolve();
			else return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	post.loadPost = function() {
		if (isSearch) {
			var temps = [];
			if (posts.length > 7)
				temps = posts.slice(0, 7);
			else
				temps = posts;
			isSearch = false;
			return $q.resolve(temps);
		} else {
			return $http.get('/posts/getAllPost').then(function(resJson) {
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				posts = resJson.data.posts;
				if (posts.length > 7)
					temps = posts.slice(0, 7);
				else
					temps = posts;
				return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		}
	};
	post.getPostNumbers = function() {
		return posts.length;
	};
	post.getPostByClickPage = function(item) {
		var end = item * 7;
		var start = (item - 1) * 7;
		var temps = [];
		if (end > posts.length)
			temps = posts.slice(start, posts.length);
		else
			temps = posts.slice(start, end);
		return $q.resolve(temps);
	};
	post.getPostByKeyWord = function(dataJson) {
		return $http.post('/posts/getPostByKeyWord', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject(); 
			posts = resJson.data.posts;
			isSearch = true;
			return $q.resolve(posts);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.getPostByKeyWordAndAuthor = function(dataJson) {
		return $http.post('/posts/getPostByKeyWordAndAuthor', {keyWord: dataJson}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject();
			posts = resJson.data.posts;
			isSearch = true;
			return $q.resolve(posts);
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.loadPostByauthor = function() {
		if (isSearch) {
			var temps = [];
			if (posts.length > 7)
				temps = posts.slice(0, 7);
			else
				temps = posts;
			isSearch = false;
			return $q.resolve(temps);
		} else {
			return $http.get('/posts/getPostByauthor').then(function(resJson) {
				if (!resJson.data.status) return $q.reject();
				var temps = [];
				posts = resJson.data.post;
				if (posts.length > 7)
					temps = posts.slice(0, 7);
				else
					temps = posts;
				return $q.resolve(temps);
			}).catch(function(err) {
				return $q.reject(err);
			});
		}
	};
	post.deletePost = function() {
		var item = $cookieStore.get('currentPost')._id;
		return $http.post('/posts/deletePost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) 
				return $q.resolve();
			else
				return $q.reject();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	post.getPostById = function(item) {
		return $http.post('/posts/getPostById', {_id: item}).then(function(resJson) {
			if (!resJson.data.status) return $q.reject();
			currentPost = resJson.data.post;
  			$cookieStore.put('currentPost', resJson.data.post);
			return $q.resolve();
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.getPostBy_Id = function() {
		var item = $cookieStore.get('currentPost')._id;
		return $http.post('/posts/getPostContent', {_id: item}).then(function(resJson) {
			if (resJson.data.status)
				return $q.resolve(resJson.data.post.content);
			else 
				return $q.reject();
		});
	};
	post.showPost = function(item) {
		return $http.post('/posts/showPost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentPost');
				cur.isHide = false;
				$cookieStore.put('currentPost', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};
	post.hidePost = function(item) {
		return $http.post('/posts/hidePost', {_id: item}).then(function(resJson) {
			if (resJson.data.status) {
				var cur = $cookieStore.get('currentPost');
				cur.isHide = true;
				$cookieStore.put('currentPost', cur);
				return $q.resolve();
			} else {
				return $q.reject();
			}
		}).catch(function(err) {
			return $q.reject(err);
		});
	};

	return post;
}]);