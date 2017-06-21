(function (app) {
	'use strict';

	app.directive('autoComplete', autoComplete);
	function autoComplete(customerService) {
	    return {
	        restrict: 'E',
	        templateUrl: "/Scripts/spa/AssetAdmin/directives/test.html",
	        //scope: {
	        //    filter: '=ngModel'
	        //},
	        link: function ($scope, $element, $attrs) {
	            //$scope.getAvailableClass = function () {
	            //	if ($attrs.isAvailable === 'true')
	            //		return 'label label-success'
	            //	else
	            //		return 'label label-danger'
	            //};
	            //$scope.getAvailability = function () {
	            //	if ($attrs.isAvailable === 'true')
	            //		return 'Available!'
	            //	else
	            //		return 'Not Available'
	            //};
	            //$element.on('keyup focus', function (event) {
	            //    apiService.get("/api/customers/list5", null, completed, failure);
	            //});
	        },

	        controller: function ($scope, customerService) {
	            $scope.filter = '';
	            $scope.customers = null;

	            $scope.filterCustomer = function () {
	                customerService.filterCustomer($scope.filter, completedload);

	            }
	            function completedload(result) {
	                $scope.customers = result.data;
	            }
	            $scope.selected = function (customer) {
	                $scope.filter = customer.FirstName;
	                $scope.customers = null;
	            }

	            $scope.hideCustomerList = function () {
	                $scope.customers = null;
	            }
	        }

		}
	}

})(angular.module('AssetAdminApp'));

(function (app) {
    'use strict';

    app.directive('escKey', escKey);
    function escKey() {
        return function (scope, element, attrs) {
            element.bind('keydown keypress', function (event) {
                if (event.which === 27) { // 27 = esc key
                    scope.$apply(function () {
                        scope.$eval(attrs.escKey);
                    });

                    event.preventDefault();
                }
            });
        }
    }
})(angular.module('AssetAdminApp'));