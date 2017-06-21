(function (app) {
    'use strict';

    app.factory('commonFunctions', commonFunctions);

    function commonFunctions() {

        var service = {
            formatDate: formatDate
        }

        function formatDate(date) {
            var newdate = date.split("-").reverse().join("-");
            return newdate;
        }
        return service;
    }

})(angular.module('common.core'));