(function (app) {
    "use strict";

    app.controller('menuController', ['$scope', 'Notification', 'apiService', '$sce', '$rootScope', function ($scope, Notification, apiService, $sce, $rootScope) {

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $rootScope.getUserRights1 = function () {
            if ($rootScope.repository.loggedUser.username != undefined) {
                apiService.get('/api/menu/getuserrights/' + $rootScope.repository.loggedUser.username, null,
                              completed, failed);
            }
        }

        function completed(response) {
            $scope.menuLiteral = $scope.trustAsHtml(response.data);
        }

        function failed() {
        }
    }]);



})(angular.module('AssetAdminApp'));