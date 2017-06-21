(function (app) {
    "use strict";
    app.controller("asset.admin.employee.edit.ctrl", empEditCtrl);
    empEditCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location'];

    function empEditCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.deleteData = deleteData;
       // $scope.addEmployee = addEmployee;

        function deleteData() {
            apiService.post('/api/employees/delete/', $scope.EditedEmp,
            deleteEmpCompleted,
            deleteEmpFailed);
        }

        function deleteEmpCompleted(response) {
            Notification.error($scope.EditedEmp.Emp_Name + ' has been deleted');
            $modalInstance.dismiss();
            $rootScope.searchEmployee();
            $scope.EditedEmp = {};

        }

        function deleteEmpFailed(response) {
            $modalInstance.dismiss();
            Notification.error(response.data);
        }


        function cancelEdit() {
            $scope.isEnabled = false;
            $modalInstance.dismiss();
        }

      // function addEmployee() {
      //     $location.path("/employees/new");
      // }
      //
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
