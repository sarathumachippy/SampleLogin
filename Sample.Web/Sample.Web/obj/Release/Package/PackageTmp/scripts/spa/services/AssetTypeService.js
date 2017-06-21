(function (app) {
    'use strict';

    app.factory('AssetTypeService', AssetTypeService);

    AssetTypeService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification', 'blockingservice'];

    function AssetTypeService(apiService, $http, $base64, $cookieStore, $rootScope, Notification, blockingservice) {

        var service = {
            listassettypes: listassettypes
        }
        
        function listassettypes(completed) {
            apiService.get("/api/assettypes/list", null, completed, listfailure);
        }

        function listfailure(response) {
            Notification.error('Could not load Asset Types,' + response.data[0] + ' please try again !');
        }
        return service;
    }

})(angular.module('common.core'));