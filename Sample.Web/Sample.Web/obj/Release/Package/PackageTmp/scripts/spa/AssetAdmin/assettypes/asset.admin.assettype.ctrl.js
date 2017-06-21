(function (app) {
    "use strict";
    app.controller("asset.admin.assettype.ctrl", assettypeCtrl);
    assettypeCtrl.$inject = ['$rootScope', '$modal', '$scope', 'apiService', 'AssetTypeService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function assettypeCtrl($rootScope, $modal, $scope, apiService, AssetTypeService, Notification, blockingservice, $location, $routeParams, constants) {
        $scope.loadAssetType = loadAssetType;
       // $scope.EditedAsset = {};
        $scope.busyingload = true;
        $scope.openEditDialog = openEditDialog;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addAssetType = addAssetType;
        $scope.editAssetType = editAssetType;
        
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchAssetType = searchAssetType;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchAssetType(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterAssetType
                }
            };
            //console.log(config)
            apiService.get('/api/assettypes/search/', config,
            AssetLoadCompleted,
            AssetLoadFailed);
        }



        function AssetLoadCompleted(result) {
            $scope.assettypelist = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function AssetLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }

        function loadAssetType() {
            AssetTypeService.listassettypes(completedusersload);
        }

        function completedusersload(result) {
            $scope.busyingload = false;
            $scope.assettypelist = result.data;
        }

        function openEditDialog(assettype) {
            $scope.EditedAsset = assettype;
            $location.url('assettypes/edit');
          
        }

        function openDeleteDialog(assettype) {
            $scope.EditedAsset = assettype;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/assettypes/deleteAssetType.html',
                controller: 'asset.admin.assettype.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
               keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function addAssetType(assettype) {
            $scope.EditedAsset = assettype;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/assettypes/editassettypemodal.html',
                controller: 'asset.admin.assettype.edit.ctrl',
                scope: $scope
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function editAssetType(id) {
           
            $location.path('/assettypes/edit/' + id);
        }
        function clearSearch() {
             
            $scope.filterAssetType = '';
            search();
        }
        $rootScope.searchAssetType();

    }
})(angular.module('AssetAdminApp'));
