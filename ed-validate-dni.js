/*global app*/

/**
 * @ngdoc directive
 * @name directive:edValidateDni
 * @element ANY
 * @restrict A
 *
 * @description
 * Validate DNI with a logarism.
 *
 * @example
    <input type="text" name="idDocument" class="form-control input-lg" 
                    ng-model="orderData.clientData.idDocument" 
                    maxlength="40" required ed-validate-dni>
 */

'use strict';
(function(app) {

    app.directive('edValidateDni', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {
                
                var validRegex = /^[XYZ]?([0-9]{7,8})([A-Z])$/i;
                var dniLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

                ctrl.$parsers.unshift(function(value) {
                    var valid = false;
                    if ( value && value.length === 9 ) {
                        value = value.toUpperCase().replace(/\s/, '');
                        var niePrefix = value.charAt(0);
                        switch ( niePrefix ) {
                            case 'X':
                                niePrefix = 0;
                            break;
                            case 'Y':
                                niePrefix = 1;
                            break;
                            case 'Z':
                                niePrefix = 2;
                            break;
                        }
                        value = niePrefix + value.substr(1);
                        if (validRegex.test(value)) {
                            valid = (value.charAt(8) === dniLetters.charAt(parseInt(value, 10) % 23));
                        }
                    }
                    
                    ctrl.$setValidity('validnif', valid);                    
                    return valid ? value : undefined;
                });

            }
        };
    });
}(app));