(function (app) {
    "use strict";
    app.controller("asset.admin.assetEnquiry.ctrl", assetEnquiry);
    assetEnquiry.$inject = ['$modal', '$http', '$scope', '$rootScope', '$filter', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants', 'commonFunctions'];

    function assetEnquiry($modal, $http, $scope, $rootScope, $filter, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants, commonFunctions) {


        $scope.GetAssetDetails = GetAssetDetails;
        $scope.assetTransfer = assetTransfer;
        $rootScope.astId = '';
        $scope.enquiry = {};
        $rootScope.assetName = '';
        function GetAssetDetails(enquiry) {
            $scope.detailsList = [];
            if ($scope.enquiry.purchdate != undefined && $scope.enquiry.purchdate != "")
                $scope.enquiry.Purch_Date = angular.copy(commonFunctions.formatDate($scope.enquiry.purchdate));
            apiService.post('/api/assetEnquiry/GetAssetEnquiry/', $scope.enquiry,
            assetDetailsCompleted, assetDetailsFailed);
        }

        function assetDetailsCompleted(response) {

            $scope.detailsList = response.data;
            if ($scope.detailsList.length == 0)
                Notification.error("No data found");

        }

        function assetDetailsFailed(response) {

            console.log(response.data);

        }

        function assetTransfer(astId,assetName) {

            console.log('chk asset id :' + astId);
            $rootScope.assetName = assetName;
            $rootScope.astId = astId;
            $location.url('/reports/assetTransferEnquiry');
           // $location.url('/transactions/assetTransfer');

            
        }
        


        $scope.ownership = [

         { title: 'Type', property: 'OWS_Cd', show: true, width: '100px', type: 'text' },
         { title: 'Name', property: 'OWS_Name', show: true, width: '300px', type: 'value' },
        ]


        $scope.loadOwnership = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/ownerships/GetOwnerShip',
            params: ''
        }

        $scope.assetType = [

         { title: 'Type', property: 'Atp_Cd', show: true, width: '100px', type: 'text' },
         { title: 'Name', property: 'Atp_Name', show: true, width: '300px', type: 'value' },
        ]


        $scope.loadAssetType = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assettypes/GetType',
            params: ''
        }


        $scope.headerAssetId = [
          { title: 'Id', property: 'Ast_Id', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Ast_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadAssetId = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assetTransfer/GetAsset',
            params: ''
        }


        $scope.headerDepartment = [
          { title: 'Id', property: 'Dept_Cd', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Dept_Name', show: true, width: '300px', type: 'value' },
        ]



        $scope.loadDepartment = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/departments/list',
            params: ''
        }


        $scope.headerLocation = [
            { title: 'Id', property: 'Loc_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Loc_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadLocation = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/locations/list',
            params: ''
        }


        $scope.headerEmployee = [
           { title: 'Id', property: 'Emp_Cd', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Emp_Name', show: true, width: '200px', type: 'value' }
        ]

        $scope.loadEmployee = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/employees/list',
            params: ''
        }

        $scope.headerCustomer = [
           { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' }
        ]
        $scope.loadCustomer = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/customers/list',
            params: ''
        }


        $scope.headerSuppliers = [

            { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
            { title: 'Add', property: 'ADDRESS1', show: false }
        ]


        $scope.loadSupplier = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/suppliers/list',
            params: ''
        }





    }
}
)(angular.module('AssetAdminApp'));

