//Module -Sample Login App
(function (app) {
    'use strict';

    app.config(config);
    app.run(run);

    //Routing functionalities
    config.$inject = ['$routeProvider', '$logProvider'];
    function config($routeProvider, $logProvider) {
        $logProvider.debugEnabled(false);
        $routeProvider
            .when("/", {
                templateUrl: "scripts/spa/SampleAdmin/dashboard/dashboard.html",
                controller: "asset.admin.dashboard.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
             .when("/login", {
                 templateUrl: "scripts/spa/SampleAdmin/login/login.html",
                 controller: "loginCtrl",
             })
            .when("/users", {
                templateUrl: "scripts/spa/SampleAdmin/users/UsersList.html",
                controller: "asset.admin.users.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
             .when("/users/new", {
                 templateUrl: "scripts/spa/SampleAdmin/users/UserRegister.html",
                 controller: "asset.admin.users.register.ctrl",
                 resolve: { isAuthenticated: isAuthenticated }
             })
            .when("/users/edit/:id", {
                templateUrl: "scripts/spa/SampleAdmin/users/UserRegister.html",
                controller: "asset.admin.users.register.ctrl",
                resolve: { isAuthenticated: isAuthenticated }
            })
            .otherwise({ redirectTo: "/" });

    }

    run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];

    //Checks repository
    function run($rootScope, $location, $cookieStore, $http) {
        $rootScope.repository = $cookieStore.get('repository') || { loggedUser: "" };
        if ($rootScope.repository.loggedUser == "") {
            $rootScope.islogged = false;
            $location.path("/login");
        }
        if ($rootScope.repository.loggedUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.repository.loggedUser.authdata;
        }
    }

    //Checks whether the authentication informations exists in the localstorage
    //If the information exists then allow else redirect to the login
    isAuthenticated.$inject = ['membershipService', '$rootScope', '$location'];
    function isAuthenticated(membershipService, $rootScope, $location) {
        if (!membershipService.isUserLoggedIn()) {
            $rootScope.previousState = $location.path();
            $rootScope.islogged = false;
            $location.path("/login");
        }
        else {
            $rootScope.islogged = true;
        }
    }

    app.constant('constants', {
        pageSize: 10,
        apiServiceBaseUri: 'http://localhost:2000',
    });

})(angular.module('SampleApp', ['common.core', 'common.ui','ui-notification', 'easyComplete', 'controlDirectives', 'ngSanitize']));
