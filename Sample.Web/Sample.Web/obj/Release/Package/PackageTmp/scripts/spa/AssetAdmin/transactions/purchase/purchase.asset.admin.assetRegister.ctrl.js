(function (app) {
    "use strict";
    app.controller("purchase.asset.admin.assetRegister.ctrl", assetPurchRegister);
    assetPurchRegister.$inject = ['$modal', '$modalInstance', '$http', '$scope', '$rootScope', '$filter', 'membershipService', 'apiService', 'LocationService', 'Notification', 'blockingservice', '$location', '$routeParams', 'constants', 'commonFunctions', 'FileUploader', '$cookieStore'];

    function assetPurchRegister($modal, $modalInstance, $http, $scope, $rootScope, $filter, membershipService, apiService, LocationService, Notification, blockingservice, $location, $routeParams, constants, commonFunctions, FileUploader, $cookieStore) {

        $scope.calcPurchValue = calcPurchValue;
        $scope.calcAssetValue = calcAssetValue;
        $rootScope.assetRegister = $rootScope.assetRegister;
        $scope.addAssetRegister = addAssetRegister;
        $scope.editAssetRegister = editAssetRegister;
        $scope.loadAssetPurchRegister = loadAssetPurchRegister;
        $scope.updateAssetRegister = updateAssetRegister;
        $scope.createAssetRegister = createAssetRegister;
        $scope.openDeleteDialog = openDeleteDialog;
        $scope.calcDeprciation = calcDeprciation;
        $scope.calcDiscAmount = calcDiscAmount;
        $scope.calcusefullife = calcusefullife;
        $scope.transMode = 'add';
        $scope.closeModal = closeModal;
        $scope.busyingload = true;
        $scope.openDatePicker = openDatePicker;

        //
        $scope.AddAssetItem = AddAssetItem;
        $scope.deleteImage = deleteImage;
        $scope.ClickAssetImage = ClickAssetImage;
        $scope.ClickAssetDoc = ClickAssetDoc;
        $scope.ImgList = {};
        $scope.AstId = '';
        $rootScope.InvokeFileUpload = InvokeFileUpload;
        $scope.CalNetDepreciation = CalNetDepreciation;

        //
        $scope.item1 = {};
        $scope.list = [];
        $scope.addUpdateItem1 = addUpdateItem1;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};

        this.tab = 1;
        this.setTab = function (tabId) {
            this.tab = tabId;
        };

        this.isSet = function (tabId) {
            return this.tab === tabId;
        };

        //
        function calcAssetValue() {
            ///  $scope.assetRegister.Ast_Qty = '1';
            calcPurchValue();

        }

        function calcPurchValue() {

            if ($scope.assetRegister.Ast_Thru_Purch == true) {

                if ($scope.assetRegister.Ast_Qty > $scope.assetRegister.purchaseQty) {
                    Notification.error('Purchase Qty must be less than or equal to P.O Balance Qty:' + $scope.purchaseQty);
                    $scope.assetRegister.Ast_Qty = 1;
                    // return;
                }

            }

            if ($scope.assetRegister.option == 'S')
                $scope.assetRegister.Ast_Qty = '1';
            if ($scope.assetRegister.Ast_PurchDisc_Amt == undefined)
                $scope.assetRegister.Ast_PurchDisc_Amt = 0;
            $scope.assetRegister.Ast_Purch_Value = $scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_Qty - $scope.assetRegister.Ast_Qty * $scope.assetRegister.Ast_PurchDisc_Amt
            $scope.assetRegister.Ast_Book_Value = $scope.assetRegister.Ast_Purch_Value;
            AddAssetItem();
            CalNetDepreciation();
        }


        function AddAssetItem() {
            $scope.assetRegister.list = [];
            for (var i = 0 ; i < $scope.assetRegister.Ast_Qty ; i++) {

                $scope.item1.Ast_SlNo = i + 1;
                if ($scope.assetRegister.defaultDep == true) {
                    $scope.item1.Ds_Id = constants.defaultDsId;
                    $scope.item1.Dept_Name = constants.defaultDeptName;
                }
                if ($scope.assetRegister.defaultLoc == true) {
                    $scope.item1.Loc_Cd = constants.defaultLocCd;
                    $scope.item1.Loc_Name = constants.defaultLocName;
                }
                $scope.assetRegister.list.push(angular.copy($scope.item1));
            }
            $scope.item1 = {};

        }

        function calcDiscAmount() {

            if ($scope.assetRegister.Ast_PurchDisc_Perc == undefined) $scope.assetRegister.Ast_PurchDisc_Perc = 0;
            if ($scope.assetRegister.Ast_PurchDisc_Amt == undefined)
                $scope.assetRegister.Ast_PurchDisc_Amt = 0;
            $scope.assetRegister.Ast_PurchDisc_Amt = ($scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_PurchDisc_Perc / 100);
            $scope.assetRegister.Ast_Purch_Value = $scope.assetRegister.Ast_Purch_Rate * $scope.assetRegister.Ast_Qty - $scope.assetRegister.Ast_Qty * $scope.assetRegister.Ast_PurchDisc_Amt
            $scope.assetRegister.Ast_Book_Value = $scope.assetRegister.Ast_Purch_Value;
            CalNetDepreciation();

        }

        $scope.headerDepartment = [
            { title: 'Id', property: 'Dept_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Dept_Name', show: true, width: '300px', type: 'value' },
        ]

        $scope.loadDepartment = {
            method: 'get',
            read: '/api/departments/list',
            params: ''
        }

        $scope.headerLocation = [
            { title: 'Id', property: 'Loc_Cd', show: true, width: '100px', type: 'text' },
            { title: 'Name', property: 'Loc_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadLocation = {
            method: 'get',
            read: '/api/locations/list',
            params: ''
        }

        $scope.headerEmployee = [
           { title: 'Id', property: 'Emp_Cd', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'Emp_Name', show: true, width: '300px', type: 'value' }
        ]

        $scope.loadEmployee = {
            method: 'get',
            read: '/api/employees/list',
            params: ''
        }
        $scope.headerCustLocation = [
         { title: 'Id', property: 'CustLoc_Cd', show: true, width: '5px', type: 'text' },
         { title: 'Name', property: 'CustLoc_Name', show: true, width: '5px', type: 'value' }
        ]

        $scope.loadCustLocation = {
            method: 'get',
            read: '/api/custloctran/list',
            params: ''
        }
        $scope.headerCustomer = [
           { title: 'Id', property: 'AC_CD', show: true, width: '100px', type: 'text' },
           { title: 'Name', property: 'AC_DESC', show: true, width: '300px', type: 'value' }
        ]
        $scope.loadCustomer = {
            method: 'get',
            read: '/api/customers/list',
            params: ''
        }
        $scope.clearValues = function (event) {
            event.preventDefault();
            $scope.transMode = 'add';
            $scope.item1 = {};
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

          { title: 'Type', property: 'Atp_Cd', show: true, width: '100px', type: 'text' },
          { title: 'Name', property: 'Atp_Name', show: true, width: '300px', type: 'value' },
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
        }

        function getAssetIdFailed(response) {
            Notification.error(response.data);
        }

        function calcusefullife() {

            if ($scope.assetRegister != undefined &&
                $scope.assetRegister.Ast_DeprePer != undefined && $scope.assetRegister.Ast_DeprePer != 0)
                $scope.assetRegister.Ast_UsefulLife = (100 / $scope.assetRegister.Ast_DeprePer).toFixed(2);

            else
                $scope.assetRegister.Ast_UsefulLife = 0;
            CalNetDepreciation();
        }

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

        function calcDepreCompleted(response) {

            $scope.assetRegister.Ast_TotDepre = response.data.Ast_TotDepre.toFixed(3);
            $scope.assetRegister.Ast_Book_Value = response.data.Ast_Book_Value.toFixed(3);
            $scope.assetRegister.Asv_Acq_Dt = $filter('date')(response.data.Asv_Acq_Dt, 'dd-MM-yyyy');
            $scope.assetRegister.Ast_Purch_Dt = $filter('date')(response.data.Ast_Purch_Dt, 'dd-MM-yyyy');

        }

        function calcDepreRegFailed() { }
        //GetGiAc




        function addUpdateItem1(event) {
            event.preventDefault();

            if ($scope.item1 != undefined && $scope.item1.Ast_SlNo != undefined &&
                        $scope.item1.Ast_SlNo != '' && $scope.item1.Ast_SlNo != null) {
                if ($scope.transMode == 'update') {

                    if (isEmpty($scope.item1.Ds_Id) && isEmpty($scope.item1.Ds_Id) && isEmpty($scope.item1.Loc_Cd)
                        && isEmpty($scope.item1.Emp_Cd) && isEmpty($scope.item1.AC_CD) &&
                        isEmpty($scope.item1.CustLoc_Cd)) {

                        Notification.error('Please enter atleast one item details');
                        return;
                    }

                    $scope.assetRegister.list[$scope.activeIndex].Ast_SlNo = $scope.item1.Ast_SlNo;
                    $scope.assetRegister.list[$scope.activeIndex].Ds_Id = $scope.item1.Ds_Id;
                    $scope.assetRegister.list[$scope.activeIndex].Dept_Name = $scope.item1.Dept_Name;
                    $scope.assetRegister.list[$scope.activeIndex].Loc_Cd = $scope.item1.Loc_Cd;
                    $scope.assetRegister.list[$scope.activeIndex].Loc_Name = $scope.item1.Loc_Name;
                    $scope.assetRegister.list[$scope.activeIndex].Emp_Cd = $scope.item1.Emp_Cd;
                    $scope.assetRegister.list[$scope.activeIndex].Emp_Name = $scope.item1.Emp_Name;
                    $scope.assetRegister.list[$scope.activeIndex].Ac_Cd = $scope.item1.AC_CD;
                    $scope.assetRegister.list[$scope.activeIndex].AC_DESC = $scope.item1.AC_DESC;
                    $scope.assetRegister.list[$scope.activeIndex].CustLoc_Cd = $scope.item1.CustLoc_Cd;
                    $scope.assetRegister.list[$scope.activeIndex].CustLoc_Name = $scope.item1.CustLoc_Name;
                    $scope.assetRegister.list[$scope.activeIndex].flag = 'U';

                    $scope.clearValues(event);
                }
                else {
                    if ($scope.assetRegister.list === undefined) $scope.assetRegister.list = [];

                    if (isEmpty($scope.item1.Ds_Id) && isEmpty($scope.item1.Ds_Id) && isEmpty($scope.item1.Loc_Cd)
                        && isEmpty($scope.item1.Emp_Cd) && isEmpty($scope.item1.AC_CD) &&
                        isEmpty($scope.item1.CustLoc_Cd)) {

                        Notification.error('Please enter atleast one item details');
                        return;
                    }

                    if ($scope.assetRegister.list.length >= $scope.assetRegister.Ast_Qty) {
                        Notification.error('Allocation canot be added more than purchase quantity');
                        return;
                    }

                    // $scope.item1.Ds_Id = $scope.item1.Ds_Id;
                    $scope.item1.flag = 'A';
                    // $scope.list.push(angular.copy($scope.item1));
                    $scope.assetRegister.list.push(angular.copy($scope.item1));
                    $scope.clearValues(event);
                }
            }
            else {
                Notification.error('Please enter product SrNo');
            }
        }

        $scope.updateListItem = function (item, index) {

            $scope.activeIndex = index;
            $scope.transMode = 'update';
            $scope.item1 = angular.copy(item);


        }

        function isEmpty(val) {
            return (val === undefined || val == null || val.length <= 0) ? true : false;
        }

        $scope.deleteListitem = function (item, index) {
            $scope.activeIndex = index;
            $scope.transMode = 'delete';
            $scope.assetRegister.list.splice(index, 1);
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
            CalNetDepreciation();
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
            $location.path('/assetRegister/edit/' + ID);
        }

        function addAssetRegister() {
            $location.path("/assetRegister/new");
        }

        function loadAssetPurchRegister() {
            //  loadOwnerShip();
            //  loadAssetType();
            //    loadSupplier();

            // $scope.assetRegister = {};
            // $scope.assetRegister.option = 'S';
            // calcAssetValue();


            if ($scope.assetRegister.ID == undefined) {
                $scope.assetRegister.option = 'S';
                if ($scope.assetRegister.Ast_Qty == undefined)
                    $scope.assetRegister.Ast_Qty = '1';
                $scope.assetRegister.Ast_Status = 'ACTIVE';
                $scope.assetRegister.Ast_Purch_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');
                $scope.assetRegister.Asv_Acq_Dt = $filter('date')(new Date(), 'dd-MM-yyyy');

                if ($scope.assetRegister.Ast_Thru_Purch == true) {

                    if ($scope.assetRegister.Ast_Qty != '1')
                        $scope.assetRegister.option = 'M';
                    calcDiscAmount();

                    if ($scope.assetRegister.list == undefined)
                        AddAssetItem();
                }

            }
            else {
                if ($scope.assetRegister.Ast_Qty == 1)
                    $scope.assetRegister.option = 'S';
                else
                    $scope.assetRegister.option = 'M';
            }

            apiService.get('/api/ownerships/list', null, loadOwnerShip, null);
            apiService.get('/api/assettypes/list', null, loadAssetType, null);
            apiService.get('/api/suppliers/list', null, loadSupplier, null);

        }

        function loadOwnerShip(response) {
            $scope.ownershipList = response.data;
        }

        function loadAssetType(response) {
            $scope.assetTypeList = response.data;
        }

        function loadSupplier(response) {
            $scope.supplierList = response.data;
        }


        function loadItem() {
            $http.get('api/assetRegister/getItemList/' + $routeParams.id).then(function (response) {
                $scope.items = response.data;
            });
        }
        function completedAsstReg(result) {
            $scope.assetRegister = result.data;
        }

        function updateAssetRegister() {
            $scope.assetRegister.Usr_Id = $cookieStore.get('loggedUserName');
            $scope.assetRegister.AssetItem = $scope.items;
            apiService.post('/api/assetRegister/update/', $scope.assetRegister,
            updateAssetRegCompleted,
            updateAssetRegFailed);
        }

        function updateAssetRegCompleted(response) {
            Notification.success($scope.assetRegister.Ast_Name + ' has been updated');
            $scope.assettype = {};
            $location.url('assetRegister')
        }

        function updateAssetRegFailed(response) {
            Notification.error(response.data);
        }

        function createAssetRegister(employee) {

            //validation


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


            $scope.CheckAtpCd = false;

            for (var i = 0; i < $scope.assetTypeList.length; i++) {


                if ($scope.assetRegister.Atp_Cd == $scope.assetTypeList[i].Atp_Cd) {
                    $scope.CheckAtpCd = true;
                    break;
                }

            }

            if ($scope.CheckAtpCd == false) {
                Notification.error('Invalid Asset Type !!!');
                return;
            }


            if ($scope.assetRegister.Ast_Qty != $scope.assetRegister.list.length) {
                Notification.error('Purchase quantity and number of asset should be same!!!');
                return;

            }

            //

            $scope.assetRegister.Qty = 1;
            $scope.assetRegister.Usr_Id = $cookieStore.get('loggedUserName');
            if ($scope.assetRegister.list == undefined)
                $scope.assetRegister.list = [];
            $rootScope.assetRegister = $scope.assetRegister;

            for (var i = 0 ; i < $scope.assetRegister.list.length ; i++) {


                if (checkField($scope.assetRegister.list[i].Ds_Id)) {
                    Notification.error('Please enter department Id and location Id!!!');
                    return;
                }

                if (checkField($scope.assetRegister.list[i].Loc_Cd)) {
                    Notification.error('Please enter department Id and location Id!!!');
                    return;
                }
            }
            if (checkField($scope.assetRegister.Usr_Id)) {
                Notification.error('user session error,please logout and login !!!');
                return;
            }

            $modalInstance.dismiss();
        }

        function createAssetRegCompleted(response) {
            Notification.success($scope.assetRegister.Ast_Name + ' has been added');
            $rootScope.searchAssetRegister();
            $scope.assetRegister = {};
            $location.url('assetRegister');

        }


        function checkField(value) {

            if (value == undefined || value == '' || value == null)
                return true;
            else
                return false;

        }

        function createAssetRegFailed(response) {
            Notification.error(response.data);
            $location.url('assetRegister');

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

        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };

        function closeModal() {

            $scope.assetRegister = {};
            $rootScope.assetRegister = {};
            $rootScope.ClearAllDetails();
            $modalInstance.dismiss();
        }


        //fileupoload

        function InvokeFileUpload() {

            $scope.AstId = $scope.assetRegister.Ast_Id;
            $scope.uploaderImg.uploadAll();
            $scope.uploaderDocs.uploadAll();

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
                deleteImgCompleted, delteImgfailed);

        }

        function deleteImgCompleted() {

        }

        function delteImgfailed() {

        }


        function ClickAssetImage(assetName, ImgName) {

            $scope.ImageUrl = constants.apiServiceBaseUri + '/content/assetimages/' + assetName + '/' + ImgName;

        }
        function ClickAssetDoc(assetName, DocName, DocType) {

            $scope.DocUrl = constants.apiServiceBaseUri + '/content/assetdocs/' + assetName + '/' + DocName;
            $scope.DocTypeUrl = constants.apiServiceBaseUri + '/content/assetdocs/' + DocType;

        }


        var uploaderImg = $scope.uploaderImg = new FileUploader({
            url: constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + "AstId"
        });


        var uploaderDocs = $scope.uploaderDocs = new FileUploader({
            url: constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + "AstId"
        });

        function getImage() {

            apiService.get('/api/assetRegister/getImagUrl/' + $scope.AstId, null,
            imgLoadCompleted,
            imgLoadFailed);

        }

        // Image Uploader

        uploaderImg.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });

        // an async filter
        uploaderImg.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });

        // CALLBACKS

        uploaderImg.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploaderImg.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploaderImg.onAfterAddingAll = function (addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploaderImg.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);
            uploaderImg.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + $scope.AstId
            item.url = uploaderImg.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadImage/' + $scope.AstId

        };
        uploaderImg.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploaderImg.onProgressAll = function (progress) {
            console.info('onProgressAll', progress);
        };
        uploaderImg.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploaderImg.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploaderImg.onCancelItem = function (fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploaderImg.onCompleteItem = function (fileItem, response, status, headers) {
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploaderImg.onCompleteAll = function () {

        };


        //doc upload
        uploaderDocs.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 10;
            }
        });

        // an async filter
        uploaderDocs.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('AsyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });



        uploaderDocs.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {

        };
        uploaderDocs.onAfterAddingFile = function (fileItem) {

        };
        uploaderDocs.onAfterAddingAll = function (addedFileItems) {

        };
        uploaderDocs.onBeforeUploadItem = function (item) {

            uploaderDocs.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + $scope.AstId
            item.url = uploaderDocs.queue.url = constants.apiServiceBaseUri + '/api/assetRegister/uploadDoc/' + $scope.AstId

        };
        uploaderDocs.onProgressItem = function (fileItem, progress) {

        };
        uploaderDocs.onProgressAll = function (progress) {

        };
        uploaderDocs.onSuccessItem = function (fileItem, response, status, headers) {

        };
        uploaderDocs.onErrorItem = function (fileItem, response, status, headers) {

        };
        uploaderDocs.onCancelItem = function (fileItem, response, status, headers) {

        };
        uploaderDocs.onCompleteItem = function (fileItem, response, status, headers) {

        };
        uploaderDocs.onCompleteAll = function () {

        };



    }
}
)(angular.module('AssetAdminApp'));
