/*global app*/

/**
 * @ngdoc directive
 * @name directive:edValidateCif
 * @element ANY
 * @restrict A
 *
 * @description
 * Validate CIF with a logarism.
 *
 * @example
    <input type="text" name="idDocument" class="form-control input-lg" 
                    ng-model="orderData.clientData.idDocument" 
                    maxlength="40" required ed-validate-cif>
*/


'use strict';
(function(app) {

    app.directive('edValidateCif', function() {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function(scope, elem, attrs, ctrl) {

                var validateDNI = function(dni){
                    var lockup = 'TRWAGMYFPDXBNJZSQVHLCKE';
                    var valueDni=dni.substr(0,dni.length-1);
                    var letra=dni.substr(dni.length-1,1).toUpperCase();

                    if(lockup.charAt(valueDni % 23)===letra){
                        return true;
                    }
                    return false;
                };

                ctrl.$validators.validcif = function(value){
                    var valid = false;
                    var sumaPar=0;
                    var sumaImpar=0;
                   
                    if ( value && value.length === 9 ){
                        //Quitamos el primer caracter y el último dígito
                        var valueCif= value.substr(1,value.length-2);

                        //Sumamos las cifras pares de la cadena
                        for(var z=1;z<valueCif.length;z=z+2){
                            sumaPar=sumaPar+parseInt(valueCif.substr(z,1));
                        }


                        //Sumamos las cifras impares de la cadena
                        for(var i=0;i<valueCif.length;i=i+2){
                            var result=parseInt(valueCif.substr(i,1))*2;
                            if(String(result).length===1){
                                // Un solo caracter
                                sumaImpar=sumaImpar+parseInt(result);
                            }else{
                                // Dos caracteres. Los sumamos...
                                sumaImpar=sumaImpar+parseInt(String(result).substr(0,1))+parseInt(String(result).substr(1,1));
                            }
                        }

                        // Sumamos las dos sumas que hemos realizado
                        var totalSuma=sumaPar+sumaImpar;

                        if (isNaN(totalSuma)){
                            return false;
                        }

                        var unidad=String(totalSuma).substr(1,1);
                        unidad=10-parseInt(unidad);

                        var primerCaracter=value.substr(0,1).toUpperCase();

                        if(primerCaracter.match(/^[FJKNPQRSUVW]$/)){
                            //Empieza por .... Comparamos la última letra
                            if(String.fromCharCode(64+unidad).toUpperCase()===value.substr(value.length-1,1).toUpperCase()){
                                valid = true;
                            }    
                        }
                        else if(primerCaracter.match(/^[XYZ]$/)){
                            //Se valida como un dni
                            var newcif;
                            if(primerCaracter==='X'){
                                newcif=value.substr(1);
                            }
                            else if(primerCaracter==='Y'){
                                newcif='1'+value.substr(1);
                            }
                            else if(primerCaracter==='Z'){
                                newcif='2'+value.substr(1);
                            }
                            valid = validateDNI(newcif);     
                        }
                        else if(primerCaracter.match(/^[ABCDEFGHLM]$/)){
                            //Se revisa que el último valor coincida con el cálculo.
                            if(unidad===10){
                                unidad=0;
                            }
                            if(value.substr(value.length-1,1)===String(unidad)){
                                valid = true;
                            }       
                        }
                        else{
                            //Se valida como un dni
                            valid = validateDNI(value);
                        }
                        return valid;
                    }
                    return valid;
                };
            }
        };
    });
}(app));