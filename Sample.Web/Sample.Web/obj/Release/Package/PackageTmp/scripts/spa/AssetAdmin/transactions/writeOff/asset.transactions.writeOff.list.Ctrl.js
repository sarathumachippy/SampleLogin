(function (app) {
    "use strict";
    app.controller("asset.transactions.writeOff.list.Ctrl", writeOffListCtrl);
    writeOffListCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location', 'constants'];

    function writeOffListCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location, constants) {

        $rootScope.searchPurchaseList = searchPurchaseList;
        $scope.cancelEdit = cancelEdit;
        $scope.busyLoad = true;
        $scope.clearSearch = clearSearch;
        $scope.selectWriteOff = selectWriteOff;

        function selectWriteOff(id, AssetId) {
            $rootScope.fillWriteOffData(id, AssetId);
            $modalInstance.dismiss();
        }

        function searchPurchaseList(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: 8,
                    filter: $scope.filterPurchaseList
                }
            };
            apiService.get('/api/writeoff/search/', config,
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
            $scope.filterPurchaseList = '';
            searchPurchaseList();
        }

        $rootScope.searchPurchaseList();
    }

})(angular.module('AssetAdminApp'));
