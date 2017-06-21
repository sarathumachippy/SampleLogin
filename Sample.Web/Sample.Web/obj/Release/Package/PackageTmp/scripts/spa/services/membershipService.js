(function (app) {
    'use strict';

    app.factory('membershipService', membershipService);

    membershipService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification'];

    function membershipService(apiService, $http, $base64, $cookieStore, $rootScope, Notification) {

        var service = {
            login: login,
            register: register,
            saveCredentials: saveCredentials,
            removeCredentials: removeCredentials,
            isUserLoggedIn: isUserLoggedIn,
            getSingle: getSingle,
            getSingleEmp: getSingleEmp,
            getSingleSupplier: getSingleSupplier,
            getSingleCustomer: getSingleCustomer,
            getSingleAssetRegister: getSingleAssetRegister

        }

        function login(user, completed) {
            apiService.post('/api/account/authenticate', user,
            completed,
            loginFailed);
        }

        function register(newuser, completed) {
            apiService.post('/api/account/register', newuser,
            completed,
            registrationFailed);
        }

        function saveCredentials(user) {
            var membershipData = $base64.encode(user.username + ':' + user.password);

            $cookieStore.put('loggedUserName', user.username);
            $rootScope.repository = {
                loggedUser: {
                    username: user.username,
                    fullname: user.fullname,
                    imagepath: user.image,
                    authdata: membershipData
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + membershipData;
            $cookieStore.put('repository', $rootScope.repository);
        }

        function removeCredentials() {
            $rootScope.repository = {};
            $cookieStore.remove('repository');
            $http.defaults.headers.common.Authorization = '';
        };

        function loginFailed(response) {
            Notification.error('Login Failed!,' + response.data[0] + ' please try again !');
        }

        function registrationFailed(response) {
            Notification.error('Registration Failed!,' + response.data[0] + ' please try again !');
        }

        function isUserLoggedIn() {
            return $rootScope.repository.loggedUser != null;
        }

        function getSingle(id, completed) {
            apiService.get("/api/users/getSingle/" + id, null, completed, failure);
        }
        function failure(response) {
            Notification.error('Error Occured! ' + response.data[0]);
        }

        function getSingleEmp(id, completed) {
            apiService.get("/api/employees/getSingleEmp/" + id, null, completed, failure);
        }
        function failure(response) {
            Notification.error('Error Occured! ' + response.data[0]);
        }


        function getSingleSupplier(id, completed) {
            apiService.get("/api/suppliers/getSingleSupplier/" + id, null, completed, failure);
        }
        function failure(response) {
            Notification.error('Error Occured! ' + response.data[0]);
        }


        function getSingleCustomer(id, completed) {
            apiService.get("/api/customers/getSingleCustomer/" + id, null, completed, failure);
        }
        function failure(response) {
            Notification.error('Error Occured! ' + response.data[0]);
        }


        function getSingleAssetRegister(id, completed) {
            apiService.get("/api/assetRegister/getSingleAssetRegister/" + id, null, completed, failure);
        }
        function failure(response) {
            Notification.error('Error Occured! ' + response.data[0]);
        }

        return service;
    }



})(angular.module('common.core'));