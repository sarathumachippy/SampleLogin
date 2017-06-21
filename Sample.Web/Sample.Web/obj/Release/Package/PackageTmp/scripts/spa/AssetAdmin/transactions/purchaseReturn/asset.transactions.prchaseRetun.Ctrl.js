(function (app) {
    "use strict";
    app.controller("asset.transactions.purchaseReturn.Ctrl", purchaseReturnCtrl);
    purchaseReturnCtrl.$inject = ['$scope', '$http', '$rootScope', '$filter', '$timeout', 'membershipService', 'apiService', 'Notification', '$routeParams', '$location', 'constants'];

    function purchaseReturnCtrl($scope, $http, $rootScope, $filter, $timeout, membershipService, apiService, Notification, $routeParams, $location, constants) {


        $scope.headerSuppliers = [

            { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
            { title: 'Add', property: 'ADDRESS1', show: false }
        ]

        $scope.loadSupplier = {
            method: 'get',
            read: '/api/suppliers/list',
            params: ''
        }



    }

})(angular.module('AssetAdminApp'));
