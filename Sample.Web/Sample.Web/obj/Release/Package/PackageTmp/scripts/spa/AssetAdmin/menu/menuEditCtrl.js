(function (app) {
    "use strict";

    app.controller('asset.admin.menu.edit.Ctrl', ['$scope', '$rootScope', 'apiService', '$modalInstance','Notification', function ($scope, $rootScope, apiService, $modalInstance, Notification) {

        $scope.cancelEdit = cancelEdit;
        $scope.getParentMenus = getParentMenus;
        $scope.parentMenuList = [];
        $scope.reAssignValue = reAssignValue;
        $scope.updateMenu = updateMenu;
        $scope.createMenu = createMenu;
        $scope.deleteData = deleteData;

        function getParentMenus() {
            var config = {
                params: {
                    menuId: $scope.EditedMenu.MenuId,
                    menuLevel: $scope.EditedMenu.MenuLevel
                }
            };
            apiService.get('api/menu/getallparentmenus', config, successParent, failureParent)
        }

        function successParent(result) {
            $scope.parentMenuList = result.data;
        }
        function reAssignValue() {
            $scope.ParentName = $scope.EditedMenu.ParentName
        }

        function failureParent() {
        }


        function cancelEdit() {
            $modalInstance.dismiss();
        }

        function updateMenu() {
            $scope.EditedMenu.ParentName = $scope.ParentName;
            apiService.post('/api/menu/update/', $scope.EditedMenu,updateMenuCompleted,updateMenuFailed);
        }

        function updateMenuCompleted(response) {
            Notification.success('Menu Item : ' + $scope.EditedMenu.MenuName + ' Updated Successfully!');
            $rootScope.getAllMenus();
            $modalInstance.dismiss();
        }

        function updateMenuFailed(response) {
            Notification.error(response.error);
        }

        function createMenu() {
            $scope.EditedMenu.ParentName = $scope.ParentName;
            apiService.post('/api/menu/create/', $scope.EditedMenu, createMenuCompleted, createMenuFailed);
        }

        function createMenuCompleted(response) {
            Notification.success('New Menu Item : ' + $scope.EditedMenu.MenuName + ' Created Successfully!');
            $rootScope.getAllMenus();
            $modalInstance.dismiss();
        }

        function createMenuFailed(response) {
            Notification.error(response.error);
        }

        function deleteData() {
            apiService.post('/api/menu/delete/' + $scope.EditedMenu.ID, null,
            deleteMenuCompleted,
            deleteMenuFailed);
        }

        function deleteMenuCompleted(response) {
            if (response.data.message != "Deleted") {
                Notification.error(response.data.message);
            }
            else {
                Notification.error($scope.EditedMenu.MenuName + ' has been deleted');
                $rootScope.getAllMenus();
                $modalInstance.dismiss();
            }
        }

        function deleteMenuFailed(response) {
            console.log(response)
            Notification.error(response.message);
        }
        getParentMenus();

    }]);

})(angular.module('AssetAdminApp'));