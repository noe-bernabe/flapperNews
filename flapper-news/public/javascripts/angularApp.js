// since we add an eternal module (ui-router library) we have to include
// it as a dependency in our app
var app = angular.module('flapperNews', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {

		$stateProvider
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'mainController'
			});

		$stateProvider
			.state('posts', {
				url: '/posts/{id}', 
				templateUrl: '/posts.html',
				controller: 'postsController'
			});

		$urlRouterProvider.otherwise('home');
	}
]);

//we've been storing data in the controller and this has disadvantages
//instead we can create a service and refactor the $scope.posts variable
//we use factory instead of service but they're both really just 'provider'
app.factory('posts', [function(){

	//by exporting the variable instead of the posts array we can later 
	//add fucntions and whatnot to this
	var o = {
		posts: []
	};
	return o;
}]);

app.controller('mainController', [

	//define $scope this serves as a bridge between Angular
	//controllers and Angular templates
	'$scope', 

	//we want to inject the service(factory) we created into
	//the controller. simply add the service as a parameter
	'posts',

	//this is a function in the main controller
	function($scope, posts){

		//bind test to $scope, I think
		$scope.test = 'Hello World!';

		$scope.posts = posts.posts;

		//bind posts to $scope, I think, again 
		//here we also add information about the posts such 
		//as the title and number of upvotes
		// $scope.posts = [
		// 	{title: 'post 1', upvotes: 5},
		// 	{title: 'post 2', upvotes: 2}, 
		// 	{title: 'post 3', upvotes: 15}, 
		// 	{title: 'post 4', upvotes: 9}, 
		// 	{title: 'post 5', upvotes: 4}
		// ] REPLACED BY THE FACTORY ABOVE!

		//we can also bind functions to $scope this function
		//will allow us to add posts to $scope.posts
		$scope.addPost = function(){

			//we want to prevent users from submitting a blank
			//title 
			if(!$scope.title || $scope.title == '') { return; }

			//we use the input which is bound to $scope.title 
			//as the title and the link bound to $scope.link 
			//as the link
			$scope.posts.push({
				title: $scope.title, 
				link: $scope.link,
				upvotes: 0,
				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 0},
					{author: 'Zlatan', body: 'I am Zlatan. I am the best.', upvotes: 2}
				]
			});

			//we need to remember to reset the title after 
			//it is set also the link
			$scope.title = '';
			$scope.link = ''
		};

		//we will bind a function here to be able to increment
		//the number of upvotes (maybe we should add a downvote?)
		$scope.incrementUpvotes = function(post) {

			//we pass the current instance of post to this function
			//by reference so the change is reflected automatically
			//back to the HTML page
			post.upvotes += 1;
		};

}])

app.controller('postsController', [

	'$scope', 
	'$stateParams',
	'posts',

	function($scope, $stateParams, posts){

		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function(){
			if($scope.body == '') { return; }
			$scope.post.comments.push({

				body: $scope.body,
				author: 'user',
				upvotes: 0
			});

			$scope.body = '';
		};

		$scope.incrementUpvotes = function(comment) {
			comment.upvotes += 1;
		}

}])