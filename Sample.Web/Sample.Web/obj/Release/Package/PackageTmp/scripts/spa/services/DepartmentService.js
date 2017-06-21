(function (app) {
    'use strict';

    app.factory('DepartmentService', DepartmentService);

    DepartmentService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification', 'blockingservice'];

    function DepartmentService(apiService, $http, $base64, $cookieStore, $rootScope, Notification, blockingservice) {

        var service = {
            listdepartments: listdepartments
        }

        function listdepartments(completed) {
            apiService.get("api/departments/list", null, completed, listfailure);
        }

        function listfailure(response) {
            Notification.error('Could not load Users,' + response.data[0] + ' please try again !');
        }
        return service;
    }

})(angular.module('common.core'));