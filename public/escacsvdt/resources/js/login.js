
$(document).ready(function () {

    $("#send-form").submit(function (e) {
        e.preventDefault();
        var formData = $(this).serialize();
        $.ajax({
            url: '/doLogin',
            type: 'post',
            datatype: 'json',
            data: formData,
            success: function (data) {
                if (data.length === 1 && data[0].NICK) {
                    window.location = "./llistes.htm";
                } else {
                    $(".labError").text("Error en l'autenticació");
                    $("#tdError").css("background-color", "#BBAA00");
                }
                //recórrer per les files retornades
                /*for (var i = 0; i < data.length; i++){
                 console.log(data[i]);
                 }*/
            },
            error: function (s, i, error) {
                window.location = "./login.htm";
                console.log(error);
            }
        });
        return true;
    });

});


