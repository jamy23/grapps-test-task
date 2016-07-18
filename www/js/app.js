angular.module('bookWishlistApp', ['ionic', 'starter.controllers', 'bookWishlistAppServices'])

.constant('urls', {
  BASE: 'http://devtestco.nfcs.co.il/'
  // BASE: 'http://localhost:8000/'
  // BASE: 'http://admin.dev/'
})

.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('bookWishlistApp')
    .setStorageType('localStorage');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.books', {
    url: '/',
    resolve: {
      isLoggedIn: function (userService) {
        return userService.checkIfLoggedIn();
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/books.html',
        controller: 'MainCtrl'
      }
    }
  })

  .state('app.book', {
    url: '/book/:bookId',
    resolve: {
      bookPromise: function ($stateParams, bookService) {
        return bookService.getById($stateParams.bookId);
      }
    },
    views: {
      'menuContent': {
        templateUrl: 'templates/book.html',
        controller: 'BookCtrl'
      }
    }
  })

  .state('app.create', {
    url: '/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/create.html',
        controller: 'AddCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
})

.config(function(RestangularProvider) {
  RestangularProvider.setBaseUrl('http://devtestco.nfcs.co.il/');
  // RestangularProvider.setBaseUrl('http://localhost:8000/');
  // RestangularProvider.setBaseUrl('http://admin.dev/');

	// RestangularProvider.setResponseExtractor(function(response, operation) {
    //     return response.data;
    // });

})

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
});
