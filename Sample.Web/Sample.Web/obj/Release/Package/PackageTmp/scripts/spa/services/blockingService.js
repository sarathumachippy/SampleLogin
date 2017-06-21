(function (app) {
    'use-strict';
    app.service("blockingservice", blockingservice);
    function blockingservice() {
        function block(mode,loader,message,id) {
            switch (mode) {
                case "window": {
                    $.blockUI({ message: '<img src="../scripts/spa/svg/' + loader + '.svg" class="loader-logo"> ' + message });
                    break;
                }
                case "division": {
                    $('#' + id).block({ message: '<img src="../scripts/spa/svg/' + loader + '.svg" class="loader-logo">' });
                    break;
                }
            }
        }
        function unblock(mode,id) {
            switch (mode) {
                case "window": {
                    $.unblockUI();
                    break;
                }
                case "division": {
                    $('#' + id).unblock();
                    break;
                }
            }
        }
        return {
            block: block,
            unblock:unblock
        }
    }
})(angular.module('common.core'));