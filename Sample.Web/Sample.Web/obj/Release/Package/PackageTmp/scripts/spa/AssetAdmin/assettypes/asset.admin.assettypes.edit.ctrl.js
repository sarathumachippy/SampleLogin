(function (app) {
    "use strict";
    app.controller("asset.admin.assettype.edit.ctrl", assetEditCtrl);
    assetEditCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function assetEditCtrl($scope,$rootScope, $modalInstance, $timeout, apiService, Notification, $location) {

        $scope.cancelEdit = cancelEdit;
        $scope.updateAssetTypes = updateAssetTypes;
        $scope.deleteData = deleteData;
        $scope.addData = addData;
        $scope.openDatePicker = openDatePicker;
       // $scope.test = $scope.repository.loggedUser.username;
      

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};

        function updateAssetTypes() {
            $scope.EditedAsset.Usr_Id = $scope.loginuser;
            apiService.post('/api/assettypes/update/', $scope.EditedAsset,
            updateUserCompleted,
            updateUserFailed);
        }


        function deleteData() {
            apiService.post('/api/assettypes/delete/', $scope.EditedAsset,
            deleteAssetCompleted,
            deleteAssetFailed);

        }
      

        function updateUserCompleted(response) {
            Notification.success($scope.EditedAsset.Atp_Name + ' has been updated');
            $scope.EditedDept = {};
            $modalInstance.dismiss();
        }

        function updateUserFailed(response) {
            Notification.error(response.data);
        }

        function deleteAssetCompleted(response) {
            Notification.error($scope.EditedAsset.Atp_Name + ' has been deleted');
            $rootScope.searchAssetType();
            $location.path('/assettypes');
            $scope.EditedUser = {};
            $modalInstance.dismiss();
        }

        function deleteAssetFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }
        
        function addData() {

       //    if (typeof $scope.EditedDept.Dept_Name === 'undefined' || $scope.EditedDept.Dept_Cd === 'undefined') {
       //        Notification.error("Value can't be blank");
       //        $scope.EditedDept = {};
       //        return;
       //    }

            apiService.post('/api/departments/add/', $scope.EditedAsset,
            adddDepartmentCompleted,
            adddDepartmentFailed);
        }


        function adddDepartmentCompleted(response) {
            
            Notification.success($scope.EditedAsset.Atp_Name + ' has been added');
            $scope.EditedDept = {};
            $modalInstance.dismiss();
        }

        function adddDepartmentFailed(response) {
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
