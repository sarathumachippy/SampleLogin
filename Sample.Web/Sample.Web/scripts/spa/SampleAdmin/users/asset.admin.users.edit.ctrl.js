(function (app) {
    "use strict";
    app.controller("asset.admin.users.edit.ctrl", userEditCtrl);
    userEditCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', '$timeout', 'apiService', 'Notification', '$location'];

    function userEditCtrl($scope, $rootScope, $modalInstance, $timeout, apiService, Notification, $location) {
        apiService
        $scope.cancelEdit = cancelEdit;
        $scope.updateUser = updateUser;
        $scope.deleteData = deleteData;
        $scope.changePwd = changePwd;

        $scope.openDatePicker = openDatePicker;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};

        function updateUser() {
            apiService.post('/api/users/update/', $scope.EditedUser,
            updateUserCompleted,
            updateUserFailed);
        }

        function deleteData() {
            
            $scope.EditedUser.CurrentUserName = $scope.repository.loggedUser.username;
            apiService.post('/api/users/delete/', $scope.EditedUser,
            deleteUserCompleted,
            deleteUserFailed);
        }

        function changePwd() {
            apiService.post('/api/account/changepwd/', $scope.EditedUser,
            chgpwdCompleted,
            chgpwdFailed);
        }

        function updateUserCompleted(response) {
            Notification.success($scope.EditedUser.Fullname + ' has been updated');
            $scope.EditedUser = {};
            $modalInstance.dismiss();
        }

        function updateUserFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }

        function deleteUserCompleted(response) {
            Notification.error($scope.EditedUser.Fullname + ' has been deleted');
            $location.url('users');
            $rootScope.searchUser();
            $modalInstance.dismiss();
        }

        function deleteUserFailed(response) {
            Notification.error(response.data);
            $modalInstance.dismiss();
        }

        function chgpwdCompleted(response) {
            Notification.success('Password for user : ' + $scope.EditedUser.Fullname + ' has been changed');
            $location.url('users');
            $rootScope.searchUser();
            $scope.EditedUser = {};
            $modalInstance.dismiss();
        }

        function chgpwdFailed(response) {
            Notification.error(response.data);
        }

        function cancelEdit() {
            $scope.isEnabled = false;
            $scope.EditedUser.Password1 = '';
            $scope.EditedUser.Password2 = '';
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

})(angular.module('SampleApp'));
