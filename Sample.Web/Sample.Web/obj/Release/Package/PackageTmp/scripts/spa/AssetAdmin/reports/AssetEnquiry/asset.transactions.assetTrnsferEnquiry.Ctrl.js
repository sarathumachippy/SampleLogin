(function (app) {
    "use strict";
    app.controller("asset.transactions.assetTransferEnquiry.Ctrl", assetTrnsferEnquiryCtrl);
    assetTrnsferEnquiryCtrl.$inject = ['$modal', '$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants', 'commonFunctions'];

    function assetTrnsferEnquiryCtrl($modal, $scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants, commonFunctions) {
        $scope.loadDepartment = {};
        $scope.GetTranfNo = GetTranfNo;
        $scope.clearAllItems = clearAllItems;
        $scope.clearItem = clearItem;
        $scope.SaveTransfer = SaveTransfer;
        $scope.showTrnasferRecords = showTrnasferRecords;
        $rootScope.fillTransferData = fillTransferData;
        $scope.UpdateTransfer = UpdateTransfer;
        $scope.item = {};
        $scope.tran = {};
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        var serviceBase = constants.apiServiceBaseUri;
        $scope.getassetList = getassetList;
        $scope.datepicker = {};
        $scope.openDatePicker = openDatePicker;
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;

        };

        function showTrnasferRecords() {
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/AssetTransfer/assetTransferList.html',
                controller: 'asset.transactions.assetTransfer.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }


        function fillTransferData(Id) {
            apiService.get('/api/assetTransfer/GetSingleId/' + Id, null,
            getSinglePurchaseCompleted,
            getSinglePurchaseFailed);

        }

        function getSinglePurchaseCompleted(response) {


            clearAll();
            apiService.get('/api/assetTransfer/GetDetails/' + response.data.AssetTranH.Ast_Id, null,
            getDepartmentComplete,
            getDepartmentFailed);

            $scope.item = response.data.AssetTranH;
            $scope.item.AstItm_Trn_Dt = $filter('date')(new Date(response.data.AssetTranH.AstItm_Trn_Dt), 'dd-MM-yyyy');
            $scope.detailsLst = response.data.ItemList;
            $scope.assetTrf = response.data.AssetItemList;
            $scope.mode = 'edit';
        }

        function getSinglePurchaseFailed(response) {

            Notification.error('Unable to retrive the details.Please try again later');
             
        }

        function getassetList() {


            $scope.items = {};
            $scope.detailsLst = [];

            if ($scope.assetLoc == undefined) return;
            if ($scope.assetDepartment == undefined) return;

             
            apiService.get('/api/assetTransfer/GetAssetList/' + $scope.item.Ast_Id + "/" + $scope.assetLoc.OldLoc_Cd + "/" +
                $scope.assetDepartment.OldDept_Cd + "/"
                , null,
           getassetListComplete,
           getassetListFailed);


        }


        function getassetListComplete(response) {
            $scope.detailsLst = response.data;
        }


        function getassetListFailed() {

        }

        //
        function UpdateTransfer() {

            if ($scope.items == undefined || $scope.items.length == 0 || $scope.detailsLst == undefined ||
                $scope.detailsLst == null || $scope.detailsLst.length == 0) {
                Notification.error('Please fill the department and locations Details...');
                return;
            }
            $scope.tran.Usr_Id = $scope.repository.loggedUser.username;
            $scope.item.AstItm_Trn_Dt = angular.copy(commonFunctions.formatDate($scope.item.AstItm_Trn_Dt));
            $scope.tran.AssetTranH = $scope.item;
            $scope.tran.ItemList = $scope.detailsLst;
            $scope.tran.AssetItemList = $scope.assetTrf;
            apiService.post('/api/assetTransfer/update/', $scope.tran,
            UpdateTransferCompleted,
            UpadteTransferFailed);

        }


        function UpdateTransferCompleted() {
            Notification.success('Transfer No ' + $scope.item.AstItm_Trn_No + ' has been Updated');
            $scope.tran = {};

            clearAllItems();
        }

        function UpadteTransferFailed() {
            Notification.error(response.data);
        }


        function GetTranfNo() {

            apiService.get('/api/assetTransfer/GetNewTranferNo/', null,
             getTranNoComplete,
             null);


        }

        function getTranNoComplete(result) {

            apiService.get('/api/assetTransfer/GetDetails/' + $rootScope.astId, null,
            getDepartmentComplete,
            getDepartmentFailed);
            $scope.item.Ast_Id = $rootScope.astId;
            $scope.item.Ast_Name = $rootScope.assetName;

            $scope.item.AstItm_Trn_No = result.data;
            $scope.item.AstItm_Trn_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.mode = 'new';
        }

        $scope.assetTransferEvent = function (response) {
            $scope.assetTrf = {};
            $scope.items = {};
            $scope.detailsLst = [];
            apiService.get('/api/assetTransfer/GetDetails/' + response[0], null,
            getDepartmentComplete,
            getDepartmentFailed);

        }

        function getDepartmentComplete(response) {
             
            $scope.department = response.data.DepartmentList;
            $scope.loacation = response.data.LocationList;
        }

        function getDepartmentFailed() {
        }


        $scope.addUpdateItem = function () {


            if ($scope.items != undefined && $scope.items.Ds_Id != undefined) {
                if ($scope.transMode == 'update') {
                    $scope.detailsLst[$scope.activeIndex].Ast_SlNo = $scope.items.Ast_SlNo;
                    $scope.detailsLst[$scope.activeIndex].Ds_Id = $scope.items.Ds_Id;
                    $scope.detailsLst[$scope.activeIndex].Dept_Name = $scope.items.Dept_Name;
                    $scope.detailsLst[$scope.activeIndex].Asset_Desc = $scope.items.Asset_Desc;
                    $scope.detailsLst[$scope.activeIndex].Loc_Cd = $scope.items.Loc_Cd;
                    $scope.detailsLst[$scope.activeIndex].Loc_Name = $scope.items.Loc_Name;
                    $scope.detailsLst[$scope.activeIndex].Emp_Cd = $scope.items.Emp_Cd;
                    $scope.detailsLst[$scope.activeIndex].Emp_Name = $scope.items.Emp_Name;
                    $scope.detailsLst[$scope.activeIndex].CustLoc_Cd = $scope.items.CustLoc_Cd;
                    $scope.detailsLst[$scope.activeIndex].CustLoc_Name = $scope.items.CustLoc_Name;
                    $scope.detailsLst[$scope.activeIndex].ID = $scope.items.ID;
                    $scope.detailsLst[$scope.activeIndex].Ast_Uniq_Id = $scope.items.Ast_Uniq_Id;
                    $scope.detailsLst[$scope.activeIndex].flag = 'U';
                    $scope.clearItemLst();

                }
                else {
                    if ($scope.detailsLst === undefined) $scope.detailsLst = [];

                    for (var i = 0; i < $scope.detailsLst.length; i++) {

                        if ($scope.detailsLst[i].Ast_SlNo == $scope.assetTrf.Ast_SlNo &&
                           $scope.detailsLst[i].Ast_Item_Ctr == $scope.assetTrf.Ast_Item_Ctr) {
                            Notification.error('Duplicate item cannot be added!!');
                            return;
                        }

                    }

                    $scope.items.flag = 'A';

                    if ($scope.items.ID == undefined) {
                        Notification.error('Record is not found!!!');
                        $scope.items = {};
                        return;
                    }

                    $scope.items.OldDept_Cd = $scope.assetTrf.OldDept_Cd;
                    $scope.items.OldLoc_Cd = $scope.assetTrf.OldLoc_Cd;

                    $scope.detailsLst.push(angular.copy($scope.items));
                    $scope.clearItemLst();

                }
            }
            else {
                Notification.error('Please enter the details');
                return;
            }
        }

        $scope.clearItemLst = function () {
            $scope.transMode = 'add';
            $scope.items = {};
        }

        function clearItem() {
            $scope.mode = 'new';
            $scope.items = {};
        }


        $scope.updateItem = function (items, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.items = angular.copy(items);

        }

        $scope.deleteitem = function (items, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'delete';
            $scope.detailsLst.splice(index, 1);

        }

        function SaveTransfer() {
            if ($scope.items == undefined || $scope.items.length == 0 || $scope.detailsLst == undefined ||
                $scope.detailsLst == null || $scope.detailsLst.length == 0) {
                Notification.error('Please fill the department and locations Details...');
                return;
            }
            $scope.tran.AssetItemList = {};
            $scope.tran.Usr_Id = $scope.repository.loggedUser.username;
            $scope.item.AstItm_Trn_Dt = angular.copy(commonFunctions.formatDate($scope.item.AstItm_Trn_Dt));
            $scope.tran.AssetTranH = $scope.item;
            $scope.tran.ItemList = $scope.detailsLst;
            $scope.tran.AssetItemList.OldLoc_Cd = $scope.assetLoc.OldLoc_Cd;//assetLoc.OldLoc_Cd
            $scope.tran.AssetItemList.OldDept_Cd = $scope.assetDepartment.OldDept_Cd;//assetLoc.OldLoc_Cd
            apiService.post('/api/assetTransfer/add/', $scope.tran,
            SaveTransferCompleted,
            SaveTransferFailed);

        }

        function SaveTransferCompleted(response) {
            Notification.success('Transfer No ' + $scope.item.AstItm_Trn_No + ' has been Updated');
            $scope.tran = {};

            clearAllItems();
        }

        function SaveTransferFailed(response) {
            Notification.error(response.data);
        }

        function clearAllItems() {
            $scope.item = {};
            $scope.detailsLst = [];
            $scope.items = {};
            $scope.assetTrf = {};
            $scope.department = {};
            $scope.transMode = 'add';
            GetTranfNo();
            $location.url('/reports/assetEnquiry');
        }


        function clearAll() {
            $scope.item = {};
            $scope.detailsLst = [];
            $scope.items = {};
            $scope.assetTrf = {};
            $scope.department = {};
            // GetTranfNo();
            // $location.url('/transactions/assetTransfer');
        }



        $scope.headerAssetId = [
           { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadAssetId = {
            method: 'get',
            read: serviceBase + '/api/assetTransfer/GetAsset',
            params: ''
        }

        $scope.headerDepartment = [
          { title: 'Id', property: 'Dept_Cd', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Dept_Name', show: true, width: '300px', type: 'value' },
        ]



        $scope.loadDepartment = {
            method: 'get',
            read: serviceBase + '/api/departments/list',
            params: ''
        }


        $scope.headerLocation = [
            { title: 'Id', property: 'Loc_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Loc_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadLocation = {
            method: 'get',
            read: serviceBase + '/api/locations/list',
            params: ''
        }



        $scope.headerEmployee = [
           { title: 'Id', property: 'Emp_Cd', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Emp_Name', show: true, width: '200px', type: 'value' }
        ]

        $scope.loadEmployee = {
            method: 'get',
            read: serviceBase + '/api/employees/list',
            params: ''
        }

        $scope.headerCustLocation = [
         { title: 'Id', property: 'CustLoc_Cd', show: true, width: '100px', type: 'text' },
         { title: 'Name', property: 'CustLoc_Name', show: true, width: '200px', type: 'value' }
        ]

        $scope.loadCustLocation = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/custloctran/list',
            params: ''
        }


    }

})(angular.module('AssetAdminApp'));
