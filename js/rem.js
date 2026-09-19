function setRem() {
    var html = document.documentElement
    var wW = html.clientWidth
    if (wW <= 1024 && wW > 750) {
        var whdef = 100 / 750
        var rem = 750 * whdef
    } else if (wW <= 750) {
        var whdef = 100 / 750
        var rem = wW * whdef
    } else {
        wW = Math.min(wW, 1920)
        var whdef = 100 / 1920
        var rem = wW * whdef
    }
    document.documentElement.style.fontSize = rem + 'px'
}
setRem();
window.onresize = function(){
    setRem()
}