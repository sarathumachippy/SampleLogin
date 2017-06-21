(function (app) {

    "use strict";

    app.controller('purchaseOrderCtrl', purchaseOrder);
    purchaseOrder.$inject = ['$modal', '$http', '$scope', '$rootScope', '$filter', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants', 'commonFunctions'];

    function purchaseOrder($modal, $http, $scope, $rootScope, $filter, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants, commonFunctions) {

        $scope.clearAllItems = clearAllItems;
        $scope.totAmt = totAmt;
        $scope.items = [];
        $scope.item = {};
        $scope.orderH = {};
        $scope.createPurchaseOrder = createPurchaseOrder;
        $scope.updatePurchaseOrder = updatePurchaseOrder;
        $scope.initValues = initValues;
        $scope.mode = 'new';
        $scope.datepicker = {};
        $scope.openDatePicker = openDatePicker;
        $scope.showPrevRecords = showPrevRecords;
        $rootScope.fillPOData = fillPOData;
        $scope.dateFormat = constants.dateFormat;

        var serviceBase = constants.apiServiceBaseUri;

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        function showPrevRecords() {
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/transactions/purchaseOrder/purchaseOrderList.html',
                controller: 'asset.transactions.purchaseOrder.list.Ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        function initValues() {

            apiService.get('/api/purchaseOrder/GetLatestApoNo/', null,
            getApoNoComplete,
            null);

        }


        function getApoNoComplete(response) {

            $scope.orderH.Apo_No = response.data;
            $scope.orderH.Apo_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
            $scope.mode = 'new';
        }


        function fillPOData(Id) {
            getOrderDetails(Id);

        }

        function getOrderDetails(Id) {
            apiService.get('/api/purchaseOrder/GetSingleId/' + Id, null,
            getSinglePurchaseCompleted,
            getSinglePurchaseFailed);

        }

        function getSinglePurchaseCompleted(response) {
            $scope.items = [];
            $scope.orderH = response.data;
            $scope.item = response.data;
            $scope.item.AC_CD = response.data.Sup_Cd;
            $scope.items = response.data.AssetOrderLst;
            $scope.detailsLst = response.data.AssetDetailsLst;
            $scope.orderH.Apo_Dt = $filter('date')($scope.orderH.Apo_Dt, 'dd-MM-yyyy');
            $scope.mode = 'edit';
        }

        function getSinglePurchaseFailed(response) {

            Notification.error('Unable to retrive the details.Please try again later');
            console.log(response)
        }

        $scope.clearItem = function () {
            $scope.mode = 'new';
            $scope.transMode = 'Add'
            $scope.assetItem = {};
        }

        $scope.addUpdateItem = function () {

            if ($scope.assetItem != undefined && $scope.assetItem.Asset_Name != undefined &&
                $scope.assetItem.Asset_Desc != undefined && $scope.assetItem.Asset_Components != undefined
                && $scope.assetItem.Asset_Warranty_Terms != undefined && $scope.assetItem.Apod_Qty != undefined
                 && $scope.assetItem.Apod_Rate != undefined) {
                if ($scope.transMode == 'update') {

                    $scope.items[$scope.activeIndex].Apo_Row_Type = 'A';
                    $scope.items[$scope.activeIndex].Asset_Name = $scope.assetItem.Asset_Name;
                    $scope.items[$scope.activeIndex].Asset_Desc = $scope.assetItem.Asset_Desc;
                    $scope.items[$scope.activeIndex].Asset_Components = $scope.assetItem.Asset_Components;
                    $scope.items[$scope.activeIndex].Asset_Warranty_Terms = $scope.assetItem.Asset_Warranty_Terms;
                    $scope.items[$scope.activeIndex].Apod_Qty = $scope.assetItem.Apod_Qty;
                    $scope.items[$scope.activeIndex].Apod_Rate = $scope.assetItem.Apod_Rate;
                    $scope.items[$scope.activeIndex].Apod_Disc_Per = $scope.assetItem.Apod_Disc_Per;
                    $scope.items[$scope.activeIndex].Apod_Amt = $scope.assetItem.Apod_Amt;
                    $scope.items[$scope.activeIndex].flag = 'U';
                    $scope.clearItem();
                    summary($scope.items);
                }
                else {
                    if ($scope.items === undefined) $scope.items = [];
                    $scope.assetItem.flag = 'A';
                    $scope.items.push(angular.copy($scope.assetItem));
                    $scope.clearItem();
                    summary($scope.items);
                }
            }
            else {
                Notification.error('Please enter asset details');
            }
        }

        $scope.updateItem = function (assetItem, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.assetItem = angular.copy(assetItem);

        }

        $scope.deleteitem = function (assetItem, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'delete';
            $scope.items.splice(index, 1);
            summary($scope.items);
        }

        //Terms and conditions

        $scope.addUpdateItemLst = function () {

            if ($scope.details != undefined && $scope.details.Asset_Name != undefined) {
                if ($scope.transMode == 'update') {
                    $scope.detailsLst[$scope.activeIndex].Apo_No = $scope.orderH.Apo_No;
                    $scope.detailsLst[$scope.activeIndex].Apo_Row_Type = 'D';
                    $scope.detailsLst[$scope.activeIndex].Asset_Name = $scope.details.Asset_Name;
                    $scope.detailsLst[$scope.activeIndex].Asset_Desc = $scope.details.Asset_Desc;
                    $scope.detailsLst[$scope.activeIndex].Asset_Components = '';
                    $scope.detailsLst[$scope.activeIndex].Asset_Warranty_Terms = '';
                    $scope.detailsLst[$scope.activeIndex].Apod_Qty = 0;
                    $scope.detailsLst[$scope.activeIndex].Apod_Rate = 0;
                    $scope.detailsLst[$scope.activeIndex].Apod_Disc_Per = 0;
                    $scope.detailsLst[$scope.activeIndex].Apod_Amt = 0;
                    $scope.detailsLst[$scope.activeIndex].flag = 'U';
                    $scope.clearItemLst();

                }
                else {
                    if ($scope.detailsLst === undefined) $scope.detailsLst = [];
                    $scope.details.flag = 'D';
                    $scope.detailsLst.push(angular.copy($scope.details));
                    $scope.clearItemLst();

                }
            }
            else {
                Notification.error('Please enter the details');
            }
        }

        $scope.clearItemLst = function () {
            $scope.transMode = 'add';
            $scope.details = {};

        }


        $scope.deleteDetails = function (details, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'delete';
            $scope.detailsLst.splice(index, 1);

        }


        $scope.updateItemLst = function (details, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.details = angular.copy(details);

        }
        //

        function createPurchaseOrder(orderH) {
            if ($scope.items.length == 0) {
                Notification.error('Purchase Details canot be blank');
                return;
            }

            if ($scope.detailsLst == undefined)
                $scope.detailsLst = [];

            $scope.orderH.Usr_Id = $scope.repository.loggedUser.username;
            $scope.orderH.Sup_Cd = $scope.item.AC_CD;
            $scope.orderH.AssetOrderLst = $scope.items;
            $scope.orderH.Apo_Dt = angular.copy(commonFunctions.formatDate($scope.orderH.Apo_Dt));
            $scope.orderH.AssetDetailsLst = $scope.detailsLst;
            apiService.post('/api/purchaseOrder/add/', $scope.orderH,
            createPurchaseCompleted,
            createPurchaseFailed);
            clearAllItems();
        }

        function clearAllItems() {
            $scope.items = [];
            $scope.orderH = {};
            $scope.detailsLst = [];
            $scope.assetItem = {};
            $scope.item = {};
            $scope.transMode = 'add';
            initValues();
        }

        function createPurchaseCompleted(response) {
            Notification.success('Purchase Details has been added');
            $scope.orderH = {};
            $location.url('/transactions/purchaseOrder');
            clearAllItems();

        }

        function createPurchaseFailed(response) {
            Notification.error(response.data);
            $location.url('/transactions/purchaseOrder');
            clearAllItems();

        }


        function updatePurchaseOrder(orderH) {
            if ($scope.items.length == 0) {
                Notification.error('Purchase Details canot be blank');
                return;
            }

            if ($scope.detailsLst == undefined)
                $scope.detailsLst = [];
            $scope.orderH.Apo_Dt = angular.copy(commonFunctions.formatDate($scope.orderH.Apo_Dt));
            $scope.orderH.Usr_Id = $scope.repository.loggedUser.username;
            $scope.orderH.Sup_Cd = $scope.item.AC_CD;
            $scope.orderH.AssetOrderLst = $scope.items;
            $scope.orderH.AssetDetailsLst = $scope.detailsLst;
            apiService.post('/api/purchaseOrder/update/', $scope.orderH,
            updatePurchaseCompleted,
            updatePurchaseFailed);
            // clearAllItems();
        }


        function updatePurchaseCompleted(response) {
            Notification.success('Purchase No ' + $scope.orderH.Apo_No + ' has been Updated');
            $scope.orderH = {};
            $location.url('/transactions/purchaseOrder');
            clearAllItems();
        }

        function updatePurchaseFailed(response) {
            Notification.error(response.data);
            $location.url('/transactions/purchaseOrder');
            clearAllItems();

        }

        function totAmt() {
            if ($scope.assetItem.Apod_Rate != undefined || $scope.assetItem.Apod_Qty != undefined) {

                $scope.assetItem.Apod_Amt = $scope.assetItem.Apod_Qty * $scope.assetItem.Apod_Rate;
                if ($scope.assetItem.Apod_Disc_Per != undefined) {
                    if ($scope.assetItem.Apod_Disc_Per > 100) {
                        Notification.error('Invalid discount amount')
                        $scope.assetItem.Apod_Disc_Per = 0;
                    }
                    $scope.assetItem.Apod_Amt = $scope.assetItem.Apod_Amt - ($scope.assetItem.Apod_Amt * $scope.assetItem.Apod_Disc_Per / 100);
                }
            }
            else
                $scope.assetItem.Apod_Amt = 0;
        }

        function summary(items) {
            var total = 0;
            var discnt = 0;
            for (var i = 0; i < items.length; i++) {
                var product = items[i];
                total += (product.Apod_Rate * product.Apod_Qty);
                if (product.Apod_Disc_Per != undefined) {
                    discnt += product.Apod_Rate * product.Apod_Qty * product.Apod_Disc_Per / 100;
                }
            }

            $scope.orderH.Apo_Disc_Amt = discnt.toFixed(3);
            $scope.orderH.Apo_Tot_Amt = total.toFixed(3);
            $scope.orderH.Apo_Net_Amt = (total - discnt).toFixed(3);
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

    }

})(angular.module('AssetAdminApp'));