(function (app) {
    "use strict";

    app.controller('treeViewCtrl', ['$scope', '$modal', 'apiService', function ($scope, $modal, apiService) {

        $scope.getPendingPOList = getPendingPOList;
        $scope.selectTreeValue = selectTreeValue;

        $scope.printParent = function ($event) {
                    var root = $scope;
                    var currentScope = angular.element($event.target).scope();
                    console.log('selected Node details: ', currentScope.node);
                    currentScope = currentScope.$parent;
                    console.log('parents::')
                    while (currentScope.$id !== root.$id) {
                        console.log(currentScope.node);
                        currentScope = currentScope.$parent;
                    }
        }

        function getPendingPOList(supplierCode) {

            var config = {
                params: {
                    supplier: supplierCode
                }
            };
            apiService.get('api/purchase/pendingpo/', config, success, failure);
        }

        function success(result) {
            $scope.roleList = result.data;
        }

        function failure() {

        }

        function selectTreeValue() {
            console.log($scope.treeId.currentNode.roleId);
            if ($scope.treeId.currentNode.roleId != '') {
                alert('Ok')
            }
            //currentScope = currentScope.$parent;
            //console.log('parents::')
            //while (currentScope.$id !== root.$id) {
            //    console.log(currentScope.node);
            //    currentScope = currentScope.$parent;
            //}
        }

        $scope.getPendingPOList('13444');

        $scope.roleList2 = [
                    {
                        "roleName": "User1", "roleId": "role1", "children":
                          [
                            { "roleName": "subUser1-1-1", "roleId": "role1211" },
                            { "roleName": "subUser1-1-2", "roleId": "role1212" }
                          ]
                    },
                    {
                        "roleName": "User2", "roleId": "role1", "children":
                          [
                            { "roleName": "subUser2-1-1", "roleId": "role1211" },
                            { "roleName": "subUser2-1-2", "roleId": "role1212" }
                          ]
                    }
                ];

    }]);

})(angular.module('AssetAdminApp'));