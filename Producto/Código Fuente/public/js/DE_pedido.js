var app = angular.module("deliverEat", []);
app.controller("pedidoCtrl", function($scope){
  $scope.monto_f = "";
  angular.element(document).ready(function(){

    /* Objeto encargado del formato para las monedas */
    var formatter = new Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS',});
    /* Cambio de formato de moneda a numero con coma */
    function toLongNumber(stringNumber) {
        stringNumber = stringNumber.replace('$', '').replace('.', '').replace(',','.')
        var thousandSeparator = (1111).toLocaleString().replace(/1/g, '');
        var decimalSeparator = (1.1).toLocaleString().replace(/1/g, '');

        return parseFloat(stringNumber
            .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
            .replace(new RegExp('\\' + decimalSeparator), '.')
        );
    }

    /* Eventos para control del formulario */

    $('#input_monto').focus(function(){
    $('#input_monto').val("");
    $('#input_comision').val("");
    });
    $('#input_monto').change(function(){
    // Actualiza el formato del monto cuando se ingresa
    var num = $('#input_monto').val().replace(',','.');
    $('#input_monto').val(formatter.format(num));
    $('#input_comision').val(formatter.format((num*10)/100));
    });

    $('#input_fecha').focus(function(){
    $(this).val("");
    });

    $('#input_inmediata').change(function(){
    $('#input_fecha').val("");
    if(this.checked){
      $('#input_fecha').attr("disabled", true);
      $('#input_fecha').datetimepicker("date", new Date());
    }else
      $('#input_fecha').attr("disabled", false);
    });

    /* Manejo del metodo de pago */
    $('#pago_tarjeta').click(function(){
      if(validarPedido()){
        $('#input_pago').text("Tarjeta");
        var monto_t = toLongNumber($('#input_monto').val())+toLongNumber($('#input_comision').val());
        var monto_f = formatter.format(monto_t);
        mostrarTarjeta(monto_f, (respuesta) => {
        });
      }
    });
    $('#pago_efectivo').click(function(){
        $('#input_pago').text("Efectivo");
    });

    /* Eventos al realizar el pedido */
    function validarPedido(){
      var values = {};
      var error = false;
      $.each($('#formPedido').serializeArray(), function(i, field) {
        if(field.value == ""){
          $("input[name='"+field.name+"']").addClass('is-invalid');
          $("input[name='"+field.name+"']").after('<div class="invalid-feedback">Este campo es obligatorio</div>');
          error = true;
        }
        values[field.name] = field.value;
      });
      if(error==true){
        return false;
      }
      return true;
    }

    $('#formPedido').submit(function (e) {
      e.preventDefault();

      if (validarPedido() != false){
        var values = $(this).serializeArray();
        mostrarConfirmacion("¿Confirmar el pedido?", (respuesta) => {
          if(respuesta){
            var data = JSON.stringify(values);
            console.log(data);
            // Realizar el submit
          }
          console.log("NOP");
        });
      }
    });

    function frmValidateDinamic(element) {
      var currForm = element.closest("form");
      currForm.removeData("validator");
      currForm.removeData("unobtrusiveValidation");
      $.validator.unobtrusive.parse(currForm);
      currForm.validate(); // This line is important and added for client side validation to trigger, without this it didn't fire client side errors.
    }

    function mostrarTarjeta(monto, handler){
      $(`<div id='div_tarjeta' class='modal fade' role='dialog'>
          <div class="col-12 col-sm-8 col-md-6 mx-auto modal-dialog ">
            <div id="pay-invoice" class="card border modal-content">
            <button type="button" class="close text-right mr-2" aria-label="Cerrar">
              <span aria-hidden="true">&times;</span>
            </button>
              <div class="card-body pt-0">
                <div class="modal-body">
                  <div class="card-title">
                    <h2 class="text-center">Pago por Tarjeta</h2>
                  </div>
                  <hr>
                  <form id="form_tarjeta_embembed" action="return false;"  method="post">
                    <input type="hidden" id="x_first_name" name="x_first_name" value="">                        <input type="hidden" id="x_last_name" name="x_last_name" value="">                        <input type="hidden" id="x_card_num" name="x_card_num" value="">                        <input type="hidden" id="x_exp_date" name="x_exp_date" value="">
                    <div class="form-group text-center">
                      <ul class="list-inline">
                        <li class="list-inline-item"><i class="text-muted fa fa-cc-visa fa-2x"></i></li>
                        <li class="list-inline-item"><i class="fa fa-cc-mastercard fa-2x"></i></li>
                        <li class="list-inline-item"><i class="fa fa-cc-amex fa-2x"></i></li>
                        <li class="list-inline-item"><i class="fa fa-cc-discover fa-2x"></i></li>
                      </ul>
                    </div>
                    <div class="form-group">
                      <label>Monto</label>
                      <h2>${monto}</h2>
                    </div>
                    <div class="form-group has-success">
                      <label for="cc-name" class="control-label">Nombre en la tarjeta</label>
                      <input id="cc-name" name="cc-name" type="text" class="form-control cc-name" data-val="true" data-val-required="Ingrese el nombre como figura en la tarjeta" autocomplete="cc-name" aria-required="true" aria-invalid="false" aria-describedby="cc-name-error"> <span class="help-block field-validation-valid" data-valmsg-for="cc-name" data-valmsg-replace="true"></span> </div>
                    <div class="form-group">
                        <label for="cc-number" class="control-label">Número de Tarjeta</label>
                        <input id="cc-number" name="cc-number" type="tel" class="form-control cc-number identified visa" value="" data-val="true" data-val-required="Ingrese el número de tarjeta" data-val-cc-number="Ingrese un número de tarjeta válido (solo VISA)" autocomplete="cc-number"> <span class="help-block" data-valmsg-for="cc-number" data-valmsg-replace="true"></span> </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="cc-exp" class="control-label">Expiración</label>
                                <input id="cc-exp" name="cc-exp" type="tel" class="form-control cc-exp" value="" data-val="true" data-val-required="Ingrese la fecha de expiración como figura en la tarjeta" data-val-cc-exp="Ingresar un mes y año validos" placeholder="MM / YY" autocomplete="cc-exp"> <span class="help-block" data-valmsg-for="cc-exp" data-valmsg-replace="true"></span> </div>
                        </div>
                        <div class="col-6">
                            <label for="x_card_code" class="control-label">Código de seguridad</label>
                            <div class="input-group">
                                <input id="x_card_code" name="x_card_code" type="tel" class="form-control cc-cvc" value="" data-val="true" data-val-required="Ingrese el número de seguridad" data-val-cc-cvc="Verifique que el número de seguridad sea válido" autocomplete="off">
                                <div class="input-group-addon"> <span class="fa fa-question-circle fa-lg" data-toggle="popover" data-container="body" data-html="true" data-title="Código de seguridad" data-content="<div class='text-center one-card'>El código de 3 dígitos detrás de la tarjeta..<div class='visa-mc-cvc-preview'></div></div>" data-trigger="hover" data-original-title="" title=""></span> </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="x_zip" class="control-label">Código postal </label>
                        <input id="x_zip" name="x_zip" type="text" class="form-control" value="" data-val="true" data-val-required="Ingrese el código postal" autocomplete="postal-code"> <span class="help-block" data-valmsg-for="x_zip" data-valmsg-replace="true"></span> </div>
                    <div>
                        <button id="payment-button" type="submit" class="btn btn-lg btn-success btn-block"> <i class="fa fa-lock fa-lg"></i>&nbsp; <span id="payment-button-amount">Pay ${monto}</span> <span id="payment-button-sending" style="display:none;">Enviando…</span> </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
      </div><script>$(function () {$('[data-toggle="popover"]').popover()});</script>`).appendTo('#main_div');

      $('#cc-number').mask("0000 0000 0000 0000", {reverse: true});
      $('#cc-exp').mask("99/99", {placeholder: 'MM/YY'});
      $("#div_tarjeta").modal({
         backdrop: 'static',
         keyboard: false
      });

     //Pass true to a callback function
     $("#payment-button").click(function () {
         /*verificar_tarjeta();
         $('#form_tarjeta_embembed').validate()*/
         //$.validator.unobtrusive.parseDynamicContent('form_tarjeta_embembed input:last');

         frmValidateDinamic($('#form_tarjeta_embembed'));
         if($('#form_tarjeta_embembed').valid()){
           var num = $('#cc-number').cleanVal();
           if((num.match(/^4\d{15}/) || num.match(/^4\d{12}/))){
             // Hacemos el submit
               $("#div_tarjeta").modal("hide");
           }else{
             $('#cc-number').removeClass("valid");
             $('#cc-number').addClass("input-validation-error");
             $('#cc-number-error').val("Sólo se permite VISA");
             event.preventDefault();
           }
         }
     });

     //Remove the modal once it is closed.
     $("#div_tarjeta").on('hidden.bs.modal', function () {
        $("#div_tarjeta").remove();
      });

     $(".close").on('click', function(){
       $("#div_tarjeta").modal("hide");
     })

    }

    function mostrarConfirmacion(message, handler){
    $(`<div class="modal fade" id="myModal" role="dialog">
       <div class="modal-dialog border border-info">
         <!-- Modal content-->
          <div class="modal-content">
             <div class="modal-body">
               <h4 class="text-center">${message}</h4>
               <div class="row justify-content-center">
                 <div class="col-4">
                   <a class="btn btn-outline-success btn-block btn-yes">Sí</a>
                 </div>
                 <div class="col-4">
                   <a class="btn btn-outline-secondary btn-block btn-no">No</a>
                 </div>
               </div>
             </div>
         </div>
      </div>
    </div>`).appendTo('body');

    //Trigger the modal
    $("#myModal").modal({
       backdrop: 'static',
       keyboard: false
    });

     //Pass true to a callback function
     $(".btn-yes").click(function () {
         handler(true);
         $("#myModal").modal("hide");
     });

     //Pass false to callback function
     $(".btn-no").click(function () {
         handler(false);
         $("#myModal").modal("hide");
     });

     //Remove the modal once it is closed.
     $("#myModal").on('hidden.bs.modal', function () {
        $("#myModal").remove();
      });
    }

   });

});
