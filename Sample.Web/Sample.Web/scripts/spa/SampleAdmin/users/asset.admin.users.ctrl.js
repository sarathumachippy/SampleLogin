(function (app) {
    "use strict";
    app.controller("asset.admin.users.ctrl", usersCtrl);
    usersCtrl.$inject = ['$rootScope','$scope', '$modal', 'apiService', 'UsersService', 'Notification', 'blockingservice', '$location', '$routeParams','constants'];

    function usersCtrl($rootScope, $scope, $modal, apiService, UsersService, Notification, blockingservice, $location, $routeParams, constants) {

        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.openChgPwdDialog = openChgPwdDialog;
        $scope.addUser = addUser;
        $scope.editUser = editUser;

        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchUser = searchUser;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchUser(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterUsers
                }
            };
            apiService.get('/api/users/search/', config,
            usersLoadCompleted,
            usersLoadFailed);
        }

        function usersLoadCompleted(result) {
            $scope.usersList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function usersLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }

        function openEditDialog(user) {
            $scope.EditedUser = user;
            $modal.open({
                templateUrl: 'scripts/spa/SampleAdmin/users/editUserModal.html',
                controller: 'asset.admin.users.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
                //clearSearch();
            }, function () {
            });
        }

        function editUser(ID) {
            $location.path('/users/edit/' + ID);
        }
        function openDeleteDialog(user) {
            $scope.EditedUser = user;
            $modal.open({
                templateUrl: 'scripts/spa/SampleAdmin/users/deleteUserModal.html',
                controller: 'asset.admin.users.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }
        function openChgPwdDialog(user) {
            $scope.EditedUser = user;
            $modal.open({
                templateUrl: 'scripts/spa/SampleAdmin/users/changeUserPwdModal.html',
                controller: 'asset.admin.users.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addUser() {
            $location.path("/users/new");
        }
        function clearSearch() {
            $scope.filterUsers = '';
            searchUser();
        }
        $rootScope.searchUser();
    }
})(angular.module('SampleApp'));
