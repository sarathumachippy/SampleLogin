(function (app) {
    'use strict';

    app.controller('loginCtrl', loginCtrl);

    loginCtrl.$inject = ['$scope', 'membershipService', '$rootScope', '$location', 'blockingservice','constants'];

    function loginCtrl($scope, membershipService, $rootScope, $location, blockingservice,constants) {
        $scope.pageClass = 'page-login';
        $scope.login = login;
        $scope.user = {};
        $scope.showmessage = false;

        function login() {
            blockingservice.block('division', 'rings','Submitting your response','div_login');
            membershipService.login($scope.user, loginCompleted)           
        }

        function loginCompleted(result) {
            blockingservice.unblock('division', 'div_login');
            if (result.data.success) {
                
                $scope.user.fullname = result.data.fullname;
                if (result.data.image == undefined || result.data.image == null || result.data.image == '')
                    result.data.image = 'Default.jpg';
                $scope.user.image = constants.apiServiceBaseUri + '/content/images/users/' + result.data.image;
                membershipService.saveCredentials($scope.user);
                
                //notificationService.displaySuccess('Hello ' + $scope.user.username);
                //$scope.userData.displayUserInfo();
                if ($rootScope.previousState)
                    $location.path($rootScope.previousState);
                $rootScope.islogged = true;
                $location.path("/");
            }
            else {
                $scope.showmessage = true;
                $scope.messagetype = "error";
                $scope.message = "Please try again. The email address or password you provided is not correct."
                //alert("Login failed!");
                //notificationService.displayError('Login failed. Try again.');
            }
        }
    }

})(angular.module('SampleApp'));
