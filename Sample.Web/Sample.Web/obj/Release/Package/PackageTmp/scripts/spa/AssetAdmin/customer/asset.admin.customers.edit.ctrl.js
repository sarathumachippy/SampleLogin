(function (app) {
    "use strict";
    app.controller("asset.admin.customers.edit.ctrl", customerEditCtrl);
    customerEditCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location'];

    function customerEditCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.deleteData = deleteData;

        function deleteData() {
            console.log($scope.customer);
            apiService.post('/api/customers/delete/', $scope.customer,
            deleteCustomerCompleted,
            deleteCustomerFailed);
        }

        function deleteCustomerCompleted(response) {
            Notification.error($scope.customer.AC_DESC + ' has been deleted');
            $modalInstance.dismiss();
            $rootScope.searchCustomer();
            $scope.customer = {};
        }

        function deleteCustomerFailed(response) {
            Notification.error(response.data);
        }


        function cancelEdit() {
            $scope.isEnabled = false;
            $modalInstance.dismiss();
        }
      
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                $scope.datepicker.opened = true;
            });

            $timeout(function () {
                $('ul[datepicker-popup-wrap]').css('z-index', '10000');
            }, 100);

        };
    }

})(angular.module('AssetAdminApp'));
