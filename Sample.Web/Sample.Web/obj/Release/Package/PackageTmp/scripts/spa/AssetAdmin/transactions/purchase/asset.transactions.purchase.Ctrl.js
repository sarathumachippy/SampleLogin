(function (app) {

    "use strict";

    app.controller('asset.transactions.purchase.Ctrl', purchase);
    purchase.$inject = ['$modal', '$http', '$scope', '$rootScope', '$filter', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants', 'commonFunctions'];

    function purchase($modal, $http, $scope, $rootScope, $filter, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants, commonFunctions) {
        $scope.createPurchase = createPurchase;
        $rootScope.assetRegister = {};
        $scope.purchase = {};
        $scope.mode = 'new';
        $scope.clearAllItems = clearAllItems;
        $scope.datepicker = {};
        $scope.initValues = initValues;
        $scope.openDatePicker = openDatePicker;
        //$scope.showPendingPO = showPendingPO;
        $rootScope.getPendingPOSingle = getPendingPOSingle;
        $scope.loadAsseRegister = loadAsseRegister;
        $scope.showPurchaseRecords = showPurchaseRecords;
        $scope.showPendingPO = showPendingPO;
        $rootScope.fillPurchaseData = fillPurchaseData;
        $scope.assetRegister.Ast_Qty = '1';
        $scope.updatePurch = {};
        $scope.cancelPurchOrder = cancelPurchOrder;
        $scope.purchaseQty = '';
        $rootScope.ClearAllDetails = ClearAllDetails;
        $scope.QtyCheck = QtyCheck;
        $scope.item = [];
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var serviceBase = constants.apiServiceBaseUri;

        function showPurchaseRecords() {
            $rootScope.pendingPOSupplier = $scope.item.AC_CD;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/purchase/purchaseList.html',
                controller: 'asset.transactions.purchase.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function showPendingPO() {
            apiService.get('/api/purchase/pendingPO/' + $scope.item.AC_CD, null,
          getPendingPOCompleted,
          getPendingPOFailed);
            return;
        }

        function getPendingPOCompleted(response) {

            if (response.data.length == 0) Notification.success('No pending order is found');
            else {
                $rootScope.pendingPOSupplier = $scope.item.AC_CD;
                $scope.roleList = response.data;
                $modal.open({
                    templateUrl: 'scripts/spa/AssetAdmin/transactions/purchase/pendingPOList.html',
                    controller: 'asset.transactions.purchase.pendingPO.list.Ctrl',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function ($scope) {
                }, function () {
                });
            }

        }

        function getPendingPOFailed() {
        }

        function fillPurchaseData(Id) {

            apiService.get('/api/purchase/GetSingleId/' + Id, null,
           getSinglePurchaseCompleted,
           getSinglePurchaseFailed);

        }


        function getSinglePurchaseCompleted(response) {

            $scope.mode = 'edit';
            $scope.purchase = response.data;
            $scope.item.AC_DESC = response.data.Sup_Name;
            $scope.item.ADDRESS1 = response.data.Sup_Add1;
            $scope.item.AC_CD = response.data.Sup_Cd;
            $scope.purchase.Sup_Name = response.data.AC_DESC;
            $scope.assetRegister = response.data.AssetDetails;
            $scope.assetRegister.Ast_Qty = response.data.AssetDetails.Ast_Purch_Qty;
            $scope.assetRegister.ProvisionName = response.data.ProvisionName;
            $scope.assetRegister.DepreciationName = response.data.DepreciationName;
            $scope.assetRegister.list = response.data.AssetItemLst;
            $scope.assetRegister.ImgList = response.data.AssetImageList;
            $scope.assetRegister.DocList = response.data.AssetDocsList;
            $scope.purchase.Purch_Dt = $filter('date')($scope.purchase.Purch_Dt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Warranty_Dt = $filter('date')($scope.assetRegister.Ast_Warranty_Dt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_LastInst_DueDt = $filter('date')($scope.assetRegister.Ast_LastInst_DueDt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Purch_Dt = $filter('date')($scope.assetRegister.Ast_Purch_Dt, 'dd-MM-yyyy');

        }

        function ClearAllDetails() {
            clearAllItems();
        }

        function clearAllItems() {
            $scope.assetRegister.list = {};
            $scope.assetRegister = {};
            $scope.item = {};
            $scope.purchase = {};
            initValues();
        }
        function getSinglePurchaseFailed(response) {
        }

        function cancelPurchOrder(purchNo) {

            apiService.get('/api/purchase/PurchCancel/' + purchNo, null,
            PurchCancelComplete,
            PurchCancelFailed);


            //return; //purchase cancelation logic needs to be implimented here. 
        }

        function PurchCancelComplete() {
            Notification.success("Purchase entry  has been canceled");
            clearAllItems();
        }

        function PurchCancelFailed(response) {
            Notification.error(response.data);
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        function initValues() {

            apiService.get('/api/purchase/GetLatestPurchNo/', null,
            getPurchNoComplete,
            null);
        }


        function getPurchNoComplete(response) {

            $scope.purchase.Purch_No = response.data;
            $scope.purchase.Purch_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.mode = 'new';
        }

        function QtyCheck() {

            if ($scope.assetRegister.Ast_Qty == undefined || $scope.assetRegister.Ast_Qty == 0) {
                $scope.assetRegister.Ast_Qty = 1;
                valueCalc();
                return;
            }

            if ($scope.assetRegister.Ast_Thru_Purch == true && $scope.purchaseQty != '') {
                if ($scope.assetRegister.Ast_Qty > $scope.purchaseQty) {
                    Notification.error('Purchase Qty must be less than or equal to P.O Balance Qty:' + $scope.purchaseQty);
                    $scope.assetRegister.Ast_Qty = 1;
                    valueCalc();
                    return;
                }
            }
            valueCalc();
        }

        function valueCalc() {
            var tot = $scope.assetRegister.Ast_Qty * $scope.assetRegister.Ast_Purch_Rate;
            $scope.assetRegister.Ast_Purch_Value = tot - (tot * $scope.assetRegister.Ast_PurchDisc_Perc / 100);

        }

        $scope.headerSuppliers = [

            { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
            { title: 'Add', property: 'ADDRESS1', show: false }
        ]

        $scope.supplierEventHandler = function (response) {
            $scope.$apply(function () {
                $scope.item.ADDRESS1 = response[2];
            });
        }

        $scope.loadSupplier = {
            method: 'get',
            read: serviceBase + '/api/suppliers/list',
            params: ''
        }

        function createPurchase() {
            $scope.purchase.Sup_Cd = $scope.item.AC_CD;
            $scope.purchase.Sup_Name = $scope.item.AC_DESC;
            $scope.purchase.Sup_Add1 = $scope.item.ADDRESS1;
            $scope.purchase.Asv_Acq_Dt = $scope.assetRegister.Asv_Acq_Dt;
            $scope.purchase.Usr_id = $scope.repository.loggedUser.username;
            $scope.assetRegister.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Purch_Dt));
            $scope.assetRegister.Ast_Warranty_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Warranty_Dt));
            if ($scope.assetRegister.Ast_LastInst_DueDt != undefined)
                $scope.assetRegister.Ast_LastInst_DueDt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_LastInst_DueDt));
            $scope.purchase.Asv_Acq_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Asv_Acq_Dt));
            $scope.purchase.assetDetails = $scope.assetRegister;
            $scope.purchase.AssetItem = $scope.assetRegister.list;
            $scope.updatePurch.Apod_Purch_Qty = $scope.assetRegister.Ast_Qty;//upadate purch
            if ($scope.assetRegister.list.length != $scope.assetRegister.Ast_Qty) {
                Notification.error('Allocation should be equal to purchase quantity');
                return;
            }

            $scope.purchase.Purch_Dt = angular.copy(commonFunctions.formatDate($scope.purchase.Purch_Dt));
            apiService.post('/api/purchase/add/', $scope.purchase,
            createPurchaseCompleted,
            createPurchaseFailed);

        }

        function createPurchaseCompleted(response) {
            Notification.success('Purchase Details has been added');

            if ($scope.assetRegister.Ast_Thru_Purch == true && $scope.purchaseQty != '')
                apiService.post('/api/purchaseOrder/updatePurchOrder/', $scope.updatePurch,
              null,
              null);

            $rootScope.InvokeFileUpload();
            $scope.purchase = {};
            $scope.assetRegister = {};
            clearAllItems();
            $location.url('/transactions/purchase');

        }

        function updatePurchaseOrder() {

            apiService.post('/api/purchase/upadtePurchOrder/', $scope.updatePurch,
             null,
             null);

        }

        function createPurchaseFailed(response) {
            Notification.error(response.data);
            $scope.purchase = {};
            $scope.assetRegister = {};
            clearAllItems();
            $location.url('/transactions/purchase');

        }

        function getPendingPOSingle(Id, apoNo) {
            $scope.updatePurch.Id = Id;
            var config = {
                params: {
                    Id: Id,
                    apoNo: apoNo
                }
            };
            apiService.get('/api/purchase/getPOSingle/', config, successPendingPO, failurePendingPO);
        }

        function successPendingPO(result) {

            var d = result.data;
            if (d == null) return;
            $scope.purchase.Purch_PO_Ref = angular.copy(d.PORef);
            $scope.purchase.Purch_Ref = angular.copy(d.InvoiceRef);
            $scope.assetRegister.Ast_Name = angular.copy(d.AssetName);
            $scope.purchaseQty = angular.copy(d.Qty);
            $scope.assetRegister.Ast_Qty = angular.copy(d.Qty);
            $scope.assetRegister.Ast_Purch_Rate = angular.copy(d.Rate);
            $scope.assetRegister.Ast_PurchDisc_Perc = angular.copy(d.DiscPer);
            $scope.assetRegister.Ast_Purch_Value = angular.copy(d.NetAmt);
            $scope.assetRegister.Ast_Warranty_Info = angular.copy(d.warranty);
            $scope.assetRegister.Ast_Components = angular.copy(d.components);
            $scope.assetRegister.Ast_Desc = angular.copy(d.description);
            $scope.assetRegister.purchaseQty = angular.copy(d.Qty);
            $scope.assetRegister.Ast_Po_Ref = $scope.purchase.Purch_PO_Ref;
            $scope.assetRegister.Ast_Purch_Ref = $scope.purchase.Purch_Ref;
            valueCalc();
        }

        function failurePendingPO(response) {
            Notification.error(response);
        }

        function loadAsseRegister() {
            $rootScope.assetRegister.Sup_Cd = $scope.item.AC_CD;
            $rootScope.assetRegister.Sup_Name = $scope.item.AC_DESC;
            $rootScope.assetRegister.Sup_Add1 = $scope.item.ADDRESS1;

            $scope.assetRegister.Sup_Cd = $scope.item.AC_CD;
            $scope.assetRegister.Sup_Name = $scope.item.AC_DESC;
            $scope.assetRegister.Sup_Add1 = $scope.item.ADDRESS1;


            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/purchase/purchase.assetRegister.html',
                controller: 'purchase.asset.admin.assetRegister.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false,
                windowClass: 'app-modal-window'
            }).result.then(function ($scope) {
            }, function () {
            });

        }

    }

})(angular.module('AssetAdminApp'));