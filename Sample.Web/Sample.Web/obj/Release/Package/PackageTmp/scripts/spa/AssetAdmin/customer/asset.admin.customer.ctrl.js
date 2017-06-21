(function (app) {
    "use strict";
    app.controller("asset.admin.customers.ctrl", customerCtrl);
    customerCtrl.$inject = ['$modal', '$scope', '$rootScope', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants'];

    function customerCtrl($modal, $scope, $rootScope, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants) {

        $scope.busyingload = true;

        $scope.openDeleteDialog = openDeleteDialog;
        $scope.addCustomer = addCustomer;
        $scope.editCustomer = editCustomer;
        $scope.createCustomer = createCustomer;
        $scope.loadCustomer = loadCustomer;
        $scope.updateCustomer = updateCustomer;
        $scope.page = 0;
        $scope.pagesCount = 0;
        $rootScope.searchCustomer = searchCustomer;
        $scope.totalCount = 0;
        $scope.clearSearch = clearSearch;
        $scope.items = [];
        $scope.transMode = 'add';

        $scope.page2 = 0;
        $scope.pagesCount2 = 0;
        $scope.searchCustLocTran = searchCustLocTran;
        $scope.totalCount2 = 0;

        function searchCustomer(page) {
            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterCustomers
                }
            };
            apiService.get('/api/customers/search/', config,
            customersLoadCompleted,
            customersLoadFailed);
        }

        function customersLoadCompleted(result) {
            $scope.customersList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }
        function customersLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }

        function searchCustLocTran(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: 3,
                    filter: $routeParams.id
                }
            };
            apiService.get('/api/custloctran/search/', config,
            custLocTranLoadCompleted,
            custLocTranLoadFailed);
        }

        function custLocTranLoadCompleted(result) {
            $scope.items = result.data.Items;
            $scope.page2 = result.data.Page;
            $scope.pagesCount2 = result.data.TotalPages;
            $scope.totalCount2 = result.data.TotalCount;
        }

        function custLocTranLoadFailed(response) {
            Notification.error(response.data);
        }

        function openDeleteDialog(customer) {
            $scope.customer = customer;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/customer/deleteCustomerModal.html',
                controller: 'asset.admin.customers.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        $scope.headertemplate = [
            { title: 'Code', property: 'CustLoc_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'CustLoc_Name', show: true, width: '300px', type: 'value' }
        ]
        //Transport parameters
        $scope.transport = {
            method: 'get',
            read: constants.apiServiceBaseUri+'/api/customerLocations/list',
            params: ''
        }

        $scope.clearItem = function () {
            $scope.transMode = 'add';
            $scope.item = {
                CustLoc_Cd: '',
                CustLoc_Name: '',
                flag:''
            }
            console.log($scope.items)
        }

        $scope.addUpdateItem = function () {

            if ($scope.item.CustLoc_Cd != '' && $scope.item.CustLoc_Cd != null &&
                $scope.item.CustLoc_Name != null && $scope.item.CustLoc_Name != '') {
                if ($scope.transMode == 'update') {
                    $scope.items[$scope.activeIndex].CustLoc_Cd = $scope.item.CustLoc_Cd;
                    $scope.items[$scope.activeIndex].CustLoc_Name = $scope.item.CustLoc_Name;
                    $scope.items[$scope.activeIndex].flag = 'U';
                }
                else {
                    var isDuplicate = false;
                    for (var i = 0; i < $scope.items.length; i++) {
                        if ($scope.items[i].CustLoc_Cd === $scope.item.CustLoc_Cd)
                            isDuplicate = true;
                    }
                    if (isDuplicate === true)
                        Notification.error('Duplicate item canot be added');
                    else
                        $scope.items.push(angular.copy($scope.item));
                }
                $scope.clearItem();
            }
            else {
                Notification.error('Please enter valid Item');
            }
        }

        $scope.updateItem = function (item, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.item = angular.copy(item);

        }

        $scope.deleteitem = function (item, index) {

            $scope.activeIndex = index;
            $scope.transMode = 'delete';

            $scope.items.splice(index, 1);
        }

        ////uderscore js start

         //$scope.addupdateitem = function () {
         //     //  console.log($scope.item.Item);
         //     $scope.transmode = 'add';
         //     if (angular.isUndefined($scope.item)) {
         //         return falseman
         //     }
         //     $scope.decfactor = {
         //         Item: $scope.item.Item
         //     }
         //     var cont = manageseqservice.check($scope.transmode, $scope.saved_lst, $scope.temp_lst, $scope.decfactor);
         //     console.log(cont);
         //     //Insert case
         //     if (cont == 1) {
         //         $scope.temp_lst.push({
         //             Item: $scope.item.Item,
         //             ItemName: $scope.item.CustLoc_Name,
                  
         //             flag: 'I'
         //         });
         //         $scope.bind_lst.push({
         //             Item: $scope.CustLoc_Cd,
         //             ItemName: $scope.item.CustLoc_Name,
         //         });
         //     }
   
         //     // Update cases
         //     if (cont == '32') {
         //         //not in temp list
         //         //Flag U - Insert
         //         $scope.temp_lst.push({
         //             Item: $scope.item.CustLoc_Cd,
         //             ItemName: $scope.item.CustLoc_Name,
         //             flag: 'U'
         //         });
         //     }
         //     if (cont == '34') {
         //         //both in temp list and save list
         //         //Flag U - Update
         //         $scope.decfactor = {
         //             Item: $scope.item.Item
         //         }
         //         var pos = _.findIndex($scope.temp_lst, $scope.decfactor);
         //         console.log(pos);
         //         $scope.temp_lst[$scope.currentindex] = {
         //             Item: $scope.item.CustLoc_Cd,
         //             ItemName: $scope.item.CustLoc_Name,
         //             flag: 'U'
         //         };
         //     }
         //     if (cont == '14') {
         //         //not in save list
         //         //Flag I - Update
         //         $scope.decfactor = {
         //             Item: $scope.item.Item
         //         }
         //         var pos = _.findIndex($scope.temp_lst, $scope.decfactor);
         //         console.log(pos);
         //         $scope.temp_lst[pos] = {
         //             Item: $scope.item.CustLoc_Cd,
         //             ItemName: $scope.item.CustLoc_Name,
                  
         //             flag: 'I'
         //         };
         //     }
         //     $scope.flattened_temp_list = JSON.stringify($scope.temp_lst);
         //     $scope.flattened_bind_list = JSON.stringify($scope.bind_lst);
   
         //     $scope.clearitem();
         // }
   
         //$scope.updateitem = function (item, index) {
         //    $scope.transmode = 'update';
         //    $scope.item = item;
         //}
   
         //$scope.clearitem = function () {
         //     $scope.transmode = 'add';
         //     $scope.item = {};
         // }
   
         //$scope.deleteitem = function (item) {
         //     $scope.transmode = 'delete'
         //     $scope.delitem = item;
         //     $scope.decfactor = {
         //         item: $scope.delitem.CustLoc_Cd
         //     }
         //     var cont = manageseqservice.check($scope.transmode, $scope.saved_lst, $scope.temp_lst, $scope.decfactor);
         //     console.log(cont);
         //     // Delete cases
         //     if (cont == '32') {
         //         //not in temp list
         //         //Flag D - Insert
         //         $scope.decfactor = {
         //             item: $scope.delitem.item
         //         }
         //         $scope.temp_lst.push({
         //             Item: $scope.item.CustLoc_Cd,
         //             ItemName: $scope.item.ItemName,
                  
         //             flag: 'D'
         //         });
         //         var pos = _.findIndex($scope.bind_lst, $scope.decfactor);
         //         console.log(pos);
         //         $scope.bind_lst.splice(pos, 1);
         //     }
         //     if (cont == '34') {
         //         //both in temp list and save list
         //         //Flag D - Update
         //         $scope.decfactor = {
         //             Item: $scope.delitem.Item
         //         }
         //         var pos = _.findIndex($scope.temp_lst, $scope.decfactor);
         //         $scope.temp_lst[pos] = {
         //             Item: $scope.item.CustLoc_Cd,
         //             ItemName: $scope.item.ItemName,
         //             flag: 'D'
         //         };
         //         var pos = _.findIndex($scope.bind_lst, $scope.decfactor);
         //         $scope.bind_lst.splice(pos, 1);
   
         //     }
         //     if (cont == '14') {
         //         //not in save list
         //         //Remove
         //         $scope.decfactor = {
         //             item: $scope.delitem.item
         //         }
         //         var pos = _.findIndex($scope.temp_lst, $scope.decfactor);
         //         $scope.temp_lst.splice(pos, 1);
         //         var pos = _.findIndex($scope.bind_lst, $scope.decfactor);
         //         $scope.bind_lst.splice(pos, 1);
         //     }
   
         //     $scope.flattened_temp_list = JSON.stringify($scope.temp_lst);
         //     $scope.flattened_bind_list = JSON.stringify($scope.bind_lst);
         //     $scope.clearitem();
         // }
   
        ////uderscore js end

        function editCustomer(ID) {
            $location.path('/customers/edit/' + ID);
        }
        function addCustomer() {
            $scope.items = {};
            $location.path("/customers/new");
        }

        function loadCustomer() {
            if ($routeParams.id != undefined) {
                membershipService.getSingleCustomer($routeParams.id, completedLoadCustomer);
            }
        }

        function completedLoadCustomer(result) {
            $scope.customer = result.data;
            //apiService.get('/api/custloctran/getall/' + $routeParams.id, null,
            //custloctransCompleted,
            //custloctransFailed);
            searchCustLocTran(0);
        }

        function custloctransCompleted(result) {
            $scope.items = result.data;
        }

        function custloctransFailed(data) {
            console.log(data);
        }

        function createCustomer(customer) {
            $scope.customer.Usr_Id = $scope.repository.loggedUser.username;
            $scope.customer.CustLocation = $scope.items;
            apiService.post('/api/customers/add/', $scope.customer,
            createCustomerCompleted,
            createCustomerFailed);
        }

        function createCustomerCompleted(response) {
            Notification.success($scope.customer.AC_DESC + ' has been added');

            $rootScope.searchCustomer();
            $scope.customer = {};
            $location.url('customers');

        }

        function createCustomerFailed(response) {
            Notification.error(response.data);
            $location.url('customers');

        }

        function updateCustomer() {
            $scope.customer.USER_ID = $scope.repository.loggedUser.username;
            $scope.customer.CustLocation = $scope.items;
            apiService.post('/api/customers/update/', $scope.customer,
            updateCustomerCompleted,
            updateCustomerFailed);
        }

        function updateCustomerCompleted(response) {
            Notification.success($scope.customer.AC_DESC + ' has been updated');
            $location.url('customers');
            $scope.customer = {};
        }

        function updateCustomerFailed(response) {
            Notification.error(response.data);
        }

        function clearSearch() {
            $scope.filterCustomers = '';
            searchCustomer();
        }
        $rootScope.searchCustomer();
    }
})(angular.module('AssetAdminApp'));
