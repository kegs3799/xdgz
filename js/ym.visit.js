$(function () {
    var urlReferrer = document.referrer;
    var timeStamp = new Date().getTime()
    $.get("/StatisticsJS?url=" + urlReferrer + "&siteId=" + (siteId || 0) + "&id=" + (id || 0) + "&columnId=" + (columnId || 0) + "&timeStamp=" + timeStamp, function (data) {
        if (data.success)
            $(".ym_hits").html(data.data);
    });
});