angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootElement, $ionicModal, $ionicPopover, userService) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope,
    backdropClickToClose: false,
    hardwareBackButtonClose: false
  }).then(function(modal) {
    $scope.loginModal = modal;
    if (!userService.checkIfLoggedIn()) {
      $scope.login();
    }
  });

  // Create the signup modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.signupModal = modal;
  });

  // Form data for the login modal
  $scope.loginData = {};

  $scope.openPopover = function() {
    $scope.popover.show($rootElement);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
    });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
  };

  // Triggered in the signup modal to close it
  $scope.closeSignup = function() {
    $scope.signupModal.hide();
    $scope.loginModal.show();
  };

  // Open the signup modal
  $scope.signup = function() {
    $scope.loginModal.hide();
    $scope.signupModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    userService.login(
      $scope.loginData.username, $scope.loginData.password,
      function(response){
        $scope.closeLogin();
        $scope.$broadcast('loggedIn');
      },
      function(response){
        $scope.openPopover();
      }
    );
  };

  $scope.logout = function(){
    userService.logout();
    $scope.login();
  };
})

.controller('MainCtrl', function ($scope, $location, userService, isLoggedIn, bookService) {

	$scope.create = function(){

		bookService.create({
			title: $scope.currentBookTitle,
			author_name: $scope.currentBookAuthorName,
			pages_count: $scope.currentBookPagesCount
		}, function(){

			$('#addBookModal').modal('toggle');
			$scope.currentBookReset();
			$scope.refresh();

		}, function(){

			alert('Some errors occurred while communicating with the service. Try again later.');

		});

	}

	$scope.refresh = function(){

		bookService.getAll(function(response){

			$scope.books = response;
			console.log($scope.books);


		}, function(){

			alert('Some errors occurred while communicating with the service. Try again later.');

		});

	}

	$scope.load = function(bookId){

		bookService.getById(bookId, function(response){

			$scope.currentBookId = response.book.id;
			$scope.currentBookTitle = response.book.title;
			$scope.currentBookAuthorName = response.book.author_name;
			$scope.currentBookPagesCount = response.book.pages_count;

			$('#updateBookModal').modal('toggle');

		}, function(){

			alert('Some errors occurred while communicating with the service. Try again later.');

		});

	}

	$scope.update = function(){

		bookService.update(
			$scope.currentBookId,
			{
				title: $scope.currentBookTitle,
				author_name: $scope.currentBookAuthorName,
				pages_count: $scope.currentBookPagesCount
			},
			function(response){

				$('#updateBookModal').modal('toggle');
				$scope.currentBookReset();
				$scope.refresh();

			}, function(response){
				alert('Some errors occurred while communicating with the service. Try again later.');
			}
		);

	}

	$scope.remove = function(bookId){

		if(confirm('Are you sure to remove this book from your wishlist?')){
			bookService.remove(bookId, function(){

				alert('Book removed successfully.');

			}, function(){

				alert('Some errors occurred while communicating with the service. Try again later.');

			});
		}

	}

	$scope.currentBookReset = function(){
		$scope.currentBookTitle = '';
		$scope.currentBookAuthorName = '';
		$scope.currentBookPagesCount = '';
		$scope.currentBookId = '';
	}

	$scope.books = [];

	$scope.currentBookReset();

  if(isLoggedIn) {
    $scope.refresh();
  } else {
    $scope.$on('loggedIn', $scope.refresh);
  }
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.run(function ($rootScope, userService) {
  if(userService.checkIfLoggedIn()) {
    // $rootScope.closeLogin();
  }
});
