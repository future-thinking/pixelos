function eval(commands) {
    $.ajax({
        url: "/eval",
        type: "POST",
        dataType: "json",
        data: {eval: commands},
    })
}