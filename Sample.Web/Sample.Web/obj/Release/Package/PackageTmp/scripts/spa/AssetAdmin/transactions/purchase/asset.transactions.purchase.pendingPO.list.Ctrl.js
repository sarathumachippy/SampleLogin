(function (app) {
    "use strict";
    app.controller("asset.transactions.purchase.pendingPO.list.Ctrl", PendingPOListCtrl);
    PendingPOListCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'apiService', 'Notification', 'constants'];

    function PendingPOListCtrl($scope, $rootScope, $modalInstance, apiService, Notification, constants) {

        $scope.cancelEdit = cancelEdit;
        $scope.busyLoad = false;
        $scope.getPendingPOList = getPendingPOList;
        $scope.selectTreeValue = selectTreeValue;
        $scope.clearSearch = clearSearch;
        function cancelEdit() {
            $scope.isEnabled = false;
            $modalInstance.dismiss();
        }

        function clearSearch() {
            $scope.filterPOList = '';
            getPendingPOList($scope.supplierCode)

        }

        function getPendingPOList(supplierCode) {

            var config = {
                params: {
                    supplier: supplierCode
                }
            };
            apiService.get('/api/purchase/pendingpo/', config, success, failure);
        }

        // function success(result) {
        //     $scope.roleList = result.data;
        //     $scope.busyLoad = false;
        // }
        //
        // function failure(response) {
        //     Notification.error(response);
        //     $scope.busyLoad = false;
        // }

        function selectTreeValue(roleId, apoNo) {
            if (roleId != '') {
                $rootScope.getPendingPOSingle(roleId, apoNo);
                $modalInstance.dismiss();
            }
            else {
                Notification.error('Please select a valid PO Detail');
            }
        }

        //  $scope.getPendingPOList($rootScope.pendingPOSupplier);
    }

})(angular.module('AssetAdminApp'));
