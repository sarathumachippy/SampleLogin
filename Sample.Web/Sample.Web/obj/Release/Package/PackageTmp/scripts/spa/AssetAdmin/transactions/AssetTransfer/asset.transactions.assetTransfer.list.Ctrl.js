(function (app) {
    "use strict";
    app.controller("asset.transactions.assetTransfer.list.Ctrl", assettransferListCtrl);
    assettransferListCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location', 'constants'];

    function assettransferListCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location, constants) {

        $rootScope.searchTransferList = searchTransferList;
        $scope.cancelEdit = cancelEdit;
        $scope.busyLoad = true;
        $scope.clearSearch = clearSearch;
        $scope.selectTransferId = selectTransferId;

        function selectTransferId(id) {
            $rootScope.fillTransferData(id);
            $modalInstance.dismiss();
        }

        function searchTransferList(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: 8,
                    filter: $scope.filterPOList
                }
            };
            apiService.get('/api/assetTransfer/search/', config,
            listCompleted,
            listFailure);
        }

        function listCompleted(result) {
            $scope.poList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyLoad = false;
        }

        function listFailure(resposnse) {
            Notification.error(resposnse.data);
        }


        function cancelEdit() {
            $scope.isEnabled = false;
            $modalInstance.dismiss();
        }


        function clearSearch() {
            $scope.filterPOList = '';
            searchTransferList();
        }

        $rootScope.searchTransferList();
    }

})(angular.module('AssetAdminApp'));
