/* Inicialización en español para la extensión 'UI date picker' para jQuery. */
/* Traducido por Vester (xvester [en] gmail [punto] com). */
jQuery(function($) {
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''

                //FCF
                //no acceptem dates futures ni la d'avui, ni tampoc dates anteriors a 01/01/1900
                //, maxDate: 0
                , minDate: new Date(1900, 1, 1)
                /*/quan el cursor surt del datepicker, validar que la data estigui entre minDate i maxDate
                 , onClose: function(valueSelected) {
                 $(this).datepicker( "option", "minDate", new Date(1900, 1, 1) );
                 $(this).datepicker( "option", "maxDate", -1 );
                 }*/

                , onClose: function() {

            var hoy = new Date();
            var curr_date = hoy.getDate() + "";
            if (curr_date.length == 1)
                curr_date = "0" + curr_date + "";
            var curr_month = hoy.getMonth();
            //se suma 1 perquè el mètode getMonth() comença per 0=Gener
            curr_month += 1;
            curr_month += "";
            if (curr_month.length == 1)
                curr_month = "0" + curr_month + "";
            var curr_year = hoy.getFullYear() + "";

            hoy = curr_year + "-" + curr_month + "-" + curr_date;

            //var hoy2 = curr_date + "/" + curr_month + "/" + curr_year;

            //var dSel = $(this).val();

            var dSel = $(this).datepicker('getDate');

            if (dSel) {

                /* var sel_date = dSel.getDate() + "";
                 if (sel_date.length == 1)
                 sel_date = "0" + sel_date + "";
                 var sel_month = dSel.getMonth();
                 //se suma 1 perquè el mètode getMonth() comença per 0=Gener
                 sel_month += 1;
                 sel_month += "";
                 if (sel_month.length == 1)
                 sel_month = "0" + sel_month + "";
                 var sel_year = dSel.getFullYear() + "";
                 //reescribim el valor de la data per evitar anys de 2 dígits !!!
                 $(this).val(sel_date + "/" + sel_month + "/" + sel_year);*/


                //var dHoy = new Date(Date.parse(hoy));
                

                var dSel = new Date(Date.parse(dSel));
                var sel_date = dSel.getDate() + "";
                if (sel_date.length == 1)
                    sel_date = "0" + sel_date + "";
                var sel_month = dSel.getMonth();
                //se suma 1 perquè el mètode getMonth() comença per 0=Gener
                sel_month += 1;
                sel_month += "";
                if (sel_month.length == 1)
                    sel_month = "0" + sel_month + "";
                var sel_year = dSel.getFullYear() + "";
                var sel = sel_year + "-" + sel_month + "-" + sel_date;
				
				//reescribim el valor de la data per evitar anys de 2 dígits !!!
				$(this).val(sel_date + "/" + sel_month + "/" + sel_year); 
                
                if (dates.compare(sel, hoy) === 1) {
                    //if (dSel > dHoy) {

                    alert("La fecha introducida no puede ser posterior a la fecha actual");
                    //buidem el camp
                    $(this).val("");
                } else {
                    $(this).blur();
                }

            }

        }




    };
    $.datepicker.setDefaults($.datepicker.regional['es']);
});

