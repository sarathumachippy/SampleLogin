(function (app) {
    "use strict";
    app.controller("asset.transactions.assettransfer.ctrl", assetTransferCtrl);
    assetTransferCtrl.$inject = ['$rootScope', '$modal', '$scope', 'apiService', 'customerService', 'Notification', 'blockingservice', '$location', '$routeParams'];

    function assetTransferCtrl($scope, $modal, $rootScope, apiService, customerService, Notification, blockingservice, $location, $routeParams) {
        $scope.loadCustomer = loadCustomer;
        $scope.toggleEdit=toggleEdit;
        $scope.resetValues = resetValues;
        $scope.addRow = addRow;
        $scope.selectCustomer = selectCustomer;
        $scope.selectionChanged = selectionChanged;

        function loadCustomer() {
            customerService.loadCustomer(completedload);
           
        }
        function completedload(result) {
            //$scope.busyingload = false;
            $scope.customers = result.data;
            angular.forEach($scope.customers, function (obj) {
                obj["showEdit"] = true;

            })
        }

        function toggleEdit(customer) {
            if (customer.showEdit == true) {
                $scope.originalCustomer = angular.copy(customer);
                customer.showEdit = false;
            }
            else {
                customer.showEdit = true;
            }
        }

        function resetValues(index) {
            $scope.customers[index] = $scope.originalCustomer;
            $scope.customers[index].showEdit = true;

        }

        function addRow() {
            var ing = {
                FirstName: '',
                LastName: '',
                Email: '',
                showEdit: true,
            };
            $scope.customers.push(ing);
        };

        $scope.removeCustomer = function (index) {
            $scope.customers.splice(index, 1);
        };

        function selectCustomer($item) {
            if ($item) {
                $scope.selectedCustomer = $item.originalObject.ID;
                $scope.isEnabled = true;
            }
            else {
                $scope.selectedCustomer = -1;
                $scope.isEnabled = false;
            }
        }

        function selectionChanged($item) {
        }

        $scope.headertemplate = [
           { title: 'Code', property: 'ID', show: true, width: '50px', type: 'text' },
           { title: 'Name', property: 'FirstName', show: true, width: '300px', type: 'value' }
        ]
        //Transport parameters
        $scope.transport = {
            method: 'get',
            read: constants.apiServiceBaseUri+'/api/customers/getAll',
            params: ''
        }
    }
})(angular.module('AssetAdminApp'));
