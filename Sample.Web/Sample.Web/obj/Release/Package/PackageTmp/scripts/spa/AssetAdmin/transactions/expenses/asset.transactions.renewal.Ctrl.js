(function (app) {
    "use strict";
    app.controller("asset.transactions.renewal.Ctrl", renewalCtrl);
    renewalCtrl.$inject = ['$modal', '$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants', 'commonFunctions'];

    function renewalCtrl($modal, $scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants, commonFunctions) {

        $scope.initLoad = initLoad;
        $scope.saveRenewal = saveRenewal;
        $scope.showPrevRecords = showPrevRecords;
        $rootScope.fillRenewalData = fillRenewalData;
        $scope.updateRenewal = updateRenewal;
        $scope.renewal = {};
        $scope.mode = 'new';
        $scope.clearAllItems = clearAllItems;
        $scope.checkAssetId = checkAssetId;
        $scope.renewal.Doc_Type = 'Registration';
        function initLoad() {
            apiService.get('/api/renewal/getDocNo', null,
            getDocNoComplete,
            null);
        }

        function getDocNoComplete(response) {

            $scope.renewal.Renew_No = response.data;
            $scope.renewal.Renew_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.renewal.Doc_Type = 'Registration';
            $scope.mode = 'new';
        }


        function checkAssetId(assetId) {
            if (assetId == null) return;
            apiService.get('/api/assetRegister/CheckAssetId/' + assetId, null,
            checkAssetIdComplete,
            checkAssetIdFailed);

        }

        function checkAssetIdComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.renewal.Vehicle_No = '';
                $scope.renewal.Ast_Name = '';
                Notification.error('Please enter proper asset Id')
            }
        }
        function checkAssetIdFailed() { }

        function showPrevRecords() {

            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/expenses/renewalList.html',
                controller: 'asset.transactions.renewal.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function fillRenewalData(id) {
            apiService.get('/api/renewal/GetSingleId/' + id, null,
            getSinglePurchaseCompleted,
            getSinglePurchaseFailed);
        }

        function getSinglePurchaseCompleted(response) {
            $scope.renewal = response.data;
            $scope.renewal.Renew_Dt = $filter('date')($scope.renewal.Renew_Dt, 'dd-MM-yyyy');
            $scope.renewal.Doc_Dt = $filter('date')($scope.renewal.Doc_Dt, 'dd-MM-yyyy');
            $scope.renewal.Doc_ExpDt = $filter('date')($scope.renewal.Doc_ExpDt, 'dd-MM-yyyy');
            $scope.mode = 'edit';
        }

        function getSinglePurchaseFailed(response) {

            Notification.error('Unable to retrive the details.Please try again later');

        }



        function saveRenewal() {

            if (new Date($scope.renewal.Doc_Dt) > new Date($scope.renewal.Doc_ExpDt)) {
                Notification.error('Expiry date cannot be less than Registration Date.');
                return;

            }
            $scope.renewal.Renew_Dt = angular.copy(commonFunctions.formatDate($scope.renewal.Renew_Dt));
            $scope.renewal.Doc_Dt = angular.copy(commonFunctions.formatDate($scope.renewal.Doc_Dt));
            $scope.renewal.Doc_ExpDt = angular.copy(commonFunctions.formatDate($scope.renewal.Doc_ExpDt));
            apiService.post('/api/renewal/add/', $scope.renewal,
            saveRenewalCompleted,
            saveRenewalFailed);
        }

        function saveRenewalCompleted() {
            Notification.success("Renewal has been successfully saved");
            clearAllItems();
        }
        function saveRenewalFailed(response) {
            Notification.error(response.data);
            // clearAllItems();
        }

        function updateRenewal() {

            if (new Date($scope.renewal.Doc_Dt) > new Date($scope.renewal.Doc_ExpDt)) {
                Notification.error('Expiry date cannot be less than Registration Date.');
                return;

            }
            $scope.renewal.Renew_Dt = angular.copy(commonFunctions.formatDate($scope.renewal.Renew_Dt));
            $scope.renewal.Doc_Dt = angular.copy(commonFunctions.formatDate($scope.renewal.Doc_Dt));
            $scope.renewal.Doc_ExpDt = angular.copy(commonFunctions.formatDate($scope.renewal.Doc_ExpDt));
            apiService.post('/api/renewal/update/', $scope.renewal,
            updateRenewalCompleted,
            updateRenewalFailed);

        }

        function updateRenewalCompleted() {
            Notification.success("renewal has been successfully Updated");
            clearAllItems();
        }
        function updateRenewalFailed(response) {
            Notification.error(response.data);
            // clearAllItems();
        }

        function clearAllItems() {

            $scope.renewal = {};
            $scope.item = {};
            initLoad();
        }


        $scope.headerAssetId = [
          { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' },

        ]


        $scope.loadAssetId = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/expenses/getAssetItem',
            params: ''
        }


    }

})(angular.module('AssetAdminApp'));
