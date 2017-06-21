(function (app) {
    "use strict";

    app.controller('asset.admin.menu.Ctrl', ['$scope', '$rootScope', 'apiService', '$modal', 'Notification', function ($scope, $rootScope, apiService, $modal, Notification) {

        $rootScope.getAllMenus = getAllMenus;
        $scope.menuList = [];
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.addMenu = addMenu;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.clearSearch = clearSearch;

        function clearSearch() {
            $scope.filterMenus = '';
            getAllMenus();
        }
        function getAllMenus() {
            apiService.get('/api/menu/getallmenus', null, success, failure)
        }

        function success(result) {
            $scope.menuList = result.data;
            $scope.busyingload = false;
        }

        function failure() {
            $scope.busyingload = false;
        }

        $rootScope.getAllMenus();

        function openEditDialog(menu) {
            $scope.EditedMenu = angular.copy(menu);
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/menu/editMenuModal.html',
                controller: 'asset.admin.menu.edit.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addMenu() {
            $scope.EditedMenu = {};
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/menu/editMenuModal.html',
                controller: 'asset.admin.menu.edit.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function openDeleteDialog(menu) {
            $scope.EditedMenu = angular.copy(menu);
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/menu/deleteMenuModal.html',
                controller: 'asset.admin.menu.edit.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

    }]);

})(angular.module('AssetAdminApp'));