(function (app) {
    "use strict";
    app.controller("asset.admin.location.edit.ctrl", locEditCtrl);
    locEditCtrl.$inject = ['$scope','$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function locEditCtrl($scope,$rootScope, $modalInstance, $timeout, apiService, Notification, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.updateLocation = updateLocation;
        $scope.deleteData = deleteData;
        $scope.addLocation = addLocation;

        function updateLocation() {
            apiService.post('/api/locations/update/', $scope.EditedLoc,
            updateLocCompleted,
            updateLocFailed);
        }

        function deleteData() {
            apiService.post('/api/locations/delete/', $scope.EditedLoc,
            deleteLocCompleted,
            deleteLocFailed);
        }

        function updateLocCompleted(response) {
            Notification.success($scope.EditedLoc.Loc_Name + ' has been updated');
            $rootScope.searchLocation();
            $scope.EditedLoc = {};
            $modalInstance.dismiss();
        }

        function updateLocFailed(response) {
            Notification.error(response.data);
        }

        function deleteLocCompleted(response) {
            Notification.error($scope.EditedLoc.Loc_Name + ' has been deleted');
            $rootScope.searchLocation();
            $scope.EditedLoc = {};
            $modalInstance.dismiss();
        }

        function deleteLocFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }

        function addLocation() {
            apiService.post('/api/locations/add/', $scope.EditedLoc,
            addLoationCompleted,
            addLocationFailed);
        }

        function addLoationCompleted(response) {
            Notification.success($scope.EditedLoc.Loc_Name + ' has been added');
            $rootScope.searchLocation();
            $scope.EditedLoc = {};
            $modalInstance.dismiss();
        }

        function addLocationFailed(response) {
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
