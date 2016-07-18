var bookWishlistAppServices = angular.module('bookWishlistAppServices', [
	'LocalStorageModule',
	'restangular'
]);

bookWishlistAppServices.factory('userService', ['$http', 'localStorageService', 'urls', 'Restangular',
function($http, localStorageService, urls, Restangular) {

	var userService = this;

	function updateAuthHeader() {
		Restangular.setDefaultHeaders({ 'Authorization' : 'Bearer ' + userService.getCurrentToken() });
	}

	function checkIfLoggedIn() {
		return !!localStorageService.get('token');
	}

	function signup(name, email, password, onSuccess, onError) {
		$http.post(urls.BASE + '/api/auth/signup', {
			name: name,
			email: email,
			password: password
		})
		.then(function(response) {
			localStorageService.set('token', response.data.token);
			onSuccess(response);
		})
		.catch(function(response) {
			onError(response);
		});
	}

	function login(email, password, onSuccess, onError){
		$http.post(urls.BASE + '/api/auth/login', {
			email: email,
			password: password
		})
		.then(function(response) {
			localStorageService.set('token', response.data.token);
			userService.updateAuthHeader();
			onSuccess(response);
		})
		.catch(function(response) {
			onError(response);
		});
	}

	function logout(){
		localStorageService.remove('token');
	}

	function getCurrentToken(){
		return localStorageService.get('token');
	}

	userService.checkIfLoggedIn = checkIfLoggedIn;
	userService.updateAuthHeader = updateAuthHeader;
	userService.signup = signup;
	userService.login = login;
	userService.logout = logout;
	userService.getCurrentToken = getCurrentToken;
	return userService;
}]);

bookWishlistAppServices.factory('bookService', ['Restangular', 'userService','urls', function(Restangular, userService, urls) {

	function getAll(){
		return Restangular.all('/api/books').getList();
	}

	function getById(bookId){
		return Restangular.one('/api/books', bookId).get();
	}

	function create(data){
		return Restangular.all('/api/books').post(data);
	}

	function update(bookId, data){
		return Restangular.one("/api/books").customPUT(data, bookId);
	}

	function remove(bookId){
		return Restangular.one('/api/books/', bookId).remove();
	}

	userService.updateAuthHeader();

	return {
		getAll: getAll,
		getById: getById,
		create: create,
		update: update,
		remove: remove
	}

}]);
