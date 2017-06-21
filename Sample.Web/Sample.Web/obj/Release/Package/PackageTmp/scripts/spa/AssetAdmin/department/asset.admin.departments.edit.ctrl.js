(function (app) {
    "use strict";
    app.controller("asset.admin.departments.edit.ctrl", dptEditCtrl);
    dptEditCtrl.$inject = ['$scope','$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function dptEditCtrl($scope, $rootScope, $modalInstance, $timeout, apiService, Notification, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.updateDepartment = updateDepartment;
        $scope.deleteData = deleteData;
        $scope.addDepartment = addDepartment;
        $scope.openDatePicker = openDatePicker;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};

        function updateDepartment() {
            apiService.post('/api/departments/update/', $scope.EditedDept,
            updateDepartmentCompleted,
            updateDepartmentFailed);
        }

        function deleteData() {
            apiService.post('/api/departments/delete/', $scope.EditedDept,
            deleteDepartmentCompleted,
            deleteDepartmentFailed);
        }

        function deleteDepartmentCompleted(response) {
            Notification.error($scope.EditedDept.Dept_Name + ' has been deleted');
            $rootScope.searchDepartment();
            $scope.EditedDept = {};
            $modalInstance.dismiss();
        }

        function deleteDepartmentFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }

        function updateDepartmentCompleted(response) {
            Notification.success($scope.EditedDept.Dept_Name + ' has been updated');
            $rootScope.searchDepartment();
            $scope.EditedDept = {};
            $modalInstance.dismiss();
        }

        function updateDepartmentFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }

        function addDepartment(department) {
            apiService.post('/api/departments/add/', $scope.EditedDept,
            adddDepartmentCompleted,
            adddDepartmentFailed);
        }
        
        function adddDepartmentCompleted(response) {
            Notification.success($scope.EditedDept.Dept_Name + ' has been added');
            $scope.EditedDept = {};
            $rootScope.searchDepartment();
            $modalInstance.dismiss();
        }

        function adddDepartmentFailed(response) {
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
