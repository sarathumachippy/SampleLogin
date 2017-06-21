(function (app) {
    'use strict';

    app.directive('topsection', topsection);
    function topsection() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/spa/layout/AssetHome/topbar.html'
        }
    }

    app.directive('sidesection', sidesection);
    function sidesection() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/spa/layout/AssetHome/sidebar.html'
        }
    }

    app.directive('menuBar', menubar);
    function menubar() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/spa/SampleAdmin/layout/menuBar.html'
        }
    }

    app.directive('bottomsection', bottomsection);
    function bottomsection() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/scripts/spa/layout/AssetHome/footer.html'
        }
    }

})(angular.module('SampleApp'));
