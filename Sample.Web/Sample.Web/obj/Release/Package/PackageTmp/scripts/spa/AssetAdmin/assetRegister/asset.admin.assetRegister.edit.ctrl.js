(function (app) {
    "use strict";
    app.controller("asset.admin.assetRegister.edit.ctrl", assetRegisterEditCtrl);
    assetRegisterEditCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location'];

    function assetRegisterEditCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.deleteData = deleteData;

        function deleteData() {
             
            apiService.post('/api/assetRegister/delete/', $scope.assetRegister,
            deleteAssetRegCompleted,
            deleteAssetRegFailed);
        }

        function deleteAssetRegCompleted(response) {
            Notification.error($scope.assetRegister.Ast_Name + ' has been deleted');
            $modalInstance.dismiss();
            $rootScope.searchAssetRegister();
            $scope.assetRegister = {};
        }

        function deleteAssetRegFailed(response) {
            $modalInstance.dismiss();
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
    }

})(angular.module('AssetAdminApp'));
