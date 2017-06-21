(function (app) {
    "use strict";
    app.controller("asset.transactions.purchaseOrder.list.Ctrl", purchaseOrderListCtrl);
    purchaseOrderListCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location','constants'];

    function purchaseOrderListCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location, constants) {

        $rootScope.searchPOList = searchPOList;
        $scope.cancelEdit = cancelEdit;
        $scope.busyLoad = true;
        $scope.clearSearch = clearSearch;
        $scope.selectPO = selectPO;

        function selectPO(id) {
            $rootScope.fillPOData(id);
            $modalInstance.dismiss();
        }

        function searchPOList(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: 8,
                    filter: $scope.filterPOList
                }
            };
            apiService.get('/api/purchaseOrder/search/', config,
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

        function deleteAssetRegCompleted(response) {
            Notification.error($scope.assetRegister.Ast_Name + ' has been deleted');
            $modalInstance.dismiss();
            $rootScope.searchAssetRegister();
            $scope.assetRegister = {};
        }

        function deleteAssetRegFailed(response) {
            Notification.error(response.data);
        }

        function cancelEdit() {
            $scope.isEnabled = false;
            $modalInstance.dismiss();
        }
      
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $timeout(function () {
                $scope.datepicker.opened = true;
            });

            $timeout(function () {
                $('ul[datepicker-popup-wrap]').css('z-index', '10000');
            }, 100);

        };

        function clearSearch() {
            $scope.filterPOList = '';
            searchPOList();
        }

        $rootScope.searchPOList();
    }

})(angular.module('AssetAdminApp'));
