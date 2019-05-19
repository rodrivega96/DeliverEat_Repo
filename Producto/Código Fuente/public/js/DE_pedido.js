$(document).ready(function(){

  /* Objeto encargado del formato para las monedas */
  var formatter = new Intl.NumberFormat('es-AR', {style: 'currency', currency: 'ARS',});
  /* Cambio de formato de moneda a numero con coma */
  function toLongNumber(stringNumber) {
      stringNumber = stringNumber.replace('$', '').replace('.', '').replace(',','.')
      console.log(stringNumber)
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
