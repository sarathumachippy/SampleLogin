(function (app) {
    "use strict";
    app.controller("asset.admin.department.ctrl", usersCtrl);
    usersCtrl.$inject = ['$scope', '$rootScope', '$modal', 'apiService', 'DepartmentService', 'Notification', 'blockingservice', '$location', 'constants'];

    function usersCtrl($scope, $rootScope, $modal, apiService, DepartmentService, Notification, blockingservice, $location, constants) {
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addDepartment = addDepartment;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchDepartment = searchDepartment;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchDepartment(page) {

            $scope.busyingload = true;

            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterDepartments
                }
            };

            apiService.get('/api/departments/search/', config,
            departmentsLoadCompleted,
            departmentsLoadFailed);
        }

        function departmentsLoadCompleted(result) {
            $scope.departmentsList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function departmentsLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }

        function openEditDialog(department) {
            $scope.EditedDept = angular.copy(department);
            $scope.Mode = 'edit';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/department/addEditDepartmentModal.html',
                controller: 'asset.admin.departments.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }
       
        function openDeleteDialog(department) {
            $scope.EditedDept = department;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/department/deleteDepartmentModal.html',
                controller: 'asset.admin.departments.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addDepartment(department) {
            $scope.EditedDept = department;
            $scope.Mode = 'add';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/department/addEditDepartmentModal.html',
                controller: 'asset.admin.departments.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function clearSearch() {
            $scope.filterDepartments = '';
            searchDepartment();
        }
        $rootScope.searchDepartment();
    }
})(angular.module('AssetAdminApp'));
