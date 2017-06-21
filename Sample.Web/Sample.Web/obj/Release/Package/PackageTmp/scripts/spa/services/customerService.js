(function (app) {
    'use strict';

    app.factory('customerService', customerService);

    customerService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification', 'blockingservice'];

    function customerService(apiService, $http, $base64, $cookieStore, $rootScope, Notification, blockingservice) {

        var service = {
            loadCustomer: loadCustomer,
            filterCustomer: filterCustomer
        }

        function loadCustomer(completed) {
            apiService.get("/api/customers/list5", null, completed, failure);
        }

        function filterCustomer(filter,completed) {
            apiService.get("/api/customers?filter="+filter, null, completed, failure);
        }

        function failure(response) {
            Notification.error('Could not load Customers,' + response.data[0] + ' please try again !');
        }
        return service;
    }

})(angular.module('common.core'));