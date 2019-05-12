$(function() {
    $("#side-menu").metisMenu()
}),
$(function() {
    $(window).bind("load resize", function() {
        var a = 50;
        (this.window.innerWidth > 0 ? this.window.innerWidth : this.screen.width) < 768 ? ($("div.navbar-collapse").addClass("collapse"),
        a = 100) : $("div.navbar-collapse").removeClass("collapse");
        var b = (this.window.innerHeight > 0 ? this.window.innerHeight : this.screen.height) - 1;
        b -= a,
        b < 1 && (b = 1),
        b > a && $("#page-wrapper").css("min-height", b + "px")
    });
    for (var a = window.location, b = $("ul.nav a").filter(function() {
        return this.href == a
    }).addClass("active").parent(); ; ) {
        if (!b.is("li"))
            break;
        b = b.parent().addClass("in").parent()
    }
});
