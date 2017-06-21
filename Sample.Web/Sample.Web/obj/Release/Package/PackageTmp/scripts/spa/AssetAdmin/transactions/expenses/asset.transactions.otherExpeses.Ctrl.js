(function (app) {
    "use strict";
    app.controller("asset.transactions.otherExpense.Ctrl", otherExpenseCtrl);
    otherExpenseCtrl.$inject = ['$modal', '$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants', 'commonFunctions'];

    function otherExpenseCtrl($modal, $scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants, commonFunctions) {

        $scope.initLoad = initLoad;
        $scope.addUpdateItem = addUpdateItem;
        $scope.calAmount = calAmount;
        $scope.expense = {};
        $scope.item = {};
        $scope.saveCons = saveCons;
        $scope.clearAllItems = clearAllItems;
        $scope.showPrevRecords = showPrevRecords;
        $rootScope.fillPOData = fillPOData;
        $scope.updateCons = updateCons;
        $scope.expense.Doc_Type = 'OTH';
        $scope.mode = 'new';
        $scope.clearItem = clearItem;

        function initLoad() {
            apiService.get('/api/expenses/getDocNo/' + "'OTH'", null,
             getDocNoComplete,
             null);

        }

        function getDocNoComplete(response) {
            $scope.expense.Cons_DocNo = response.data;
            $scope.expense.Cons_DocDt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.expense.Cons_DateFrm = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.expense.Cons_DateTo = $filter('date')(new Date(), 'dd-MM-yyyy');

            $scope.mode = 'new';
            $scope.expense.Cons_PayType = '0';
        }

        function addUpdateItem() {

            if ($scope.transMode == 'update') {

                if ($scope.item.AssetID == undefined || $scope.item.AssetID == "") {
                    Notification.error("Asset id cant be blank!");
                    return;
                }

                if ($scope.item.Ast_Uniq_Id == undefined || $scope.item.Ast_Uniq_Id == "") {
                    Notification.error("Asset uniqid cant be blank!");
                    return;
                }

                $scope.itemLst[$scope.activeIndex].AssetID = $scope.item.AssetID;
                $scope.itemLst[$scope.activeIndex].Ast_Name = $scope.item.Ast_Name;

                if (angular.isUndefined($scope.assetId.Ast_Uniq_Id))
                    $scope.itemLst[$scope.activeIndex].Ast_Uniq_Id = $scope.item.Ast_Uniq_Id.trim();
                else
                    $scope.itemLst[$scope.activeIndex].Ast_Uniq_Id = $scope.assetId.Ast_Uniq_Id.trim();
                $scope.itemLst[$scope.activeIndex].Con_Amount = $scope.item.Con_Amount;
                $scope.itemLst[$scope.activeIndex].Remarks = $scope.item.Remarks;
                $scope.itemLst[$scope.activeIndex].Doc_Type = 'OTH';
                $scope.itemLst[$scope.activeIndex].flag = 'U';
                totAmount($scope.itemLst);
                clearItem();
            }
            else {
                if ($scope.itemLst === undefined) $scope.itemLst = [];

                if ($scope.item.AssetID === undefined) {
                    Notification.error("Blank item cant be added");
                    return "";
                }

                if ($scope.assetId == undefined || $scope.assetId.Ast_Uniq_Id == undefined) {
                    Notification.error("Please select Asset Uniq Id");
                    return "";

                }
                $scope.item.Ast_Uniq_Id = $scope.assetId.Ast_Uniq_Id.trim();

                if ($scope.item.Ast_Uniq_Id == undefined) {
                    Notification.error("Please select Asset Uniq Id");
                    return "";
                }

                var i = 0;
                for (i = 0; i < $scope.itemLst.length; i++) {
                    if ($scope.item.AssetID === $scope.itemLst[i].AssetID &&
                        $scope.item.Ast_Uniq_Id === $scope.itemLst[i].Ast_Uniq_Id) {
                        Notification.error("Duplicate item cant be added");
                        return "";
                    }
                }
                $scope.item.Doc_Type = 'OTH';
                $scope.itemLst.push(angular.copy($scope.item));
                totAmount($scope.itemLst);
                clearItem();
            }
        }

        function calAmount() {

            if ($scope.item.Con_qty == undefined || $scope.item.Con_Rate == undefined)
                $scope.item.Con_Amount = 0;
            else {

                $scope.item.Con_Amount = $scope.item.Con_qty * $scope.item.Con_Rate;
            }

        }

        function showPrevRecords() {
            $rootScope.docType = 'OTH';
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/expenses/consumptionList.html',
                controller: 'asset.transactions.consumption.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function fillPOData(id) {

            var docType = {
                params: {
                    docType: 'OTH',
                    id: id
                }
            };

            // apiService.get('/api/expenses/GetSingleId/' + id, null,
            apiService.get('/api/expenses/GetSingleId/', docType,
            getSinglePurchaseCompleted,
            getSinglePurchaseFailed);

        }

        function getSinglePurchaseCompleted(response) {

            $scope.expense = {};
            $scope.sup = {};
            $scope.expense = response.data;
            $scope.sup.AC_CD = response.data.Cons_SupCd;
            $scope.expense.Cons_DocDt = $filter('date')(response.data.Cons_DocDt, 'dd-MM-yyyy');
            $scope.expense.Cons_DateFrm = $filter('date')(response.data.Cons_DateFrm, 'dd-MM-yyyy');
            $scope.expense.Cons_DateTo = $filter('date')(response.data.Cons_DateTo, 'dd-MM-yyyy');
            $scope.itemLst = response.data.ConsumptionDetails;

            $scope.mode = 'edit';
        }

        function getSinglePurchaseFailed(response) {

            Notification.error('Unable to retrive the details.Please try again later');
            console.log(response)
        }

        function totAmount(itemLst) {
            var total = 0;
            for (var i = 0; i < itemLst.length; i++) {
                total = parseInt(itemLst[i].Con_Amount) + total;

            }
            $scope.expense.Cons_TotAmount = total;
        }


        $scope.updateItem = function (items, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.item = angular.copy(items);
            totAmount($scope.itemLst);
            apiService.get('/api/expenses/GetAssetUniqId/' + $scope.item.AssetID, null,
             getAssetUniqIdComplete,
             getAssetUniqIdFailed);

        }

        $scope.deleteitem = function (items, index) {
            $scope.activeIndex = index;
            $scope.itemLst.splice(index, 1);
            totAmount($scope.itemLst);
        }

        function saveCons() {

            if ($scope.itemLst == undefined || $scope.itemLst.length == 0) {
                Notification.error('Please enter the details');
                return;
            }
            $scope.expense.Doc_Type = 'OTH';
            $scope.expense.Usr_id = $scope.repository.loggedUser.username;
            $scope.expense.Cons_DocDt = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DocDt));
            $scope.expense.Cons_DateFrm = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DateFrm));
            $scope.expense.Cons_DateTo = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DateTo));
            $scope.expense.ConsumptionDetails = $scope.itemLst;
            apiService.post('/api/expenses/add/', $scope.expense,
            saveConsCompleted,
            saveConsFailed);

        }

        function saveConsCompleted() {
            Notification.success("expense has been successfully saved");
            clearAllItems();
        }
        function saveConsFailed(response) {
            Notification.error(response.data);
            // clearAllItems();
        }


        function updateCons() {


            if ($scope.itemLst == undefined || $scope.itemLst.length == 0) {
                Notification.error('Please enter the details');
                return;
            }
            $scope.expense.Doc_Type = 'OTH';
            $scope.expense.Usr_id = $scope.repository.loggedUser.username;
            $scope.expense.Cons_DocDt = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DocDt));
            $scope.expense.Cons_DateFrm = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DateFrm));
            $scope.expense.Cons_DateTo = angular.copy(commonFunctions.formatDate($scope.expense.Cons_DateTo));
            $scope.expense.ConsumptionDetails = $scope.itemLst;
            apiService.post('/api/expenses/update/', $scope.expense,
            updateConsCompleted,
            updateConsFailed);

        }


        function updateConsCompleted() {
            Notification.success("Expense has been successfully Updated");
            clearAllItems();
        }
        function updateConsFailed(response) {
            Notification.error(response.data);
            // clearAllItems();
        }



        function clearAllItems() {
            $scope.item = {};
            $scope.expense = {};
            $scope.itemLst = [];
            $scope.sup = {};
            initLoad
            $scope.assetId = {};
            $scope.transMode = 'Add'
        }

        function clearItem() {
            $scope.transMode = 'Add'
            $scope.item = {};
            $scope.uniqId = {};
            $scope.assetId = {};
        }


        $scope.headerSuppliers = [

           { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
           { title: 'Add', property: 'ADDRESS1', show: false }
        ]

        $scope.loadSupplier = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/suppliers/list',
            params: ''
        }

        $scope.headerAssetId = [
          { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' },
          { title: 'UniqueId', property: 'Ast_Uniq_Id', show: false }
        ]


        $scope.astEventHandler = function (response) {
            $scope.$apply(function () {
                apiService.get('/api/expenses/GetAssetUniqId/' + response[0], null,
             getAssetUniqIdComplete,
             getAssetUniqIdFailed);

            });
        }



        function getAssetUniqIdComplete(response) {

            $scope.uniqId = response.data;

            var assetid = $scope.item.Ast_Uniq_Id;

            for (var i = 0; i < $scope.uniqId.length; i++) {

                if ($scope.uniqId[i].Ast_Uniq_Id == assetid) {
                    $scope.uniqId[i].selected = true;
                }
                else
                    $scope.uniqId[i].selected = false;
            }

        }

        function getAssetUniqIdFailed(response) {

        }



        $scope.loadAssetId = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/expenses/getAssetItem',
            params: ''
        }

        function getAssetDetailsComplete(response) {
            $scope.assetList = response.data;
        }

        function getAssetDetailsFailed(response) {
            //failed notifications
        }
    }

})(angular.module('AssetAdminApp'));
