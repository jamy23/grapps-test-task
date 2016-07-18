angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootElement, $timeout, $ionicModal, $ionicPopover, userService) {
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

  $scope.refresh = function () {
    $scope.$broadcast('refresh');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    userService.login(
      $scope.loginData.username, $scope.loginData.password,
      function(response){
        $timeout(function () {
          $scope.closeLogin();
          $scope.refresh();
        }, 500);
      },
      function(response){
        $scope.openPopover();
      }
    );
  };

  $scope.logout = function(){
    userService.logout();
    $scope.$broadcast('logout');
    $scope.login();
  };
})

.controller('MainCtrl', function ($scope, $location, userService, isLoggedIn, bookService) {

	$scope.create = function(){
		bookService.create({
			title: $scope.currentBookTitle,
			author_name: $scope.currentBookAuthorName,
			pages_count: $scope.currentBookPagesCount
		})
    .then(function(){
			$('#addBookModal').modal('toggle');
			$scope.currentBookReset();
			$scope.refresh();
		})
    .catch(function(){
			alert('Some errors occurred while communicating with the service. Try again later.');
		});
	};

	$scope.refresh = function(){
		bookService.getAll()
    .then(function(response){
			$scope.books = response;
		})
    .catch(function(response){
      if (response.status === 401) {
        $scope.login();
      } else {
        $scope.openPopover();
      }
		});
	};

	$scope.update = function(){
		bookService.update($scope.currentBookId, {
			title: $scope.currentBookTitle,
			author_name: $scope.currentBookAuthorName,
			pages_count: $scope.currentBookPagesCount
		})
		.then(function(response){
			$('#updateBookModal').modal('toggle');
			$scope.currentBookReset();
			$scope.refresh();
		})
    .catch(function(response){
			alert('Some errors occurred while communicating with the service. Try again later.');
		});
	};

	$scope.remove = function(bookId){
		if(confirm('Are you sure to remove this book from your wishlist?')){
			bookService.remove(bookId)
      .then(function(){
				alert('Book removed successfully.');
			})
      .catch(function(){
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

  $scope.resetBooks = function () {
    $scope.books = [];
  };

  $scope.resetBooks();
	$scope.currentBookReset();

  if(isLoggedIn) {
    $scope.refresh();
  }

  $scope.$on('refresh', $scope.refresh);
  $scope.$on('logout', $scope.resetBooks);
})

.controller('BookCtrl', function($scope, $stateParams, bookPromise) {
	$scope.currentBookId = bookPromise.book.id;
	$scope.currentBookTitle = bookPromise.book.title;
	$scope.currentBookAuthorName = bookPromise.book.author_name;
	$scope.currentBookPagesCount = bookPromise.book.pages_count;
  $scope.currentBookUser = bookPromise.book.user_id;
  $scope.currentBookCreated = bookPromise.book.created_at;
  $scope.currentBookUpdated = bookPromise.book.updated_at;
})

.run(function ($rootScope, userService) {
  if(userService.checkIfLoggedIn()) {
    // $rootScope.closeLogin();
  }
});
