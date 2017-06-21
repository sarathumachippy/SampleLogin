(function (app) {
    app.directive('easyComplete', ['jsonutil', 'requestService', '$http', '$parse', '$rootScope', function (jsonutil, requestService, $http, $parse, $rootScope) {
        var ds, template;
        return {
            restrict: 'A',
            require: "ngModel",
            link: function (s, e, a, ngModelCtrl) {
                a.$observe('ecTransport', function (value) { // Got ng-model bind path here

                    s.$watch(value, function (newValue) { // Watch given path for changes
                        var req = s.$eval(a.ecTransport);
                        //e.val('Fetching data..');
                        a.ngDisabled = true;
                        if (req.method === 'post') {

                            requestService.post(req.read, req.params).then(function (response) {
                                ds = response.data;
                                if (angular.isUndefined(a.clearValue)) {
                                   // e.val('');
                                }

                                createControl(JSON.parse(a.ecShowheader), s.$eval(a.ecTemplate), jsonutil.flatten(s.$eval(a.ecTemplate), ds), e, a, s, ngModelCtrl, $parse);
                            })
                        }
                        if (req.method === 'get') {
                            requestService.get(req.read, req.params).then(function (response) {
                                ds = response.data;
                                if (angular.isUndefined(a.clearValue)) {
                                   // e.val('');
                                }
                                createControl(JSON.parse(a.ecShowheader), s.$eval(a.ecTemplate), jsonutil.flatten(s.$eval(a.ecTemplate), ds), e, a, s, ngModelCtrl, $parse);
                            })
                        }
                        if (req.method === 'local') {
                            ds = $rootScope.localList[req.pos];
                            if (angular.isUndefined(a.clearValue)) {
                               // e.val('');
                            }
                            createControl(JSON.parse(a.ecShowheader), s.$eval(a.ecTemplate), jsonutil.flatten(s.$eval(a.ecTemplate), ds), e, a, s, ngModelCtrl, $parse);
                        }
                    });
                });
            }
        }
    }]);



    function createControl(showheader, header, source, elem, attr, scope, ngModelCtrl, $parse) {
        var options = {
            showHeader: showheader,
            columns: header,
            source: source,
            select: function (event, ui) {
                var i = 0;
                var ui = ui.item;
                angular.forEach(header, function (header) {
                    if (header.type === 'value') {

                        scope.$apply(function () {
                            $parse(attr.ecValueholder).assign(scope, ui[i]);
                        });
                    }
                    if (header.type === 'text') {
                        ngModelCtrl.$setViewValue(ui[i]);
                        $(elem).val(ui[i]);
                    }
                    i++;
                });
                scope.$eval(attr.ecOnchange + '(' + JSON.stringify(ui) + ')');
                return false;
            }
        }
        $(elem).acwidget(options);
    }
    app.factory('jsonutil', function () {
        var obj = {
            flatten: flatten
        }
        function flatten(header, datasource) {
            var mainlist = [];
            angular.forEach(datasource, function (item) {
                var sublist = [];
                angular.forEach(header, function (head) {
                    sublist.push(item[head.property])
                })
                mainlist.push(sublist);
            })
            return mainlist;
        }

        return obj;
    })
    app.service('requestService', function ($http) {
        var serviceObj = {
            post: post,
            get: get
        }
        function post(url, params) {
            return $http.post(url, params)
        }
        function get(url, params) {
            return $http.get(url, params)
        }
        return serviceObj;
    })
})(angular.module('easyComplete', []));


$.widget('custom.acwidget', $.ui.autocomplete, {

    _create: function () {
        this._super();
        this.widget().menu("option", "items", "> :not(.ui-widget-header)");
    },
    _renderMenu: function (ul, items) {
        var self = this, thead;

        if (this.options.showHeader) {
            table = $('<div class="ui-widget-header" style="width:100%"></div>');
            // Column headers

            $.each(this.options.columns, function (index, headerItem) {
                if (headerItem.show) {
                    table.append('<span style="float:left;width:' + headerItem.width + ';">' + headerItem.title + '</span>');
                }
                else {
                    table.append('<span style="float:left;width:' + headerItem.width + ';display:none;">' + headerItem.title + '</span>');
                }
            });

            table.append('<div style="clear: both;"></div>');
            ul.append(table);
        }
        // List items
        $.each(items, function (index, item) {
            self._renderItem(ul, item);
        });
    },
    _renderItem: function (ul, item) {
        var t = '',
			result = '';

        $.each(this.options.columns, function (index, column) {
            if (column.show) {
                t += '<span style="float:left;width:' + column.width + ';">' + item[column.valueField ? column.valueField : index] + '</span>'
            }
            else {
                t += '<span style="float:left;width:' + column.width + ';display:none">' + item[column.valueField ? column.valueField : index] + '</span>'
            }

        });

        result = $('<li></li>')
			.data('ui-autocomplete-item', item)
			.append('<a class="mcacAnchor">' + t + '<div style="clear: both;"></div></a>')
			.appendTo(ul);
        return result;
    }
});
