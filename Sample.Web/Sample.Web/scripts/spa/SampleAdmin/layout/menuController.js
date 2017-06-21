(function (app) {
    "use strict";

    app.controller('menuController', ['$scope', 'Notification', 'apiService', '$sce', '$rootScope', function ($scope, Notification, apiService, $sce, $rootScope) {

        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        function completed(response) {
            $scope.menuLiteral = $scope.trustAsHtml(response.data);
        }

        function failed() {
        }
    }]);



})(angular.module('SampleApp'));
