function eval(commands) {
    $.ajax({
        url: "/evalpost",
        type: "POST",
        dataType: "json",
        data: {eval: commands},
    })
}