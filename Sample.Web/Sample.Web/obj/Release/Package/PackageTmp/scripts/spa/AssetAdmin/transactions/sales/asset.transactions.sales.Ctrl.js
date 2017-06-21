(function (app) {
    "use strict";
    app.controller("asset.transactions.sales.Ctrl", salesCtrl);
    salesCtrl.$inject = ['$modal', '$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants', 'commonFunctions'];

    function salesCtrl($modal, $scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants, commonFunctions) {

        $scope.GetTrNo = GetTrNo;
        $scope.sales = {};
        $scope.ValueTran = {};
        $scope.addUpdateItem = addUpdateItem;
        $scope.saveSales = saveSales;
        $rootScope.fillSalesData = fillSalesData;
        $scope.clearItem = clearItem;
        $scope.clearAllItems = clearAllItems;
        $scope.showSalesRecords = showSalesRecords;
        $scope.depreciationMonthDiff = '0';
        $scope.checkAssetId = checkAssetId;
        $scope.purchRate = '';

        $scope.SelectCtrl = SelectCtrl;

        function SelectCtrl() {

            var a = $scope.ctrolObj;
        }

        $scope.CheckCustomer = CheckCustomer;
        var serviceBase = constants.apiServiceBaseUri;
        function GetTrNo() {
            $scope.mode = 'new';
            apiService.get('/api/sales/GetLatestTrNo', null,
            getLatestTrNoCompleted,
            getLatestTrNoFailed);
            $scope.ValueTran.AsvTr_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
        }

        function fillSalesData(Id, assetId) {
            $scope.ValueTran.Ast_Id = assetId;
            $scope.ValueTran.AsvTr_No = Id;
            apiService.get('/api/sales/GetSingle/' + Id, null,
             fillDataComplete,
             fillDataFailed);

        }

        function fillDataComplete(response) {
            $scope.sales = response.data.sales;
            $scope.itemList = response.data.ItemList;
            $scope.ValueTran = response.data.ValueTran;
            $scope.item = {};
            $scope.itemLst = [];
            $scope.sales.Ast_Purch_Dt = $filter('date')($scope.sales.Ast_Purch_Dt, 'dd-MM-yyyy');
            $scope.ValueTran.AsvTr_Dt = $filter('date')($scope.ValueTran.AsvTr_Dt, 'dd-MM-yyyy');
            $scope.mode = 'edit';
        }


        function fillDataFailed()
        { }

        function showSalesRecords() {

            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/sales/salesList.html',
                controller: 'asset.transactions.sales.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function getLatestTrNoCompleted(response) {
            $scope.ValueTran.AsvTr_No = response.data;

        }

        function getLatestTrNoFailed() {
            $scope.ValueTran.AsvTr_No = 'New Doc Number';
        }

        $scope.salesEvent = function (response) {
            apiService.get('/api/sales/GetDetails/' + response[0], null,
            getDetailsComplete,
            getDetailsFailed);

        }

        function getDetailsComplete(response) {
            $scope.sales = {};
            $scope.sales = response.data.sales;
            $scope.itemList = response.data.ItemList;
            $scope.depreciationMonthDiff = response.data.MonthDiff;
            $scope.purchRate = $scope.sales.Ast_Purch_Rate;
            $scope.ValueTran.AsvTr_Rate = $scope.sales.Ast_Purch_Rate;
            $scope.item = {};
            $scope.itemLst = [];

            $scope.sales.Ast_Purch_Dt = $filter('date')($scope.sales.Ast_Purch_Dt, 'dd-MM-yyyy');
        }

        function getDetailsFailed(response) {

        }

        $scope.updateItem = function (item, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';

            $scope.item = angular.copy(item);

        }

        function addUpdateItem() {

            if ($scope.itemLst === undefined) $scope.itemLst = [];
            if ($scope.item.Ast_SlNo === undefined) {
                Notification.error("Blank item cant be added");
                return "";
            }
            var i = 0;
            for (i = 0; i < $scope.itemLst.length; i++) {
                if ($scope.item.Ast_SlNo === $scope.itemLst[i].Ast_SlNo) {
                    Notification.error("Duplicate item cant be added");
                    return "";
                }
            }
            $scope.itemLst.push(angular.copy($scope.item));

            if ($scope.depreciationMonthDiff != 0)
                $scope.ValueTran.AsvTr_Dep_Value = ($scope.purchRate * $scope.itemLst.length / $scope.sales.Ast_UsefulLife) / $scope.depreciationMonthDiff;
            else
                $scope.sales.AsvTr_Dep_Value = 0.000;
            $scope.sales.Ast_Purch_Rate = $scope.purchRate * $scope.itemLst.length;

            clearItem();
        }


        $scope.deleteitem = function (items, index) {
            $scope.activeIndex = index;
            $scope.itemLst.splice(index, 1);

            if ($scope.depreciationMonthDiff != 0)
                $scope.ValueTran.AsvTr_Dep_Value = ($scope.purchRate * $scope.itemLst.length / $scope.sales.Ast_UsefulLife) / $scope.depreciationMonthDiff;
            else
                $scope.sales.AsvTr_Dep_Value = 0.000;
            $scope.sales.Ast_Purch_Rate = $scope.purchRate * $scope.itemLst.length;


        }

        function clearItem() {
            $scope.item = {};

        }

        function clearAllItems() {

            $scope.item = {};
            $scope.items = {};
            $scope.ValueTran = {};
            $scope.sales = {};
            $scope.itemLst = [];
            $scope.itemList = {};
            GetTrNo();
        }

        function saveSales() {
            $scope.SaveSales = {};
            $scope.SaveSales.sales = $scope.sales;
            if ($scope.itemLst.length == 0) {
                Notification.error('Asset item entries not found !');
                return;
            }

            if ($scope.ValueTran.Ast_Id == undefined || $scope.ValueTran.Ast_Id == '') {
                Notification.error('Please enter asset Id ');
                return;
            }

            if ($scope.ValueTran.AsvTr_Party_Cd == undefined || $scope.ValueTran.AsvTr_Party_Cd == '') {
                Notification.error('Please enter supplier code ');
                return;
            }


            $scope.ValueTran.AsvTr_Dt = angular.copy(commonFunctions.formatDate($scope.ValueTran.AsvTr_Dt));
            $scope.sales.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.sales.Ast_Purch_Dt));
            $scope.SaveSales.ValueTran = $scope.ValueTran;
            $scope.SaveSales.ItemList = $scope.itemLst;
            apiService.post('/api/sales/add/', $scope.SaveSales,
            saveSalesCompleted,
            saveSalesFailed);

        }

        function saveSalesCompleted(response) {
            Notification.success("Sales has been completed");
            clearAllItems();
        }

        function saveSalesFailed(response) {
            Notification.error(response.data);
            clearAllItems();
        }



        function checkAssetId(assetId) {
            if (assetId == null) return;
            apiService.get('/api/assetRegister/CheckAssetId/' + assetId, null,
            checkAssetIdComplete,
            checkFailed);

        }

        function checkAssetIdComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.ValueTran.Ast_Id = '';
                $scope.sales.Ast_Name = '';
                Notification.error('Please enter proper asset Id')
            }
        }
        function checkFailed() { }



        function CheckCustomer(CusCd) {
            if (angular.isUndefined(CusCd) || CusCd == '') return;
            apiService.get('/api/customers/CheckCustomer/' + CusCd, null,
            customerComplete,
            checkFailed);

        }

        function customerComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.ValueTran.AsvTr_Party_Cd = '';
                $scope.ValueTran.AsvTr_Party_Name = '';
                $scope.ValueTran.AsvTr_Party_Add1 = '';
                Notification.error('Please enter proper customer code')
            }
        }


        function checkFailed() { }






        $scope.headerAssetId = [
           { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadAssetId = {
            method: 'get',
            read: serviceBase + '/api/assetTransfer/GetAsset',
            params: ''
        }


        $scope.headerCustomers = [

           { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
           { title: 'Add', property: 'ADDRESS1', show: false }
        ]


        $scope.customerEventHandler = function (response) {
            $scope.$apply(function () {
                $scope.ValueTran.AsvTr_Party_Add1 = response[2];
            });
        }

        $scope.loadCustomer = {
            method: 'get',
            read: serviceBase + '/api/customers/list',
            params: ''
        }

    }

})(angular.module('AssetAdminApp'));
