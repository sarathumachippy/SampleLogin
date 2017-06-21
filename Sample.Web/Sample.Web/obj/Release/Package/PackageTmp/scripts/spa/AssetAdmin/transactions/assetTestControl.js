(function (app) {
    "use strict";
    app.controller("assetTestControl", assetTestControl);
    assetTestControl.$inject = ['$scope','customerService','Notification'];

    function assetTestControl($scope, customerService, Notification) {
        $scope.items =[];
        //$scope.filter = '';

        //$scope.filterCustomer = function() {
        //    customerService.filterCustomer($scope.filter, completedload);

        //}
        //function completedload(result) {
        //    $scope.customers = result.data;
        //}
        //$scope.selected = function(customer){
        //    $scope.filter = customer.FirstName;
        //    $scope.customers = null;
        //}

        //$scope.hideCustomerList = function () {
        //    $scope.customers = null;
        //}

        // header template
        $scope.transMode = 'add';

        $scope.calculateTotal = function (item) {
            if (angular.isUndefined(item.Qty) || angular.isUndefined(item.Rate)) {
                item.Amt = 0;
                return 0;
            }
            else
            {
                item.Amt = item.Qty * item.Rate;
                return item.Qty * item.Rate;
            }
            
        }
        $scope.headertemplate = [
            { title: 'Code', property: 'Itm_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Itm_Name', show: true, width: '300px', type: 'value' }
        ]
        //Transport parameters
        $scope.transport = {
            method: 'get',
            read: '/api/items/listAll',
            params: ''
        }
        
        $scope.clearItem = function () {
            $scope.transMode = 'add';
            $scope.item = {
                ItmCd: '',
                ItmName: '',
                Qty: '',
                Rate: '',
                Amt: ''
            }
        }

        $scope.addUpdateItem = function () {
            if ($scope.item.ItmCd != '' && $scope.item.ItmCd != null) {
                if ($scope.transMode == 'update') {
                    $scope.items[$scope.activeIndex].ItmCd = $scope.item.ItmCd;
                    $scope.items[$scope.activeIndex].ItmName = $scope.item.ItmName;
                    $scope.items[$scope.activeIndex].Qty = $scope.item.Qty;
                    $scope.items[$scope.activeIndex].Rate = $scope.item.Rate;
                    $scope.calculateTotal($scope.item);
                }
                else {
                    $scope.items.push(angular.copy($scope.item));
                }
                $scope.clearItem();
            }
            else {
                Notification.error('Please enter valid Item');
            }
        }

        $scope.updateItem = function (item, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.item = angular.copy(item);
        }
    }
})(angular.module('AssetAdminApp'));
