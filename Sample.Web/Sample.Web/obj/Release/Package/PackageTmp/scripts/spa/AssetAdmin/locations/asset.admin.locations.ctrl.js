(function (app) {
    "use strict";
    app.controller("asset.admin.locations.ctrl", locationCtrl);
    locationCtrl.$inject = ['$modal', '$scope','$rootScope', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function locationCtrl($modal, $scope, $rootScope, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {
        $scope.LocationService = {};
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addLoaction = addLoaction;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchLocation = searchLocation;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchLocation(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterLocations
                }
            };
            apiService.get('/api/locations/search/', config,
            locationsLoadCompleted,
            locationsLoadFailed);
        }

        function locationsLoadCompleted(result) {
            $scope.locationList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            //if ($scope.totalCount > 0) {
            //    Notification.success('Total locations found: ' + $scope.totalCount);
            //}
            $scope.busyingload = false;
        }
        function locationsLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
        function openEditDialog(location) {
            $scope.EditedLoc = angular.copy(location);
            $scope.Mode = 'edit';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/locations/addEditLocationModal.html',
                controller: 'asset.admin.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () { 
            });
        }
        function openDeleteDialog(location) {
            $scope.EditedLoc = location;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/locations/deleteLocationModal.html',
                controller: 'asset.admin.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addLoaction(location) {
            $scope.EditedLoc = location;
            $scope.Mode = 'add';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/locations/addEditLocationModal.html',
                controller: 'asset.admin.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function clearSearch() {
            $scope.filterLocations = '';
            searchLocation();
        }
        $rootScope.searchLocation();
    }
})(angular.module('AssetAdminApp'));
