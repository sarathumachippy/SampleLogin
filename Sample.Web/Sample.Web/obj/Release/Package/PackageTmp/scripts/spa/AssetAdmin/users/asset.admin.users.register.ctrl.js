(function (app) {
    "use strict";
    app.controller("asset.admin.users.register.ctrl", registerCtrl);
    registerCtrl.$inject = ['$rootScope', '$scope', 'apiService', 'membershipService', 'Notification', 'blockingservice', '$location', '$routeParams', 'FileUploader', 'constants'];

    function registerCtrl($rootScope, $scope, apiService, membershipService, Notification, blockingservice, $location, $routeParams, FileUploader, constants) {


        $scope.Id = '1';
        $scope.openDatePicker = openDatePicker;
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        $scope.datepicker = {};
        $scope.register = register;
        $scope.prepareFiles = prepareFiles;
        $scope.loadUser = loadUser;
        $scope.updateUser = updateUser;
        $scope.changeInputType = changeInputType;

        var userImage = null;

        function register() {
            
            membershipService.register($scope.user, registerCompleted)
        }

        function registerCompleted(response) {
            if (response.data) {

                Notification.success('New user created successfully');
                $scope.Id = response.data.ID;
                $scope.uploader.uploadAll();
                redirectToList();
            }
            else {
                Notification.error('Error occured! Can\'t create User');
            }
        }
        function redirectToList() {
            $location.url('users');
        }
        function openDatePicker($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.datepicker.opened = true;
        };
        function prepareFiles($files) {
            userImage = $files;
        }

        function changeInputType() {
            if (document.getElementById('userName').value == undefined || document.getElementById('userName').value == '') {
                document.getElementById('userName').focus();
            } else {
                document.getElementById('inputPassword').setAttribute('type', 'password');
            }
        }

        function loadUser() {
            if ($routeParams.id != undefined) {
                membershipService.getSingle($routeParams.id, completedLoadUser);
                document.getElementById('inputPassword').setAttribute('type', 'password');
            }
        }

        function completedLoadUser(result) {
            $scope.user = result.data;
            $scope.user.Password = 'dummy';
        }

        function updateUser() {

            apiService.post('/api/users/update/', $scope.user,
            updateUserCompleted,
            updateUserFailed);
        }

        function updateUserCompleted(response) {
            Notification.success($scope.user.Fullname + ' has been updated');
            $scope.Id = $scope.user.ID;
            $scope.uploader.uploadAll();
            $location.url('users');
        }

        function updateUserFailed(response) {
            Notification.error(response.data);
        }

        //image upload

        var uploader = $scope.uploader = new FileUploader({
            url: constants.apiServiceBaseUri + '/api/users/images/upload/' + $scope.Id
        });


        uploader.filters.push({
            name: 'syncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                console.log('syncFilter');
                return this.queue.length < 1;
            }
        });

        uploader.filters.push({
            name: 'asyncFilter',
            fn: function (item /*{File|FileLikeObject}*/, options, deferred) {
                console.log('asyncFilter');
                setTimeout(deferred.resolve, 1e3);
            }
        });


        uploader.onWhenAddingFileFailed = function (item /*{File|FileLikeObject}*/, filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function (fileItem) {
            fileItem.file.name = $scope.Id + '.gif';
            var fileType = fileItem.file.type;
            fileType = fileType.split('/')[1];
            if (fileType != 'jpeg')
            {
                uploader = $scope.uploader = new FileUploader({
                    
                });
                return;
            }

            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function (addedFileItems) {
            
             console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function (item) {
           // uploader.queue.url = constants.apiServiceBaseUri + '/api/users/images/upload/' + $scope.Id;// Set  unique user Id 
           // item.url = uploader.queue.url = constants.apiServiceBaseUri + '/api/users/images/upload/' + $scope.Id;

            uploader.queue.url = constants.apiServiceBaseUri + '/api/users/PostUserImage/' + $scope.Id;// Set  unique user Id 
            item.url = uploader.queue.url = constants.apiServiceBaseUri + '/api/users/PostUserImage/' + $scope.Id;

           // item.file.name = $scope.Id + '.jpeg';  // file name with unique user id.
            item.file.name = $scope.Id + '.jpg';  // file name with unique user id.
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function (fileItem, progress) {
             console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function (progress) {
             console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
             console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
             console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function (fileItem, response, status, headers) {
             console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            
            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function () {
            console.info('onCompleteAll');
        };

         console.info('uploader', uploader);

    }
})(angular.module('AssetAdminApp'));
