(function (app) {
    "use strict";
    app.controller("asset.transactions.purchase.test.list.Ctrl", testlistCtrl);
    testlistCtrl.$inject = ['$scope', '$rootScope', '$modalInstance', 'apiService', 'Notification', 'constants'];

    function testlistCtrl($scope, $rootScope, $modalInstance, apiService, Notification, constants) {

     var  data1 = [
   {
       id: 1,
       name: "Folder 1",
       state: {
           selected: false
       },
       children: [
         {
             id: 2,
             name: "Sub Folder 1",
             children: {
                 selected: false
             },
         },
         {
             id: 3,
             name: "Sub Folder 2",
             children: {
                 selected: false
             },
         }
       ]
   },

        ];


        $scope.data = angular.copy(data1);
        $scope.datas = angular.copy(data1);


        $scope.CustomCallback = function (item, selectedItems) {
            if (selectedItems !== undefined && selectedItems.length >= 80) {
                return false;
            } else {
                return true;
            }
        };

       
    }

})(angular.module('AssetAdminApp'));
