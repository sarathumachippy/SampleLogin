(function (app) {
    'use strict';

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$location', 'membershipService', '$rootScope', '$sce', 'apiService'];
    function rootCtrl($scope, $location, membershipService, $rootScope, $sce, apiService) {
        $scope.userData = {};

        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;

        $rootScope.islogged = false;
        $rootScope.initiatesession = false;

        function displayUserInfo() {
            $scope.userData.isUserLoggedIn = membershipService.isUserLoggedIn();

            if ($scope.userData.isUserLoggedIn) {
                $scope.username = $rootScope.repository.loggedUser.username;
                $scope.fullname = $rootScope.repository.loggedUser.fullname;
            }
        }

        function logout() {
            membershipService.removeCredentials();
            $location.path('#/');
            $scope.userData.displayUserInfo();
        }

        $scope.userData.displayUserInfo();


        $scope.trustAsHtml = function (string) {
            return $sce.trustAsHtml(string);
        };

        $rootScope.getUserRights = function () {
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
    }

})(angular.module('AssetAdminApp'));
