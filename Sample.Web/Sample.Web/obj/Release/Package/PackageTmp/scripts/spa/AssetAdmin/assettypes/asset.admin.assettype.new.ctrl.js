(function (app) {
    "use strict";
    app.controller("asset.admin.assettype.new.ctrl", registerCtrl);
    registerCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams'];

    function registerCtrl($rootScope, $scope, apiService, LocationService, Notification, blockingservice, $location, $routeParams) {
        $scope.openDatePicker = openDatePicker;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};
        $scope.register = register;
        $scope.updateAssetType = updateAssetType;
        $scope.newuser = {};
        $scope.assettype = {};
        $scope.loginuser = $scope.repository.loggedUser.username;
        $scope.prepareFiles = prepareFiles;
        $scope.loadAssetType = loadAssetType;
        $scope.calcUsefulYears = calcUsefulYears;
        $scope.assettype.Atp_AssetType = 'OTHERS';
        function calcUsefulYears() {
            if ($scope.assettype.Atp_DeprePer === undefined) {
                return 0;
            }
            return (100/$scope.assettype.Atp_DeprePer).toFixed(3);
        }

        function loadAssetType() {
            if ($routeParams.id != undefined) {
                apiService.get("/api/assettypes/getSingle/" + $routeParams.id, null, completedLoadAssetType, failedLoadAssetType);
            }
        }

        function completedLoadAssetType(result) {
            $scope.assettype = result.data;
        }

        function failedLoadAssetType(result){
            Notification.error(result.data);
        }

        function register() {
            $scope.assettype.Usr_Id = $scope.loginuser;
            apiService.post('/api/assettypes/add/', $scope.assettype,
            assetRegisterCompleted,
            assetRegisterFailed);
           
        }

        function assetRegisterCompleted(response) {
            Notification.success($scope.assettype.Atp_Name + ' has been added');
            $scope.assettype = {};
            $location.url('assettypes')
        }

        function assetRegisterFailed(response) {
            Notification.error(response.data);
        }

        function updateAssetType() {
            $scope.assettype.Usr_Id = $scope.loginuser;
            apiService.post('/api/assettypes/update/', $scope.assettype,
            updateassetCompleted,
            updateassetFailed);
           
        }

        function updateassetCompleted(response) {
            Notification.success($scope.assettype.Atp_Name + ' has been updated');
            $scope.assettype = {};
            $location.url('assettypes')
        }

        function updateassetFailed(response) {
            Notification.error(response.data);
        }

        function registerCompleted(response) {
            if (response.data) {
                console.log(response.data);
                Notification.success('New user created successfully');
                if (userImage) {
                    fileUploadService.uploadUser(userImage, response.data.ID, redirectToList);
                }
                else
                    redirectToList();
            }
            else {
                Notification.error('Error occured! Can\'t create User');
            }
        }
        function redirectToList() {
            $location.url('users');
        }

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        function prepareFiles($files) {
            userImage = $files;
        }
    }
})(angular.module('AssetAdminApp'));
