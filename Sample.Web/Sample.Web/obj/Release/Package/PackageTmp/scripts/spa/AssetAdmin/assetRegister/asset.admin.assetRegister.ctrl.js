(function (app) {
    "use strict";
    app.controller("asset.admin.assetRegister.ctrl", assetRegister);
    assetRegister.$inject = ['$modal', '$http', '$scope', '$rootScope', '$filter', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants', 'commonFunctions', 'FileUploader', '$cookieStore'];

    function assetRegister($modal, $http, $scope, $rootScope, $filter, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants, commonFunctions, FileUploader, $cookieStore) {

        $scope.calcPurchVal = calcPurchVal;
        $scope.calcAssetValue = calcAssetValue;
        $rootScope.searchAssetRegister = searchAssetRegister;
        $scope.addAssetRegister = addAssetRegister;
        $scope.editAssetRegister = editAssetRegister;
        $scope.loadAssetRegister = loadAssetRegister;
        $scope.updateAssetRegister = updateAssetRegister;
        $scope.createAssetRegister = createAssetRegister;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.calcDeprciation = calcDeprciation;
        $scope.calcDiscAmt = calcDiscAmt;
        $scope.clearSearch = clearSearch;
        $scope.transMode = 'add';
        $scope.calcUsefulLife = calcUsefulLife;
        $scope.AddAssetItemLst = AddAssetItemLst;
        $scope.AstId = '';
        //$scope.DocUrl = DocUrl;
        $scope.deleteImage = deleteImage;
        $scope.deleteDocs = deleteDocs;
        $scope.ClickAssetImage = ClickAssetImage;
        $scope.ClickAssetDocs = ClickAssetDocs;
        $scope.item = {};
        $scope.busyingload = true;
        $scope.openDatePicker = openDatePicker;
        $scope.defaultDep = false;
        $scope.defaultLoc = false;
        $scope.getImage = getImage;
        $scope.ImgList = {};

        $scope.CheckGl = CheckGl;
        $scope.CheckOwnership = CheckOwnership;
        $scope.CheckSupplier = CheckSupplier;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};
        var uploader = $scope.uploader = new FileUploader({
            url: constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + "AstId"
        });


        var uploaderDoc = $scope.uploaderDoc = new FileUploader({
            url: constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + "AstId"
        });


        $scope.finOpenDate = $filter('date')(new Date(), 'dd-MM-yyyy');
        $scope.finEnddate = $filter('date')(new Date(), 'dd-MM-yyyy');
        $scope.CalNetDepreciation = CalNetDepreciation;

        this.tab = 1;
        this.setTab = function (tabId) {
            this.tab = tabId;
        };

        this.isSet = function (tabId) {
            return this.tab === tabId;
        };

        function searchAssetRegister(page) {

            $scope.busyingload = true;
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: constants.pageSize,
                    filter: $scope.filterAssetRegister
                }
            };
            apiService.get('/api/assetRegister/search/', config,
            assetRegisterLoadCompleted,
            assetRegisterLoadFailed);
        }


        //vlidation
        function CheckGl(GlAc) {
            if (angular.isUndefined(GlAc) || GlAc == '') return;
            apiService.get('/api/assetRegister/CheckGlAccount/' + GlAc, null,
            CheckGlComplete,
            FailedCheck);

        }

        function CheckGlComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.assetRegister.Gl_AcCd = '';
                Notification.error('Please enter proper GL Account')
            }
        }


        function CheckOwnership(OwsCd) {
            if (angular.isUndefined(OwsCd) || OwsCd == '') return;
            apiService.get('/api/assetRegister/CheckOwnership/' + OwsCd, null,
            OwnershipComplete,
            FailedCheck);

        }

        function OwnershipComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.assetRegister.OWS_Cd = '';
                $scope.assetRegister.OWS_Name = '';
                Notification.error('Please enter proper ownership code')
            }
        }



        function CheckSupplier(SupCd) {
            if (angular.isUndefined(SupCd) || SupCd == '') return;
            apiService.get('/api/assetRegister/CheckSupplier/' + SupCd, null,
            supplierComplete,
            FailedCheck);

        }

        function supplierComplete(response) {

            if (response.data == false)
                return
            else {
                $scope.assetRegister.Sup_Cd = '';
                $scope.assetRegister.AC_DESC = '';
                $scope.assetRegister.ADDRESS1 = '';
                Notification.error('Please enter proper supplier code')
            }
        }


        function FailedCheck() { }



        //Calculate net depreciation

        function CalNetDepreciation() {


            $scope.calcDepreciation = {};
            $scope.calcDepreciation.Ast_Purch_Dt = $scope.assetRegister.Ast_Purch_Dt;
            $scope.calcDepreciation.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.calcDepreciation.Ast_Purch_Dt));
            $scope.calcDepreciation.Ast_SalvageValue = $scope.assetRegister.Ast_SalvageValue;
            $scope.calcDepreciation.Ast_UsefulLife = $scope.assetRegister.Ast_UsefulLife;
            $scope.calcDepreciation.Ast_Purch_Value = $scope.assetRegister.Ast_Purch_Value;

            apiService.post('/api/assetRegister/calcNetDepreciation/', $scope.calcDepreciation,
                calcDepreCompleted, calcDepreRegFailed)

        }

        function AddAssetItemLst() {
            AddAssetItem();
        }

        function calcDepreCompleted(response) {

            $scope.assetRegister.Ast_TotDepre = response.data.Ast_TotDepre.toFixed(3);
            $scope.assetRegister.Ast_Book_Value = response.data.Ast_Book_Value.toFixed(3);
            $scope.assetRegister.Asv_Acq_Dt = $filter('date')(response.data.Asv_Acq_Dt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Purch_Dt = $filter('date')(response.data.Ast_Purch_Dt, 'dd-MM-yyyy');

        }

        function calcDepreRegFailed() { }
        //GetGiAc

        function ClickAssetImage(assetName, ImgName) {

            $scope.ImageUrl = constants.apiServiceBaseUri + '/content/assetimages/' + assetName + '/' + ImgName;

        }


        function ClickAssetDocs(assetName, DocName, DocType) {

            $scope.DocUrl = constants.apiServiceBaseUri + '/content/assetdocs/' + assetName + '/' + DocName;
            $scope.DocTypeUrl = constants.apiServiceBaseUri + '/content/assetdocs/' + DocType;

        }

        function deleteImage(imageItem, index) {
            var ImgObj = {
                params: {
                    assetId: $scope.assetRegister.ImgList[index].Ast_Id,
                    imageName: $scope.assetRegister.ImgList[index].Image_Name
                }
            };

            $scope.deleteImage.AstId = $scope.assetRegister.ImgList[index].Ast_Id;
            $scope.deleteImage.ImageName = $scope.assetRegister.ImgList[index].Image_Name;
            $scope.assetRegister.ImgList.splice(index, 1);
            apiService.get('/api/assetRegister/deleteimages/', ImgObj,
                delteFileCompleted, delteFileFailed);

        }

        function delteFileCompleted() {

        }

        function delteFileFailed() {

        }


        function deleteDocs(docItem, index) {
            var DocObj = {
                params: {
                    assetId: $scope.assetRegister.DocList[index].Ast_Id,
                    docName: $scope.assetRegister.DocList[index].Doc_Name
                }
            };
            $scope.assetRegister.DocList.splice(index, 1);
            apiService.get('/api/assetRegister/deleteDocs/', DocObj,
                delteFileCompleted, delteFileFailed);

        }


        function ImageUrl() { }

        function getImage() {

            apiService.get('/api/assetRegister/getImagUrl/' + $scope.AstId, null,
            imgLoadCompleted,
            imgLoadFailed);

        }

        //  function TestUpload() {
        //      $scope.uploader.uploadAll();
        //  }

        function imgLoadCompleted(result) {
            $scope.assetRegister.ImgList = result.data;

            for (var i = 0; $scope.assetRegister.ImgList.length > i; i++) {

                $scope.assetRegister.ImgList[i].ImagePath = constants.apiServiceBaseUri + '/content/assetimages/' + $scope.assetRegister.ImgList[i].Ast_Id + '/' + $scope.assetRegister.ImgList[i].Image_Name;

            }

        }

        function imgLoadFailed() {

        }

        function getDocs() {

            apiService.get('/api/assetRegister/getDocUrl/' + $scope.AstId, null,
            docLoadCompleted,
            docLoadFailed);

        }


        //  function TestUpload() {
        //      $scope.uploader.uploadAll();
        //  }

        function docLoadCompleted(result) {
            $scope.assetRegister.DocList = result.data;

            for (var i = 0; $scope.assetRegister.DocList.length > i; i++) {

                $scope.assetRegister.DocList[i].DocPath = constants.apiServiceBaseUri + '/content/assetdocs/' + $scope.assetRegister.DocList[i].Ast_Id + '/' + $scope.assetRegister.DocList[i].Doc_Name;
            }

        }


        function docLoadFailed() {

        }

        function calcDiscAmt() {

            if ($scope.assetRegister.Ast_PurchDisc_Perc == undefined) return;
            if ($scope.assetRegister.Ast_PurchDisc_Amt == undefined)
                $scope.assetRegister.Ast_PurchDisc_Amt = 0;
            $scope.assetRegister.Ast_PurchDisc_Amt = ($scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_PurchDisc_Perc / 100);
            $scope.assetRegister.Ast_Purch_Value = $scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_Purch_Qty - $scope.assetRegister.Ast_Purch_Qty * $scope.assetRegister.Ast_PurchDisc_Amt
            $scope.assetRegister.Ast_Book_Value = $scope.assetRegister.Ast_Purch_Value;
            CalNetDepreciation();
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
           { title: 'Name', property: 'Emp_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadEmployee = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/employees/list',
            params: ''
        }
        $scope.headerCustLocation = [
         { title: 'Id', property: 'CustLoc_Cd', show: true, width: '50px', type: 'text' },
         { title: 'Name', property: 'CustLoc_Name', show: true, width: '120px', type: 'value' }
        ]

        $scope.loadCustLocation = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/custloctran/list',
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


        $scope.ownership = [

          { title: 'Type', property: 'OWS_Cd', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'OWS_Name', show: true, width: '300px', type: 'value' },
        ]

        //GetGiAc
        $scope.loadOwnership = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/ownerships/GetOwnerShip',
            params: ''
        }

        $scope.assetType = [

          { title: 'Type', property: 'Atp_Cd', show: true, width: '50px', type: 'text' },
          { title: 'Name', property: 'Atp_Name', show: true, width: '200px', type: 'value' },
        ]


        $scope.loadAssetType = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assettypes/GetType',
            params: ''
        }



        $scope.getAssetIdEvent = function (response) {
            if ($scope.assetRegister.ID != undefined) return;
            apiService.get('/api/assetRegister/GetLatestAssetId/' + response[0], null,
            getAssetIdComplete,
            getAssetIdFailed);

        }

        function getAssetIdComplete(response) {
            $scope.assetRegister.Ast_Id = response.data.Ast_Id;
            $scope.assetRegister.Ast_UsefulLife = response.data.Atp_UsefulLife
            calcDeprciation();
            CalNetDepreciation();
            //depreciation logic

            //
        }



        function getAssetIdFailed(response) {
            Notification.error(response.data);
        }


        $scope.clearItem = function (event) {
            event.preventDefault();
            $scope.transMode = 'add';
            $scope.item = {
                CustLoc_Cd: '',
                CustLoc_Name: '',
                flag: 'D'
            }
        }

        function calcAssetValue() {
            $scope.assetRegister.Ast_Purch_Qty = '1';
            calcPurchVal();

        }

        function calcPurchVal() {

            if ($scope.assetRegister.option == 'S') {
                $scope.assetRegister.Ast_Purch_Qty = 1;
                $scope.assetRegister.Ast_Qty = '1';
            }
            if ($scope.assetRegister.Ast_PurchDisc_Amt == undefined)
                $scope.assetRegister.Ast_PurchDisc_Amt = 0;
            $scope.assetRegister.Ast_Purch_Value = $scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_Purch_Qty - $scope.assetRegister.Ast_Purch_Qty * $scope.assetRegister.Ast_PurchDisc_Amt
            $scope.assetRegister.Ast_Book_Value = $scope.assetRegister.Ast_Purch_Value;
            CalNetDepreciation();
            AddAssetItem();

        }

        function AddAssetItem() {
            $scope.assetRegister.AssetItem = [];
            for (var i = 0 ; i < $scope.assetRegister.Ast_Purch_Qty ; i++) {

                $scope.item.Ast_SlNo = i + 1;
                if ($scope.assetRegister.defaultDep == true) {
                    $scope.item.Ds_Id = constants.defaultDsId;
                    $scope.item.Dept_Name = constants.defaultDeptName;
                }
                if ($scope.assetRegister.defaultLoc == true) {
                    $scope.item.Loc_Cd = constants.defaultLocCd;
                    $scope.item.Loc_Name = constants.defaultLocName;
                }
                $scope.assetRegister.AssetItem.push(angular.copy($scope.item));
            }
            $scope.item = {};

        }

        //assetRegister.AssetItem
        $scope.addUpdateItem = function (event) {
            event.preventDefault();
            if ($scope.item != undefined && $scope.item.Ast_SlNo != undefined &&
                        $scope.item.Ast_SlNo != '' && $scope.item.Ast_SlNo != null) {
                if ($scope.transMode == 'update') {

                    if (isEmpty($scope.item.Ds_Id) && isEmpty($scope.item.Ds_Id) && isEmpty($scope.item.Loc_Cd)
                        && isEmpty($scope.item.Emp_Cd) && isEmpty($scope.item.Ac_Cd) &&
                        isEmpty($scope.item.CustLoc_Cd)) {

                        Notification.error('Please enter atleast one item details');
                        return;
                    }


                    $scope.assetRegister.AssetItem[$scope.activeIndex].Ast_SlNo = $scope.item.Ast_SlNo;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Ds_Id = $scope.item.Ds_Id;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Dept_Name = $scope.item.Dept_Name;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Loc_Cd = $scope.item.Loc_Cd;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Loc_Name = $scope.item.Loc_Name;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Emp_Cd = $scope.item.Emp_Cd;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Emp_Name = $scope.item.Emp_Name;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].Ac_Cd = $scope.item.Ac_Cd;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].AC_DESC = $scope.item.AC_DESC;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].CustLoc_Cd = $scope.item.CustLoc_Cd;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].CustLoc_Name = $scope.item.CustLoc_Name;
                    $scope.assetRegister.AssetItem[$scope.activeIndex].flag = 'U';
                    $scope.clearItem(event);
                }
                else {
                    if ($scope.assetRegister.AssetItem === undefined) $scope.assetRegister.AssetItem = [];

                    if (isEmpty($scope.item.Ds_Id) && isEmpty($scope.item.Ds_Id) && isEmpty($scope.item.Loc_Cd)
                        && isEmpty($scope.item.Emp_Cd) && isEmpty($scope.item.Ac_Cd) &&
                        isEmpty($scope.item.CustLoc_Cd)) {

                        Notification.error('Please enter atleast one item details');
                        return;
                    }

                    if ($scope.assetRegister.AssetItem.length >= $scope.assetRegister.Ast_Purch_Qty) {
                        Notification.error('Allocation canot be added more than purchase quantity');
                        return;
                    }
                    $scope.item.Ds_Id = $scope.item.Ds_Id;
                    $scope.item.flag = 'A';
                    $scope.assetRegister.AssetItem.push(angular.copy($scope.item));
                    $scope.clearItem(event);
                }
            }
            else {
                Notification.error('Please enter product SrNo');
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
            $scope.assetRegister.AssetItem.splice(index, 1);
        }


        function isEmpty(val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        }


        function calcUsefulLife() {

            if ($scope.assetRegister != undefined &&
                $scope.assetRegister.Ast_DeprePer != undefined && $scope.assetRegister.Ast_DeprePer != 0)
                $scope.assetRegister.Ast_UsefulLife = (100 / $scope.assetRegister.Ast_DeprePer).toFixed(2);

            else
                $scope.assetRegister.Ast_UsefulLife = 0;
            CalNetDepreciation();

        }

        function calcDeprciation() {

            if ($scope.assetRegister != undefined &&
                $scope.assetRegister.Ast_UsefulLife != undefined &&
                $scope.assetRegister.Ast_UsefulLife != 0 && $scope.assetRegister.Ast_UsefulLife != ''
                ) {
                $scope.assetRegister.Ast_DeprePer = (100 / $scope.assetRegister.Ast_UsefulLife).toFixed(3);
            }
            else
                $scope.assetRegister.Ast_DeprePer = 0;
        }

        function assetRegisterLoadCompleted(result) {

            $scope.assetRegisterList = result.data.Items;
            $scope.page = result.data.Page;
            $scope.pagesCount = result.data.TotalPages;
            $scope.totalCount = result.data.TotalCount;
            $scope.busyingload = false;
        }

        function assetRegisterLoadFailed(response) {
            Notification.error(response.data);
            $scope.busyingload = false;
        }

        function editAssetRegister(ID) {
            $rootScope.assetRegister = {};
            $location.path('/assetRegister/edit/' + ID);

        }

        function addAssetRegister() {
            $location.path("/assetRegister/new");
        }

        function loadAssetRegister() {

            if ($routeParams.id != undefined) {
                membershipService.getSingleAssetRegister($routeParams.id, completedAsstReg);
            }
            else {
                $scope.assetRegister = {};
                $scope.assetRegister.option = 'S';
                $scope.assetRegister.Ast_Status = 'ACTIVE';
                $scope.assetRegister.Ast_Purch_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
                $scope.assetRegister.Asv_Acq_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
                calcAssetValue();
            }

        }


        function completedAsstReg(result) {

            $scope.assetRegister = result.data;
            $scope.assetRegister.AssetItem = result.data.assetItemLst;
            $scope.assetRegister.Ast_LastInst_DueDt = $filter('date')($scope.assetRegister.Ast_LastInst_DueDt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Warranty_Dt = $filter('date')($scope.assetRegister.Ast_Warranty_Dt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Purch_Dt = $filter('date')($scope.assetRegister.Ast_Purch_Dt, 'dd-MM-yyyy');

            $scope.AstId = $scope.assetRegister.Ast_Id;

            if ($scope.assetRegister.Ast_Purch_Qty == 1)
                $scope.assetRegister.option = 'S';
            else
                $scope.assetRegister.option = 'M';
            $scope.assetRegister.ImgList = {};
            $scope.assetRegister.DocList = {};
            getImage();//get image list
            getDocs();
        }


        function updateAssetRegister() {

            $scope.assetRegister.Ast_LastInst_DueDt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_LastInst_DueDt));
            $scope.assetRegister.Ast_Warranty_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Warranty_Dt));
            $scope.assetRegister.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Purch_Dt));
            $scope.assetRegister.Usr_Id = $cookieStore.get('loggedUserName');
            $scope.AstId = $scope.assetRegister.Ast_Id;
            if ($scope.assetRegister.AssetItem.length != $scope.assetRegister.Ast_Purch_Qty) {
                Notification.error('Allocation should be equal to purchase quantity');
                return;
            }


            if (checkField($scope.assetRegister.Usr_Id)) {
                Notification.error('user session error.please logout and login !!!');
                return;
            }


            apiService.post('/api/assetRegister/update/', $scope.assetRegister,
            updateAssetRegCompleted,
            updateAssetRegFailed);
        }

        function updateAssetRegCompleted(response) {
            Notification.success($scope.assetRegister.Ast_Name + ' has been updated');
            $scope.uploader.uploadAll();
            $scope.uploaderDoc.uploadAll();
            $scope.assettype = {};
            $location.url('assetRegister')
        }

        function updateAssetRegFailed(response) {
            Notification.error(response.data);
        }

        function checkField(value) {

            if (value == undefined || value == '' || value == null)
                return true;
            else
                return false;

        }

        function createAssetRegister() {


            if (checkField($scope.assetRegister.Ast_Name)) {
                Notification.error('Please enter asset name !!!');
                return;
            }


            if (checkField($scope.assetRegister.Ast_Desc)) {
                Notification.error('Please enter Description !!!');
                return;
            }

            if (checkField($scope.assetRegister.Ast_Warranty_Dt)) {
                Notification.error('Plesae enter Expiry Date !!!');
                return;
            }


            if (checkField($scope.assetRegister.Ast_Purch_Dt)) {
                Notification.error('Please enter purchase Date !!!');
                return;
            }


            if (checkField($scope.assetRegister.Ast_Purch_Rate)) {
                Notification.error('Please enter purchase rate !!!');
                return;
            }

            if (checkField($scope.assetRegister.Ast_Id)) {
                Notification.error('Please enter asset type!!!');
                return;
            }


            if ($scope.assetRegister.Ast_Purch_Qty != $scope.assetRegister.AssetItem.length) {
                Notification.error('Purchase quantity and number of asset should be same!!!');
                return;

            }

            if ($scope.assetRegister.AssetItem === undefined) $scope.assetRegister.AssetItem = [];

            if ($scope.assetRegister.Ast_LastInst_DueDt != undefined)
                $scope.assetRegister.Ast_LastInst_DueDt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_LastInst_DueDt));
            else
                $scope.assetRegister.Ast_LastInst_DueDt = angular.copy(commonFunctions.formatDate($filter('date')(new Date(), 'dd-MM-yyyy')));
            $scope.assetRegister.Ast_Warranty_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Warranty_Dt));
            $scope.assetRegister.Ast_Purch_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Ast_Purch_Dt));
            $scope.assetRegister.Asv_Acq_Dt = angular.copy(commonFunctions.formatDate($scope.assetRegister.Asv_Acq_Dt));
            $scope.assetRegister.Usr_Id = $scope.repository.loggedUser.username;

            if ($scope.assetRegister.AssetItem.length != $scope.assetRegister.Ast_Purch_Qty) {
                Notification.error('Allocation should be equal to purchase quantity');
                return;
            }


            $scope.assetRegister.AssetItem = $scope.assetRegister.AssetItem;
            apiService.post('/api/assetRegister/add/', $scope.assetRegister,
            createAssetRegCompleted,
            createAssetRegFailed);
        }

        function createAssetRegCompleted(response) {

            Notification.success($scope.assetRegister.Ast_Name + ' has been added');
            $scope.AstId = $scope.assetRegister.Ast_Id;
            $scope.uploader.uploadAll();
            $scope.uploaderDoc.uploadAll();
            $rootScope.searchAssetRegister();
            $scope.assetRegister = {};
            $location.url('assetRegister');
        }

        function createAssetRegFailed(response) {
            Notification.error(response.data);
            $location.url('assetRegister');
        }


        $scope.headerSuppliers = [

            { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' },
            { title: 'Add', property: 'ADDRESS1', show: false }
        ]

        $scope.supplierEventHandler = function (response) {
            $scope.$apply(function () {
                $scope.assetRegister.ADDRESS1 = response[2];
            });
        }

        $scope.loadSupplier = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/suppliers/list',
            params: ''
        }



        $scope.headerGiAc = [

            { title: 'GI/AC', property: 'Ac_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Ac_Desc', show: true, width: '300px', type: 'value' },
        ]

        //GetGiAc
        $scope.loadGiAc = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assetRegister/GetGiAc',
            params: ''
        }


        $scope.headerGetDepAc = [

           { title: 'GI/AC', property: 'Ac_Cd', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Ac_Desc', show: true, width: '300px', type: 'value' },
        ]

        //GetGiAc
        $scope.loadGetDepAc = {
            method: 'get',
            read: constants.apiServiceBaseUri + '/api/assetRegister/GetDepAc',
            params: ''
        }



        function openDeleteDialog(assetRegister) {
            $scope.assetRegister = assetRegister;
            $modal.open({
                templateUrl: 'scripts/spa/AssetAdmin/assetRegister/deleteAssetRegModal.html',
                controller: 'asset.admin.assetRegister.edit.ctrl',
                scope: $scope,
                backdrop: 'static',
                keyboard: false
            }).result.then(function ($scope) {
            }, function () {
            });
        }

        function clearSearch() {
            $scope.filterAssetRegister = '';
            searchAssetRegister();
        }

        $rootScope.searchAssetRegister();

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        // Image Uploader


        uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {

                return this.queue.length < 10;
            }
        });

        // an async filter
        uploader.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {

                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

        };
        uploader.onAfterAddingFile = function (fileItem) {

        };
        uploader.onAfterAddingAll = function (addedFileItems) {

        };
        uploader.onBeforeUploadItem = function (item) {

            uploader.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + $scope.AstId
            item.url = uploader.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + $scope.AstId

        };
        uploader.onProgressItem = function (fileItem, progress) {

        };
        uploader.onProgressAll = function (progress) {

        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {

        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {

        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {

        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {

        };
        uploader.onCompleteAll = function () {

        };


        //doc upload
        uploaderDoc.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {

                return this.queue.length < 10;
            }
        });

        // an async filter
        uploaderDoc.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {

                setTimeout(deferred.resolve, 1e3);
            }
        });



        uploaderDoc.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

        };
        uploaderDoc.onAfterAddingFile = function (fileItem) {

        };
        uploaderDoc.onAfterAddingAll = function (addedFileItems) {

        };
        uploaderDoc.onBeforeUploadItem = function (item) {

            uploader.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + $scope.AstId
            item.url = uploader.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + $scope.AstId

        };
        uploaderDoc.onProgressItem = function (fileItem, progress) {

        };
        uploaderDoc.onProgressAll = function (progress) {

        };
        uploaderDoc.onSuccessItem = function (fileItem, response, status, headers) {

        };
        uploaderDoc.onErrorItem = function (fileItem, response, status, headers) {

        };
        uploaderDoc.onCancelItem = function (fileItem, response, status, headers) {

        };
        uploaderDoc.onCompleteItem = function (fileItem, response, status, headers) {

        };
        uploaderDoc.onCompleteAll = function () {

        };



    }
}
)(angular.module('AssetAdminApp'));

