(function (app) {
    "use strict";
    app.controller("asset.admin.customer.location.edit.ctrl", custLocEditCtrl);
    custLocEditCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function custLocEditCtrl($scope, $rootScope, $modalInstance, $timeout, apiService, Notification, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.updateCustLocation = updateCustLocation;
        $scope.deleteData = deleteData;
        $scope.addCustLocation = addCustLocation;

        function updateCustLocation() {
            apiService.post('/api/customerLocations/update/', $scope.custLocation,
            updateCustLocCompleted,
            updateCustLocFailed);
        }

        function deleteData() {
            apiService.post('/api/customerLocations/delete/', $scope.custLocation,
            deleteCustLocCompleted,
            deleteCustLocFailed);
        }

        function updateCustLocCompleted(response) {
            Notification.success($scope.custLocation.CustLoc_Name + ' has been updated');
            $rootScope.searchCustLocation();
            $scope.custLocation = {};
            $modalInstance.dismiss();
        }

        function updateCustLocFailed(response) {
            Notification.error(response.data);
        }

        function deleteCustLocCompleted(response) {
            Notification.error($scope.custLocation.CustLoc_Name + ' has been deleted');
            $rootScope.searchCustLocation();
            $scope.custLocation = {};
            $modalInstance.dismiss();
        }

        function deleteCustLocFailed(response) {
            Notification.error(response.data);
        }

        function addCustLocation() {
            apiService.post('/api/customerLocations/add/', $scope.custLocation,
            addCustLoationCompleted,
            addCustLocationFailed);
        }

        function addCustLoationCompleted(response) {
            Notification.success($scope.custLocation.CustLoc_Name + ' has been added');
            $rootScope.searchCustLocation();
            $scope.custLocation = {};
            $modalInstance.dismiss();
        }

        function addCustLocationFailed(response) {
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
