(function () {
	'use strict';
	app.controller('mainController', function ($scope, $http) {
		$scope.websites = [];
		$scope.loadPortfolios = function () {
			$scope.showLoader = true;
			$http.get(' https://hackerearth.0x10.info/api/one-push?type=json&query=list_websites').success(function (data) {
				var arr = data.websites;
				$scope.websites = $scope.websites.concat(arr);
				$scope.showLoader = false;
			}).error(function (err) {
				console.log(err);
			});
		};
		$scope.loadPortfolios();
		$scope.submit = function () {
			if($scope.title && $scope.tag && $scope.url)
			{
				$http.post('https://hackerearth.0x10.info/api/one-push?type=json&query=push&title=' + $scope.title + '&url=' + $scope.url + '&tag=' + $scope.tag).success(function (data) {
					$scope.message = data.message + '!!';
				}).error(function (err) {
					console.log(err);
					return err;
				});
			}
			else {
				$scope.message = ' All fields are Mandatory';
			}
		};
	});
})();
