(function (app) {

    app.directive("numbersOnly", function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9.]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });

    app.directive('uppercaseOnly', [
   // Directive
   function () {
       return {
           restrict: 'A',
           require: 'ngModel',
           link: function (scope, element, attrs, ctrl) {
               element.on('keypress', function (e) {
                   var char = e.char || String.fromCharCode(e.charCode);
                   if (!/^[A-Z0-9 ]$/i.test(char)) {
                       e.preventDefault();
                       return false;
                   }
               });

               function parser(value) {
                   if (ctrl.$isEmpty(value)) {
                       return value;
                   }
                   var formatedValue = value.toUpperCase();
                   if (ctrl.$viewValue !== formatedValue) {
                       ctrl.$setViewValue(formatedValue);
                       ctrl.$render();
                   }
                   return formatedValue;
               }

               function formatter(value) {
                   if (ctrl.$isEmpty(value)) {
                       return value;
                   }
                   return value.toUpperCase();
               }

               ctrl.$formatters.push(formatter);
               ctrl.$parsers.push(parser);
           }
       };
   }
    ]);

    app.directive("limitTo", [function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                var limit = parseInt(attrs.limitTo);
                angular.element(elem).on("keypress", function (e) {
                    if (this.value.length == limit) e.preventDefault();
                });
            }
        }
    }]);

    
    app.directive('pickdate', pickdate);
    function pickdate($rootScope) {
        return {
            restrict: "A",
            require: "ngModel",
            link: function (scope, elem, attrs, ngModelCtrl) {

                var updateModel = function (dateText) {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(dateText);
                    });
                };
                var options = {
                    dateFormat: 'dd/mm/yy',
                    /// dateFormat: 'yy-mm-dd',
                    dateFormat: 'dd-mm-yy',
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function (date) {
                        scope.$broadcast('datechange')
                        scope.$apply(function () {
                            ngModelCtrl.$setViewValue(elem.val());
                        });
                    },
                    onChangeMonthYear: function (year, month, widget, date) {
                        scope.$broadcast('monthyearchange', { 'year': year, 'month': month });
                    }
                };
                elem.on('change', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(elem.val());
                    });
                })
                elem.datepicker(options);
            }
        }
    }
    
    app.directive('notSavedStatus', function () {
        return {
            restrict: 'E',
            template: '<div  <span class="fa fa-circle text-orange new-doc-indicator">'+
                      '</span><span class="new-doc-status"> Not Saved</span></div>'

        }
    })

    app.directive('onFinishRender', finishrender);
    function finishrender() {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    scope.$eval(attr.onFinishRender)
                }
            }

        }
    }


    app.directive("onlyNumbers", function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModelCtrl) {
                function fromUser(text) {
                    if (text) {
                        var transformedInput = text.replace(/[^0-9]/g, '');

                        if (transformedInput !== text) {
                            ngModelCtrl.$setViewValue(transformedInput);
                            ngModelCtrl.$render();
                        }
                        return transformedInput;
                    }
                    return undefined;
                }
                ngModelCtrl.$parsers.push(fromUser);
            }
        };
    });


})(angular.module('controlDirectives', []));

