(function (app) {
    "use strict";
    app.controller("asset.admin.supplier.edit.ctrl", supplierEditCtrl);
    supplierEditCtrl.$inject = ['$scope', '$rootScope', 'membershipService', '$modalInstance', '$timeout', 'apiService', 'Notification', '$routeParams', '$location'];

    function supplierEditCtrl($scope, $rootScope, membershipService, $modalInstance, $timeout, apiService, Notification, $routeParams, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.deleteData = deleteData;

        function deleteData() {
            console.log($scope.supplier);
            apiService.post('/api/suppliers/delete/', $scope.supplier,
            deleteSupplierCompleted,
            deleteSupplierFailed);
        }

        function deleteSupplierCompleted(response) {
            Notification.error($scope.supplier.AC_DESC + ' has been deleted');
            $modalInstance.dismiss();
            $rootScope.searchSupplier();
            $scope.supplier = {};
        }

        function deleteSupplierFailed(response) {
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
