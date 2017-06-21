(function (app) {
    "use strict";
    app.controller("asset.admin.ownership.edit.ctrl", ownershipEditCtrl);
    ownershipEditCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function ownershipEditCtrl($scope, $rootScope, $modalInstance, $timeout, apiService, Notification, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.updateOwnership = updateOwnership;
        $scope.deleteData = deleteData;
        $scope.addOwnership = addOwnership;

        function updateOwnership() {
            apiService.post('/api/ownerships/update/', $scope.ownership,
            updateOwnershipCompleted,
            updateOwnershipFailed);
        }

        function deleteData() {
            apiService.post('/api/ownerships/delete/', $scope.ownership,
            deleteLocCompleted,
            deleteLocFailed);
        }

        function updateOwnershipCompleted(response) {
            Notification.success($scope.ownership.OWS_Name + ' has been updated');
            $rootScope.searchOwnership();
            $scope.ownership = {};
            $modalInstance.dismiss();
        }

        function updateOwnershipFailed(response) {
            Notification.error(response.data);
        }

        function deleteLocCompleted(response) {
            Notification.error($scope.ownership.OWS_Name + ' has been deleted');
            $rootScope.searchOwnership();
            $scope.ownership = {};
            $modalInstance.dismiss();
        }

        function deleteLocFailed(response) {
            $modalInstance.dismiss();
            Notification.error(response.data);
        }

        function addOwnership() {
            apiService.post('/api/ownerships/add/', $scope.ownership,
            addOwnershipCompleted,
            addOwnershipnFailed);
        }

        function addOwnershipCompleted(response) {
            Notification.success($scope.ownership.OWS_Name + ' has been added');
            $rootScope.searchOwnership();
            $scope.EditedLoc = {};
            $modalInstance.dismiss();
        }

        function addOwnershipnFailed(response) {
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
