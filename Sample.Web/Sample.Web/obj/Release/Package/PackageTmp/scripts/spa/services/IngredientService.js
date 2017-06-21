(function (app) {
    'use strict';

    app.factory('IngredientService', IngredientService);

    IngredientService.$inject = ['apiService', '$http', '$base64', '$cookieStore', '$rootScope', 'Notification', 'blockingservice'];

    function IngredientService(apiService, $http, $base64, $cookieStore, $rootScope, Notification, blockingservice) {

        var service = {
            saveheader: saveheader,
            listingredient:listingredient,
            lazyloadingredient: lazyloadingredient
        }

         function lazyloadingredient(startindex,completed) {
            apiService.get("/api/ingredients/lazylistingredient/"+startindex, null, completed, listingfailure);
        }
        function saveheader(ingredient,completed) {
            apiService.post("/api/ingredients/saveheader/", ingredient, completed, reqfailure);
        }
        function listingredient(completed) {
            apiService.get("/api/ingredients/listingredient", null, completed, listingfailure);
        }

        function reqfailure(response) {
            blockingservice.unblock('division', 'div_add_ingredient');
            Notification.error('Ingredient does not save,' + response.data[0]+' please try again !');
        }
        function listingfailure(response) {
            Notification.error('Could not load ingredient,' + response.data[0] + ' please try again !');
        }
        return service;
    }



})(angular.module('common.core'));