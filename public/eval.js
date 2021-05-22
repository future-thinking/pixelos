function eval(commands) {
    $.ajax({
        url: "/evalpost",
        type: "POST",
        dataType: "json",
        data: {eval: commands},
    })
        .done(function(result) {
            alert(result.message);
        })
        .fail(function(result) {
            alert(result.message);
        });
}