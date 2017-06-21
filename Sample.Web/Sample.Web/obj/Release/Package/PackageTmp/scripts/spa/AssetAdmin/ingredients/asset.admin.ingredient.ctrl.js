(function (app) {
    "use strict";
    app.controller("asset.admin.ingredient.ctrl", ingredientCtrl);
    ingredientCtrl.$inject = ['$rootScope', '$modal', '$scope', 'apiService', 'IngredientService', 'Notification', 'blockingservice', '$location', '$routeParams'];

    function ingredientCtrl($scope, $modal, $rootScope, apiService, IngredientService, Notification, blockingservice, $location, $routeParams) {
        $scope.createheader = createheader;
        $scope.updateheader = updateheader;
        $scope.loadingredient = loadingredient;
        $scope.topbarurl = "/scripts/spa/AssetAdmin/ingredients/template/topbar.html";
        $scope.sidebarurl = "/scripts/spa/AssetAdmin/ingredients/template/sidebar.html";
        $scope.ingredient = {};
        $scope.busyingload = true;
        $scope.EditIngredient = EditIngredient;
        $scope.loadsingleingredient = loadsingleingredient;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.indexes = { startindex: 1, endindex: 10 };
        $scope.loadingredientlistlazy = loadingredientlistlazy;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.search = search;
        $scope.totalCount = 0;
        $scope.ingredientlist = [];

        function search(page) {
            page = page || 0;
            //$scope.loadingCustomers = true;

            var config = {
                params: {
                    page: page,
                    pageSize: 10,
                    filter: null
                }
            };
           
            apiService.get('/api/ingredients/search/', config,
            ingredientsLoadCompleted,
            ingredientsLoadFailed);
        }

        function ingredientsLoadCompleted(result) {
            $scope.ingredientlist = result.data.Items;

            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
            //$scope.loadingCustomers = false;

            //if ($scope.filterCustomers && $scope.filterCustomers.length) {
            //    notificationService.displayInfo(result.data.Items.length + ' customers found');
            //}

        }

        function ingredientsLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }
        if (!(angular.isUndefined($routeParams.id))) {
            console.log($routeParams.id);
        }
        $scope.headersaved = false;
        function createheader() {
            blockingservice.block('division', 'bars', 'Creaing new Ingredient...', 'div_add_ingredient');
            IngredientService.createheader($scope.ingredient, completed);
        }
        function updateheader() {
            blockingservice.block('division', 'bars', 'Updating existing Ingredient...', 'div_add_ingredient');
            IngredientService.updateheader($scope.ingredient, updated);
        }
        function loadingredient() {
            IngredientService.listingredient(completedingredientload);
        }
        function EditIngredient(ID) {
            $location.path('/ingredients/edit/' + ID);
        }
        function loadsingleingredient() {
            IngredientService.getsingleingredient($routeParams.id, completedgetingredient);
        }
        function completedingredientload(result) {
            $scope.busyingload = false;
            $scope.ingredientlist = result.data;
        }
        function completedgetingredient(result) {
            $scope.busyingload = false;
            $scope.ingredient = result.data;
        }
        function completed() {
            $rootScope.ingredientheader = $scope.ingredient;
            $scope.headersaved = true;
            blockingservice.unblock('division', 'div_add_ingredient');
            Notification.success('Ingredient created successfully');
        }
        function updated() {
            //$rootScope.ingredientheader = $scope.ingredient;
            $scope.headersaved = true;
            blockingservice.unblock('division', 'div_add_ingredient');
            Notification.success('Ingredient updated successfully');
        }
        function openDeleteDialog(ingredient) {
            $scope.EditedIngredient = ingredient;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/ingredients/deleteIngredientModal.html',
                controller: 'asset.admin.ingredient.delete.ctrl',
                scope: $scope
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function loadingredientlistlazy() {
            $scope.indexes.startindex = $scope.indexes.startindex +10;
            //$scope.indexes.endindex = $scope.indexes.endindex + 10;
            console.log($scope.indexes.startindex);
            IngredientService.lazyloadingredient($scope.indexes.startindex,completedgetingredientlazy);
        }
        function completedgetingredientlazy(result) {
            $scope.busyingload = false;
            //$scope.ingredientlist = $scope.ingredientlist.concat(result.data);
            $scope.ingredientlist = result.data;
        }

        $scope.search();
    }
})(angular.module('AssetAdminApp'));