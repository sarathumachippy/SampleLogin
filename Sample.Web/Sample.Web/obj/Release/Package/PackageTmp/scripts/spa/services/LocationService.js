(function (app) {
    'use strict';

    app.factory('LocationService', LocationService);

    LocationService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification', 'blockingservice'];

    function LocationService(apiService, $http, $base64, $cookieStore, $rootScope, Notification, blockingservice) {

        var service = {
            listusers: listusers
        }

        function listusers(completed) {
            apiService.get("api/locations/list", null, completed, listfailure);
        }

        function listfailure(response) {
            Notification.error('Could not load Users,' + response.data[0] + ' please try again !');
        }
        return service;
    }

})(angular.module('common.core'));