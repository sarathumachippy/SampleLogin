(function (app) {
    "use strict";
    app.controller("asset.admin.ownership.ctrl", ownershipCtrl);
    ownershipCtrl.$inject = ['$modal', '$scope', '$rootScope', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function ownershipCtrl($modal, $scope, $rootScope, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {
        $scope.LocationService = {};
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addOwnership = addOwnership;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchOwnership = searchOwnership;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;
       
        function searchOwnership(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterOwnership
                }
            };
            apiService.get('/api/ownerships/search/', config,
            ownershipLoadCompleted,
            ownershipLoadFailed);
        }

        

        function ownershipLoadCompleted(result) {
            $scope.ownershipList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function ownershipLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
        function openEditDialog(ownership) {
            $scope.ownership = angular.copy(ownership);
            $scope.Mode = 'edit';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/ownership/addEditOwnershipModal.html',
                controller: 'asset.admin.ownership.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }
        function openDeleteDialog(ownership) {
            $scope.ownership = ownership;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/ownership/deleteOwnershipModal.html',
                controller: 'asset.admin.ownership.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addOwnership(ownership) {
            $scope.ownership = {};
            $scope.Mode = 'add';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/ownership/addEditOwnershipModal.html',
                controller: 'asset.admin.ownership.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function clearSearch() {
            $scope.filterOwnership = '';
            searchOwnership();
        }
        $rootScope.searchOwnership();
    }
})(angular.module('AssetAdminApp'));
