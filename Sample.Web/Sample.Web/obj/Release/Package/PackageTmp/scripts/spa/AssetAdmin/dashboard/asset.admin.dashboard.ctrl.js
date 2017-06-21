(function (app) {
    'use strict';

    app.controller('asset.admin.dashboard.ctrl', dashboardCtrl);

    dashboardCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'notificationService'];

    function dashboardCtrl($rootScope, $scope, apiService, notificationService) {

        $scope.getDashboard = getDashboard;
        $scope.dashboardData = {};

        function getDashboard() {
            apiService.get('/api/dashboard/getData', null,
            dashboardLoadCompleted,
            dashboardLoadFailed);
        }

        function dashboardLoadCompleted(result) {
            $scope.dashboardData = result.data;
        }

        function dashboardLoadFailed(result) {
            notificationService.error(resul.data);
        }

    }

})(angular.module('AssetAdminApp'));
