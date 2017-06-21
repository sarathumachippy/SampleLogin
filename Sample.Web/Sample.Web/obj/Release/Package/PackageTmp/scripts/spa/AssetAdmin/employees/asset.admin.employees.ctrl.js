(function (app) {
    "use strict";
    app.controller("asset.admin.employees.ctrl", locationCtrl);
    locationCtrl.$inject = ['$modal', '$scope', '$rootScope', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function locationCtrl($modal, $scope, $rootScope, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {

        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addEmployee = addEmployee;
        $scope.editEmployee = editEmployee;
        $scope.createEmployee = createEmployee;
        $scope.loadEmployee = loadEmployee;
        $scope.updateEmployee = updateEmployee;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchEmployee = searchEmployee;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;
        $scope.employee = {};

        function searchEmployee(page) {

            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterEmployees
                }
            };
            apiService.get('/api/employees/search/', config,
            employeesLoadCompleted,
            employeesLoadFailed);
        }

        function employeesLoadCompleted(result) {
            $scope.employeeList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function employeesLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
        function openEditDialog(employee) {
            $scope.EditedEmp = angular.copy(employee);
            $scope.Mode = 'edit';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/employees/addEditEmployeeModal.html',
                controller: 'asset.admin.employee.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: learSearch
            }).result.then(function ($scope) {
            }, function () {
            });
        }
        function openDeleteDialog(employee) {
            $scope.EditedEmp = employee;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/employees/deleteEmployeeModal.html',
                controller: 'asset.admin.employee.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }


        function editEmployee(ID) {
            $location.path('/employees/edit/' + ID);
        }
        function addEmployee() {
            $location.path("/employees/new");
        }

        function loadEmployee() {
            if ($routeParams.id != undefined) {
                membershipService.getSingleEmp($routeParams.id, completedLoadEmp);
            } else {
                $scope.employee.Emp_Sex = "M";
            }
        }
        function completedLoadEmp(result) {
            $scope.employee = result.data;
        }


        function createEmployee(employee) {
            $scope.employee.Usr_Id = $scope.repository.loggedUser.username;
            apiService.post('/api/employees/add/', $scope.employee,
            createEmployeeCompleted,
            createEmployeeFailed);
        }

        function createEmployeeCompleted(response) {
            Notification.success($scope.employee.Emp_Name + ' has been added');

            $rootScope.searchEmployee();
            $scope.employee = {};
            $location.url('employees');

        }

        function createEmployeeFailed(response) {
            Notification.error(response.data);
            $location.url('employees');

        }

        function updateEmployee() {
            
            $scope.employee.Usr_Id = $scope.repository.loggedUser.username;
            apiService.post('/api/employees/update/', $scope.employee,
            updateEmpCompleted,
            updateEmpFailed);
        }

        function updateEmpCompleted(response) {
            Notification.success($scope.employee.Emp_Name + ' has been updated');
            $location.url('employees');
            $scope.EditedEmp = {};
        }

        function updateEmpFailed(response) {
            Notification.error(response.data);
        }

        function clearSearch() {
            $scope.filterEmployees = '';
            searchEmployee();
        }
        $rootScope.searchEmployee();
    }
})(angular.module('AssetAdminApp'));
