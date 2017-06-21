(function (app) {
    "use strict";
    app.controller("asset.admin.suppliers.ctrl", supplierCtrl);
    supplierCtrl.$inject = ['$modal', '$scope', '$rootScope', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function supplierCtrl($modal, $scope, $rootScope, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {

        $scope.busyingload = true;
       
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addSupplier = addSupplier;
        $scope.editSupplier = editSupplier;
        $scope.createSupplier = createSupplier;
        $scope.loadSupplier = loadSupplier;
        $scope.updateSupplier = updateSupplier;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchSupplier = searchSupplier;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;

        function searchSupplier(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterSuppliers
                }
            };
            apiService.get('/api/suppliers/search/', config,
            suppliersLoadCompleted,
            suppliersLoadFailed);
        }

        function suppliersLoadCompleted(result) {
            $scope.suppliersList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function suppliersLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
    
        function openDeleteDialog(supplier) {
            $scope.supplier = supplier;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/supplier/deleteSupplierModal.html',
                controller: 'asset.admin.supplier.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }


        function editSupplier(ID) {
            $location.path('/suppliers/edit/' + ID);
        }
        function addSupplier() {
            $location.path("/suppliers/new");
        }

        function loadSupplier() {
            if ($routeParams.id != undefined) {
                membershipService.getSingleSupplier($routeParams.id, completedLoadSupplier);
            }
        }
        function completedLoadSupplier(result) {
            $scope.supplier = result.data;
        }


        function createSupplier(supplier) {
            $scope.supplier.Usr_Id = $scope.repository.loggedUser.username;
            apiService.post('/api/suppliers/add/', $scope.supplier,
            createSupplierCompleted,
            createSupplierFailed);
        }

        function createSupplierCompleted(response) {
            Notification.success($scope.supplier.AC_DESC + ' has been added');

            $rootScope.searchSupplier();
            $scope.employee = {};
            $location.url('suppliers');

        }

        function createSupplierFailed(response) {
            Notification.error(response.data);
            $location.url('suppliers');

        }

        function updateSupplier() {
            $scope.supplier.USER_ID = $scope.repository.loggedUser.username;
            apiService.post('/api/suppliers/update/', $scope.supplier,
            updateSupplierCompleted,
            updateSupplierFailed);
        }

        function updateSupplierCompleted(response) {
            Notification.success($scope.supplier.AC_DESC + ' has been updated');
            $location.url('suppliers');
            $scope.supplier = {};
           
        }

        function updateSupplierFailed(response) {
            Notification.error(response.data);
        }

       

        function clearSearch() {
            $scope.filterSuppliers = '';
            searchSupplier();
        }
        $rootScope.searchSupplier();
    }
})(angular.module('AssetAdminApp'));
