(function (app) {
    "use strict";
    app.controller("asset.admin.customer.location.ctrl", custLocationCtrl);
    custLocationCtrl.$inject = ['$modal', '$scope', '$rootScope', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function custLocationCtrl($modal, $scope, $rootScope, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {
        $scope.LocationService = {};
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addCustLoaction = addCustLoaction;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchCustLocation = searchCustLocation;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchCustLocation(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterCustLocations
                }
            };
            apiService.get('/api/customerLocations/search/', config,
            custLocationsLoadCompleted,
            custLocationsLoadFailed);
        }

        function custLocationsLoadCompleted(result) {
            $scope.CustLocationList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function custLocationsLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
        function openEditDialog(custLocation) {
            $scope.custLocation = angular.copy(custLocation);
            $scope.Mode = 'edit';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/customerLocations/addEditCustLocationModal.html',
                controller: 'asset.admin.customer.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () { 
            });
        }
        function openDeleteDialog(custLocation) {
            $scope.custLocation = custLocation;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/customerLocations/deleteCustLocationModal.html',
                controller: 'asset.admin.customer.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addCustLoaction(custLocation) {
            $scope.custLocation = {};
            $scope.Mode = 'add';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/customerLocations/addEditCustLocationModal.html',
                controller: 'asset.admin.customer.location.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function clearSearch() {
            $scope.filterCustLocations = '';
            searchCustLocation();
        }
        $rootScope.searchCustLocation();
    }
})(angular.module('AssetAdminApp'));
