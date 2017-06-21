(function (app) {
    "use strict";

    app.controller('demoCtrl', ['$scope', '$timeout', '$q', '$modal', 'Notification', 'apiService', function ($scope, $timeout, $q, $modal, Notification, apiService) {

        $scope.reset = function () {
            $scope.state = undefined;
        };
        $scope.items = [];

        $scope.page = 0;
        $scope.pagesCount = 0;
        $scope.searchLocation = searchLocation;
        $scope.totalCount = 0;

        function searchLocation(page) {
            page = page || 0;
            var config = {
                params: {
                    page: page,
                    pageSize: 10,
                    filter: $scope.filterLocations
                }
            };
            apiService.get('/api/locations/search/', config,
            locationsLoadCompleted,
            locationsLoadFailed);
        }
        var arr = new Array();
        
        
        function locationsLoadCompleted(result) {
            $scope.locationList = result.data.Items;

            angular.forEach($scope.locationList, function (item) {
                var obj = {};
                obj['Loc_Cd'] = item.Loc_Cd;
                obj['Loc_Name'] = item.Loc_Name;
                arr.push(obj);
            });
            //$scope.page = result.data.Page;
            //$scope.pagesCount = result.data.TotalPages;
            //$scope.totalCount = result.data.TotalCount;
        }

        function locationsLoadFailed(response) {
            Notification.error(response.data);
        }

        $scope.isCustomEnabled = true;
        $scope.custom = ['Item 1', 'Item 2', 'Item 3'];
        $scope.customOptions = {
            displayText: 'This text is modifyable',
            emptyListText: 'Oops! The list is empty',
            emptySearchResultText: 'Sorry, couldn\'t find "$0"'
        };
        

        $scope.locations = arr;
        $scope.growableOptions = {
            displayText: 'Select or add a new item...',
            addText: 'Add new Location',
            onAdd: function (text) {
                //var newItem = 'Item ' + text;
                //$scope.growable.push(newItem);
                //return newItem;
                $scope.EditedLoc = location;
                $scope.Mode = 'add';
                $modal.open({
                    templateUrl: 'scripts/spa/AssetAdmin/locations/addEditLocationModal.html',
                    controller: 'asset.admin.location.edit.ctrl',
                    scope: $scope,
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function ($scope) {
                }, function () {
                });
            }
        };

        $scope.searchAsync = function (term) {
            // No search term: return initial items
            if (!term) {
                return ['Item 1', 'Item 2', 'Item 3'];
            }
            var deferred = $q.defer();
            $timeout(function () {
                var result = [];
                for (var i = 1; i <= 3; i++) {
                    result.push(term + ' ' + i);
                }
                deferred.resolve(result);
            }, 300);
            return deferred.promise;
        };

        $scope.nestedItemsLevel1 = ['Item 1', 'Item 2', 'Item 3'];
        $scope.level1Options = {
            onSelect: function (item) {
                var items = [];
                for (var i = 1; i <= 5; i++) {
                    items.push(item + ': ' + 'Nested ' + i);
                }
                $scope.nestedItemsLevel2 = items;
            }
        };

        $scope.nestedItemsLevel2 = [];

        $scope.searchLocation();

        $scope.clearItem = function () {
            $scope.transMode = 'add';
            $scope.item = {
                ItmCd: '',
                ItmName: '',
                Qty: '',
                Rate: '',
                Amt: ''
            }
        }

        $scope.calculateTotal = function (item) {
            if (angular.isUndefined(item.Qty) || angular.isUndefined(item.Rate)) {
                item.Amt = 0;
                return 0;
            }
            else {
                item.Amt = item.Qty * item.Rate;
                return item.Qty * item.Rate;
            }

        }

        $scope.addUpdateItem = function () {
            console.log($scope.item);

            if ($scope.item.ItmCd != '' && $scope.item.ItmCd != null) {
                if ($scope.transMode == 'update') {
                    $scope.items[$scope.activeIndex].ItmCd = $scope.item.ItmCd;
                    $scope.items[$scope.activeIndex].ItmName = $scope.item.ItmName;
                    $scope.items[$scope.activeIndex].Qty = $scope.item.Qty;
                    $scope.items[$scope.activeIndex].Rate = $scope.item.Rate;
                    $scope.calculateTotal($scope.item);
                }
                else {
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
    }]);

    

})(angular.module('AssetAdminApp'));