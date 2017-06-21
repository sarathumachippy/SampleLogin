(function (app) {
    "use strict";
    app.controller("asset.transactions.writeOff.Ctrl", writeOffCtrl);
    writeOffCtrl.$inject = ['$modal', '$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants', 'commonFunctions'];

    function writeOffCtrl($modal, $scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants, commonFunctions) {

        $scope.GetTrNo = GetTrNo;
        $scope.writeOff = {};
        $scope.ValueTran = {};
        $scope.addUpdateItem = addUpdateItem;
        $scope.saveWriteOff = saveWriteOff;
        $rootScope.fillWriteOffData = fillWriteOffData
        $scope.clearItem = clearItem;
        $scope.clearAllItems = clearAllItems;
        $scope.depreciationMonthDiff = '0';
        $scope.purchRate = '';
        $scope.checkAssetId = checkAssetId;
        $scope.showWriteOffRecords = showWriteOffRecords;
        function GetTrNo() {
            $scope.mode = 'new';
            apiService.get('/api/writeoff/GetLatestTrNo', null,
            getLatestTrNoCompleted,
            getLatestTrNoFailed);
            $scope.ValueTran.AsvTr_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.ValueTran.Ast_Id = '';
        }

        function fillWriteOffData(Id, assetId) {
            $scope.ValueTran.Ast_Id = assetId;
            $scope.ValueTran.AsvTr_No = Id;
            apiService.get('/api/writeoff/GetSingle/' + Id, null,
            fillDataComplete,
            fillDataFailed);
        }

        function fillDataComplete(response) {
            $scope.writeOff = response.data.writeOff;
            $scope.itemList = response.data.ItemList;
            $scope.item = {};
            $scope.itemLst = [];
            $scope.writeOff.Ast_Purch_Dt = $filter('date')(response.data.writeOff.Ast_Purch_Dt, 'dd-MM-yyyy');
            $scope.mode = 'edit';
        }


        function fillDataFailed()
        { }

        function showWriteOffRecords() {

            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/writeOff/writeOffList.html',
                controller: 'asset.transactions.writeOff.list.Ctrl',
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

        $scope.writeOffEvent = function (response) {
            apiService.get('/api/writeoff/GetDetails/' + response[0], null,
            getDetailsComplete,
            getDetailsFailed);

        }

        function getDetailsComplete(response) {

            $scope.writeOff = response.data.writeOff;
            $scope.itemList = response.data.ItemList;
            $scope.depreciationMonthDiff = response.data.MonthDiff;
            $scope.purchRate = $scope.writeOff.Ast_Purch_Rate;
            $scope.item = {};
            $scope.itemLst = [];
            $scope.writeOff.Ast_Purch_Dt = $filter('date')(response.data.writeOff.Ast_Purch_Dt, 'dd-MM-yyyy');

        }

        function getDetailsFailed() {
        }

        function addUpdateItem() {

            if ($scope.itemLst === undefined) $scope.itemLst = [];
            if ($scope.items.Ast_SlNo === undefined) {
                Notification.error("Blank item cant be added");
                return "";
            }
            var i = 0;
            for (i = 0; i < $scope.itemLst.length; i++) {
                if ($scope.items.Ast_SlNo === $scope.itemLst[i].Ast_SlNo) {
                    Notification.error("Duplicate item cant be added");
                    return "";
                }
            }
            $scope.itemLst.push(angular.copy($scope.items));
            if ($scope.depreciationMonthDiff != 0)
                $scope.writeOff.AsvTr_Dep_Value = ($scope.purchRate * $scope.itemLst.length / $scope.writeOff.Ast_UsefulLife) / $scope.depreciationMonthDiff;
            else
                $scope.writeOff.AsvTr_Dep_Value = 0.000;
            $scope.writeOff.Ast_Purch_Rate = $scope.purchRate * $scope.itemLst.length;
            clearItem();
        }

        $scope.updateItem = function (item, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.items = angular.copy(item);

        }

        $scope.deleteitem = function (items, index) {
            $scope.activeIndex = index;
            $scope.itemLst.splice(index, 1);

            if ($scope.depreciationMonthDiff != 0)
                $scope.writeOff.AsvTr_Dep_Value = ($scope.purchRate * $scope.itemLst.length / $scope.writeOff.Ast_UsefulLife) / $scope.depreciationMonthDiff;
            else
                $scope.writeOff.AsvTr_Dep_Value = 0.000;
            $scope.writeOff.Ast_Purch_Rate = $scope.purchRate * $scope.itemLst.length;

        }

        function clearItem() {
            // $scope.item = {};
            $scope.items = {};
        }

        function clearAllItems() {
            $scope.itemList = {};
            $scope.item = {};
            $scope.items = {};
            $scope.itemLst = [];
            $scope.ValueTran = {};
            $scope.writeOff = {};
            GetTrNo();
        }

        function saveWriteOff() {

            if ($scope.itemLst.length == 0) {
                Notification.error("Please select item details");
                return;
            }

            if ($scope.ValueTran == undefined || $scope.ValueTran.Ast_Id == undefined || $scope.ValueTran.Ast_Id == '') {

                Notification.error('Please select asset Id');
                return;
            }

            $scope.SaveWriteOff = {};
            $scope.SaveWriteOff.writeOff = $scope.writeOff;
            $scope.ValueTran.AsvTr_Dt = angular.copy(commonFunctions.formatDate($scope.ValueTran.AsvTr_Dt));
            $scope.SaveWriteOff.ValueTran = $scope.ValueTran;
            $scope.SaveWriteOff.ItemList = $scope.itemLst;
            $scope.SaveWriteOff.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.writeOff.Ast_Purch_Dt));
            apiService.post('/api/writeoff/add/', $scope.SaveWriteOff,
            saveWriteOffCompleted,
            saveWriteOffFailed);

        }

        function saveWriteOffCompleted(response) {
            Notification.success("Write off has been completed");
            clearAllItems();
        }

        function saveWriteOffFailed(response) {
            Notification.error(response.data);
            clearAllItems();
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
                clearAllItems();
                Notification.error('Please enter proper asset Id')
            }
        }
        function checkAssetIdFailed() { }


        $scope.headerAssetId = [
           { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadAssetId = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assetTransfer/GetAsset',
            params: ''
        }


    }

})(angular.module('AssetAdminApp'));
