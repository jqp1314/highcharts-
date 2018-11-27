//全局变量,请求参数
//节目
var programNameArr = [], programValArr = [],programIdArr = [];
//视频平台
var videoArr = [],videoIdArr = [];
//新闻平台
var newsPlatId=[],newsPlatName=[];
//指数平台
var radicalPlatId = [],radicalPlatName = [];

// 设置全局变量 记录7 30 90天 和 日线 周线的最后一次选择的结果
var lastCheckTime = '7天';
var lastCheckBaseLine = 'day';
var lastCheckBaseLineText = '日线';

var resultsDataVideo=[];
var resultsDataNews=[];
var resultsDataRadical=[];

// 设置变量 保存联动的状态 当取消联动状态也不立即消失，等任何一处时间变化在消失
// 此功能是为了防止某些用户 点击取消联动后立即回点联动
var mouseLinked = 'no';

$(function() {
    // 001视频 时间：7天。。。
    $("#selectedTime_video > span").each(function () {
        $(this).on("click", function () {
            if($("#selected_video>li").length == 0 ){
                return false;
            }else {
                if($(this).hasClass("selected")){
                    return false;
                }else {
                    var videoAttr = $("#doSearchBtn").attr("video");
                    var newsAttr = $("#doSearchBtn").attr("news");
                    var radicalAttr = $("#doSearchBtn").attr("radical");
                    if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done'){ //必须所有请求完成 才可以发起请求
                        $(this).addClass("selected");
                        $(this).siblings().removeClass("selected");
                        $(this).siblings(".customTime").show();
                        $(this).siblings(".data").hide();
                        $(this).siblings(".data").children("a").children(".startTimeAndEndTime").removeClass("selected");
                        lastCheckTime =  $(this).text();
                        if($("#mouseLinkMove").hasClass("selected")){
                            isMouseLink()
                        }else {
                            getdataVideo();
                        }
                    }
                }
            }
        });
    })
    // 002 新闻统计分析 去重分析
    $("#quchong_news").click(function () {
        if($("#selected_news>li").length == 0){
            return false;
        }else {
            var videoAttr = $("#doSearchBtn").attr("video");
            var newsAttr = $("#doSearchBtn").attr("news");
            var radicalAttr = $("#doSearchBtn").attr("radical");
            if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
                $("#setJunNews").removeClass("selected");
                // $("#biao_news").removeClass("selected");
                // $("#tab_table>li").removeClass("active");
                // $("#tab_table>li:first-child").addClass("active");
                // $("#biao_table_news").hide();
                if($(this).hasClass("selected")){
                    $(this).removeClass("selected");
                    var quChong = 'false';
                }else {
                    $(this).addClass("selected");
                    var quChong = 'true';
                }
                getdataNews();
            }
        }
    });
    // 02 新闻统计分析 表  弹出
    // 03均线
    // 04 时间：7天。。。
    $("#selectedTime_news > span").each(function () {
        $(this).on("click", function () {
            if($("#selected_news>li").length == 0){
                return false;
            }else {
                if($(this).hasClass("selected")){
                    return false;
                }else {

                    var videoAttr = $("#doSearchBtn").attr("video");
                    var newsAttr = $("#doSearchBtn").attr("news");
                    var radicalAttr = $("#doSearchBtn").attr("radical");
                    if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done'){ //必须所有请求完成 才可以发起请求
                        $(this).addClass("selected");
                        $(this).siblings().removeClass("selected");
                        $(this).siblings(".customTime").show();
                        $(this).siblings(".data").hide();
                        $(this).siblings(".data").children("a").children(".startTimeAndEndTime").removeClass("selected");

                        lastCheckTime =  $(this).text();
                        if($("#mouseLinkMove").hasClass("selected")){
                            isMouseLink()
                        }else {
                            getdataNews();
                        }
                    }
                }
            }
        });
    })
    //003 时间：7天。。。
    $("#selectedTime_radical > span").each(function () {
        $(this).on("click", function () {
            if($("#selected_radical>li").length == 0){
                return false;
            }else {
                if($(this).hasClass("selected")){
                    return false;
                }else {

                    var videoAttr = $("#doSearchBtn").attr("video");
                    var newsAttr = $("#doSearchBtn").attr("news");
                    var radicalAttr = $("#doSearchBtn").attr("radical");
                    if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
                        $(this).addClass("selected");
                        $(this).siblings().removeClass("selected");
                        $(this).siblings(".customTime").show();
                        $(this).siblings(".data").hide();
                        $(this).siblings(".data").children("a").children(".startTimeAndEndTime").removeClass("selected");

                        lastCheckTime =  $(this).text();
                        if($("#mouseLinkMove").hasClass("selected")){
                            isMouseLink()
                        }else {
                            getdataRadical();
                        }
                    }
                }
            }
        });
    })

});

/*  【点击 + 增加input标签】 ------------------------------------------------第一步增+  */
function addInput(obj) {
    var len = $("#programInput .program_name").length;
    //1 获取 输入的节目名称 //最多五个节目 一开始有且仅有一个节目
    programValArr = [];programNameArr = [];
    $("#programInput > .program_name > input").each(function(){
        var valEach = $(this).val();
        var valEachName = $(this).attr("name");
        programValArr.push(valEach)
        programNameArr.push(valEachName)
    });

    var beforeInputVal = $("#addName").prev(".program_name").children("input").attr("name");
    var beforeInputName = $("#addName").prev(".program_name").children("input").attr("value");

    if(beforeInputVal == undefined){ // 无条件添加第一个input
        var iprogram_name = '<i class="program_name">'
            + '<input type="text" name="" value="" placeholder="输入分析的节目名称" onkeyup="searchProgram(this,event)"  />'
            + '<img onclick="removeInput(this)" src="./11/image/remove.png" />'
            + '<ul class="programUl" id="programUl"></ul> </i>';
        $("#addName").before(iprogram_name);
    }else{
        //前一个val不能为空 && 前一个不能改变 && 前方所有input框的val和name 相等
        if(beforeInputVal != '' && beforeInputVal == beforeInputName && programValArr.toString() == programNameArr.toString()){
            if(len < 5){
                var iprogram_name = '<i class="program_name">'
                    + '<input type="text" name="" value="" placeholder="输入分析的节目名称" onkeyup="searchProgram(this,event)" />'
                    + '<img onclick="removeInput(this)" src="./11/image/remove.png" />'
                    + '<ul class="programUl" id="programUl"></ul> </i>';
                $("#addName").before(iprogram_name);
            }
            if(len == 4){
                $("#addName").hide();
            }
        }else {
            //遍历哪一个 input的 val和name不相等
            var inputValcur = [],inputNamecur = [];
            for(var i=0;i<programValArr.length;i++){
                inputValcur = programValArr[i];
                inputNamecur = programNameArr[i];
                if(inputValcur.toString() == inputNamecur.toString()){
                    if(inputValcur.toString()==''){  //为空
                        $("#programInput i").eq(i).children("input").addClass("erro")
                    }
                }else {
                    $("#programInput i").eq(i).children("input").addClass("erro")
                }
            }
        }
    }

}

/*  【点击 input X 删除】 --------------------------------------------------第二步点击X删除   */
function removeInput(obj) {
    var len = $("#programInput .program_name").length;
    if(len >= 1){
        $(obj).parent(".program_name").remove();
        $(".addnamespan").show();
    }else {
        console.log("最少保留一个节目")
    }
}

/* 【查询】----------------------------------------------------------------点击 查询  */
function doSearch(){

    //初始化为 7天 day
    lastCheckTime = '7天';
    lastCheckBaseLine = 'day';
    lastCheckBaseLineText = '日线';
    $("#mouseLinkMove").removeClass('selected');
    $("#containerVideo,#containerNews,#containerRadical").removeClass("containerLian");
    Highcharts.Point.prototype.highlight = function (event) {
        return false;
    };
    $(".containercon ").off("mousemove");
    //1 获取 输入的节目名称 //最多五个节目
    programNameArr = [];programValArr = [];programIdArr=[];
    $("#programInput > .program_name > input").each(function(){
        var valEach = $(this).val();
        var valEachName = $(this).attr("name");
        var valEachId = $(this).attr("id");
        programValArr.push(valEach);
        programNameArr.push(valEachName);
        programIdArr.push(valEachId)
    });
    //1 获取 视频平台 name id
    videoArr = [];videoIdArr = [];
    $("#video .selected").each(function(){
        var valEach = $(this).text();
        var valEachId = $(this).attr("data");
        videoArr.push(valEach);
        videoIdArr.push(valEachId);
    });
    //2 获取 新闻平台 name id
    newsPlatName = [];newsPlatId = [];
    $("#newsPlats .selected").each(function(){
        var valEach = $(this).text();
        var valEachId = $(this).attr("data");
        newsPlatName.push(valEach);
        newsPlatId.push(valEachId);
    });
    //3 获取 指数平台、平台人群 ===指数平台的名称 name id
    radicalPlatName = [];radicalPlatId = [];
    $("#radical .selected").each(function(){
        var valEach = $(this).text();
        var valEachId = $(this).attr("data");
        radicalPlatName.push(valEach);
        radicalPlatId.push(valEachId);
    });

    //节目、视频、指数平台必选
    if(programValArr.length == 0){
        $("#Prompt .Prompt_bd >strong").html("请输入要分析的节目名称!");
        $(".mask,#Prompt").show();
    }else{
        //遍历哪一个 input的 val和name不相等
        var inputValcur = [],inputNamecur = [];
        for(var i=0;i<programValArr.length;i++){
            inputValcur = programValArr[i];
            inputNamecur = programNameArr[i];
            if(inputValcur.toString() == inputNamecur.toString()){
                if(inputValcur.toString()==''){  //为空
                    $("#programInput i").eq(i).children("input").addClass("erro");
                    return false;
                }
            }else {
                $("#programInput i").eq(i).children("input").addClass("erro");
                return false;
            }
        }

        if(videoArr.length == 0){
            $("#Prompt .Prompt_bd >strong").html("请选择要分析的视频平台!")
            $(".mask,#Prompt").show();
        }else if(newsPlatName.length == 0){
            $("#Prompt .Prompt_bd >strong").html("请选择要分析的新闻平台!")
            $(".mask,#Prompt").show();
        }else if(radicalPlatName.length == 0){
            $("#Prompt .Prompt_bd >strong").html("请选择要分析的指数平台!")
            $(".mask,#Prompt").show();
        }else {

            var videoAttr = $("#doSearchBtn").attr("video");
            var newsAttr = $("#doSearchBtn").attr("news");
            var radicalAttr = $("#doSearchBtn").attr("radical");
            if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done'){//必须所有请求完成 才可以发起请求
                //  视频平台          新闻平台          指数平台           人群,#theCrowd,#selected_people
                $("#selected_video,#selected_news,#selected_radical").empty();

                //时间重置为7天
                $(".data").hide();
                $(".data>a>.startTimeAndEndTime").removeClass("selected");

                $("#customTime_video").show();
                $("#selectedTime_video > span").removeClass("selected");
                $("#selectedTime_video > span:first-child").addClass("selected");

                $("#customTime_news").show();
                $("#selectedTime_news > span").removeClass("selected");
                $("#selectedTime_news > span:first-child").addClass("selected");

                $("#customTime_radical").show();
                $("#selectedTime_radical > span").removeClass("selected");
                $("#selectedTime_radical > span:first-child").addClass("selected");

                //baseline 设置为day
                $(".baseline>button").text('日线');
                $(".baseline>button").attr({ "baseVal" : 'day'});
                $(".baseline_dropdown").hide();
                $(".baseline_dropdown>ul").removeClass("cur");

                //还原设置
                $(".span_select").removeClass('selected');  // 平均 表 不选
                $("#quchong_news").addClass('selected');  // 重


                $("#containerVideo").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
                $("#containerNews").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
                $("#containerRadical").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
                // $.when(getdataVideo()).done(function( data, textStatus, jqXHR ){
                //     $.when(getdataNews()).done(function(){
                //         $.when(getdataRadical()).done(function () {
                //             //console.log('执行完毕')
                //         })
                //     });
                // })

                getdataVideo();
                getdataNews();
                getdataRadical();
            }




            // ---------------------------------------------------------------------------------------------------------------------------------------------------
            //111111视频播放量分析
            //$(".loading").show();
            //$("#containerVideo").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
            //getdataVideo();
            //222222新闻统计分析
            //getdataNews();
            //333333平台指数分析
            //getdataRadical();

            //444444平台人群属性分析
            // yearsFenbu();// 041
            // sexFenbu();// 042
            //
            // mapShengfen();
            // mapQuyu();
            // mapChengshi();
        }
    }
}

/* 【清空】----------------------------------------------------------------点击 清空  */
function doEmpty(){
    $("#video .selected,#newsPlats .selected, #radical .selected").each(function(){
        $(this).removeClass("selected");
    });
    $("#programInput>i").remove();
}

/* 【00鼠标联动分析 】------------------------------------------------------------------------  */
function isMouseLink() {
    if($("#mouseLinkMove").hasClass("selected")){

        $("#containerVideo").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        $("#containerNews").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        $("#containerRadical").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        /*/!*
        00001判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
        *!/*/

        $("#selectedTime_video>span").removeClass("selected");
        $("#selectedTime_news>span").removeClass("selected");
        $("#selectedTime_radical>span").removeClass("selected");
        if(lastCheckTime =='7天'){
            $("#selectedTime_video>span:first-child").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:first-child").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:first-child").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='30天'){
            $("#selectedTime_video>span:nth-child(2)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(2)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(2)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");

        }else if(lastCheckTime =='90天'){
            $("#selectedTime_video>span:nth-child(3)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(3)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(3)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='半年'){
            $("#selectedTime_video>span:nth-child(4)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(4)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(4)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='全部'){
            $("#selectedTime_video>span:nth-child(5)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(5)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(5)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else {
            $("#customTime_video").hide();
            $("#date_video").show();
            $("#date_video>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);

            $("#customTime_news").hide();
            $("#date_news").show();
            $("#date_news>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
            $("#customTime_radical").hide();
            $("#date_radical").show();
            $("#date_radical>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
        }

        $("#baseline_video>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_video>button").text(lastCheckBaseLineText);

        $("#baseline_news>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_news>button").text(lastCheckBaseLineText);

        $("#baseline_radical>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_radical>button").text(lastCheckBaseLineText);

        /**
         * 为了让多个图表的提示框即十字准星线能够联动，这里绑定多个图表的附件 dom 的鼠标事件进行联动
         */
        $(".containerLian").on('mousemove', function (e) {
            var chart,
                point,
                i,
                event;
            for (i = 0; i < Highcharts.charts.length; i++) {
                //console.log(Highcharts.charts);
                chart = Highcharts.charts[i];
                if(typeof(chart) !== "undefined"){
                    event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                    point = chart.series[0].searchPoint(event, true); // Get the hovered point
                    if (point) {
                        point.highlight(e);
                    }
                }
            }
        });
        /**
         * 重写内部的方法， 这里是将提示框即十字准星的隐藏函数关闭
         */
        Highcharts.Pointer.prototype.reset = function () {
            return undefined;
        };
        /**
         * 高亮当前的数据点，并设置鼠标滑动状态及绘制十字准星线
         */
        Highcharts.Point.prototype.highlight = function (event) {
            this.onMouseOver(); // 显示鼠标激活标识
            //this.series.chart.tooltip.refresh(this); // 显示提示框
            this.series.chart.xAxis[0].drawCrosshair(event, this); // 显示十字准星线
        };

        $.when(getdataVideo()).done(function( data, textStatus, jqXHR ){
            $("#containerVideo").addClass("containerLian");
            $("#containerNews").addClass("containerLian");
            $("#containerRadical").addClass("containerLian");
            $.when(getdataNews()).done(function(){
                $.when(getdataRadical()).done(function () {

                })
            });
        })
    }
}

function mouseLinkMove(obj) {
    var videoAttr = $("#doSearchBtn").attr("video");
    var newsAttr = $("#doSearchBtn").attr("news");
    var radicalAttr = $("#doSearchBtn").attr("radical");
    if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
        if($("#selected_video>li").length == 0){
            return false;
        }else {
            if( $(obj).hasClass('selected') ){
                $(obj).removeClass("selected");
                $(".containercon").off("mousemove");
                $("#containerVideo,#containerNews,#containerRadical").removeClass("containerLian");

                $.blockUI({
                    message: '<img style="margin: 0 auto;" src="' + basePath + 'common/image/loading.gif" alt="请稍后..."/>'
                });

                analysisVideo()
                analysisNews()
                analysisRadical()
                /* /!*
                 * //00001判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_video = $("#selectedTime_video > span.selected").text();
                 if(time_video){
                 time_video = $("#selectedTime_video > span.selected").text();
                 }else {
                 var timeCustom = $("#date_video>a>.startTimeAndEndTime").text();
                 time_video = timeCustom.slice(3);
                 }
                 var baseLine_video = $("#baseline_video>button").attr("baseVal");
                 if(time_video ==lastCheckTime && baseLine_video ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisVideo();
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataVideo();
                 }

                 /!*
                 * //00002判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_news = $("#selectedTime_news > span.selected").text();
                 if(time_news){
                 time_news = $("#selectedTime_news > span.selected").text();
                 }else {
                 var timeCustom = $("#date_news>a>.startTimeAndEndTime").text();
                 time_news = timeCustom.slice(3);
                 }
                 var baseLine_news = $("#baseline_news>button").attr("baseVal");
                 if(time_news ==lastCheckTime && baseLine_news ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisNews()
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataNews();
                 }
                 /!*
                 * //00003判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_radical = $("#selectedTime_radical > span.selected").text();
                 if(time_radical){
                 time_radical = $("#selectedTime_radical > span.selected").text();
                 }else {
                 var timeCustom = $("#date_radical>a>.startTimeAndEndTime").text();
                 time_radical = timeCustom.slice(3);
                 }
                 var baseLine_radical = $("#baseline_radical>button").attr("baseVal");
                 if(time_radical ==lastCheckTime && baseLine_radical ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisRadical()
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataRadical();
                 }*/

                Highcharts.Point.prototype.highlight = function (event) {
                    return false;
                };
                $(".containercon ").off("mousemove");
                $.unblockUI();
            }else {
                $(obj).addClass("selected");

                $("#containerVideo").addClass("containerLian");
                $("#containerNews").addClass("containerLian");
                $("#containerRadical").addClass("containerLian");
                /**
                 * 为了让多个图表的提示框即十字准星线能够联动，这里绑定多个图表的附件 dom 的鼠标事件进行联动
                 */

                $(".containerLian").on('mousemove', function (e) {
                    var chart,
                        point,
                        i,
                        event;
                    for (i = 0; i < Highcharts.charts.length; i++) {
                        //console.log(Highcharts.charts);
                        chart = Highcharts.charts[i];
                        if(typeof(chart) !== "undefined"){
                            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                            point = chart.series[0].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.highlight(e);
                            }
                        }
                    }
                });
                /**
                 * 重写内部的方法， 这里是将提示框即十字准星的隐藏函数关闭
                 */
                Highcharts.Pointer.prototype.reset = function () {
                    return undefined;
                };
                /**
                 * 高亮当前的数据点，并设置鼠标滑动状态及绘制十字准星线
                 */
                Highcharts.Point.prototype.highlight = function (event) {
                    this.onMouseOver(); // 显示鼠标激活标识
                    //this.series.chart.tooltip.refresh(this); // 显示提示框
                    this.series.chart.xAxis[0].drawCrosshair(event, this); // 显示十字准星线
                };

                // 0001 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var video_time = $("#selectedTime_video > span.selected").text();
                if(video_time){
                    video_time = $("#selectedTime_video > span.selected").text();
                }else {
                    var timeCustom = $("#date_video>a>.startTimeAndEndTime").text();
                    video_time = timeCustom.slice(3);
                }
                var video_baseLine = $("#baseline_video>button").attr("baseVal");
                if(video_time == lastCheckTime && video_baseLine == lastCheckBaseLine){

                }else {// 需要设置时间 并查询
                    $("#selectedTime_video>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_video>span:first-child").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_video>span:nth-child(2)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_video>span:nth-child(3)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_video>span:nth-child(4)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_video>span:nth-child(5)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_video").hide();
                        $("#date_video").show();
                        $("#date_video>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_video>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_video>button").text(lastCheckBaseLineText);
                }
                // 0002 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var news_time = $("#selectedTime_news > span.selected").text();
                if(news_time){
                    news_time = $("#selectedTime_news > span.selected").text();
                }else {
                    var timeCustom = $("#date_news>a>.startTimeAndEndTime").text();
                    news_time = timeCustom.slice(3);
                }
                var news_baseLine = $("#baseline_news>button").attr("baseVal");
                if(news_time == lastCheckTime && news_baseLine == lastCheckBaseLine){
                    //analysisNews()
                }else {// 需要设置时间 并查询
                    $("#selectedTime_news>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_news>span:first-child").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_news>span:nth-child(2)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_news>span:nth-child(3)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_news>span:nth-child(4)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_news>span:nth-child(5)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_news").hide();
                        $("#date_news").show();
                        $("#date_news>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_news>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_news>button").text(lastCheckBaseLineText);
                }

                // 0003 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var radical_time = $("#selectedTime_radical > span.selected").text();
                if(radical_time){
                    radical_time = $("#selectedTime_radical > span.selected").text();
                }else {
                    var timeCustom = $("#date_radical>a>.startTimeAndEndTime").text();
                    radical_time = timeCustom.slice(3);
                }
                var radical_baseLine = $("#baseline_radical>button").attr("baseVal");
                if(radical_time == lastCheckTime && radical_baseLine == lastCheckBaseLine){
                }else {// 需要设置时间 并查询
                    $("#selectedTime_radical>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_radical>span:first-child").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_radical>span:nth-child(2)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_radical>span:nth-child(3)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_radical>span:nth-child(4)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_radical>span:nth-child(5)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_radical").hide();
                        $("#date_radical").show();
                        $("#date_radical>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_radical>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_radical>button").text(lastCheckBaseLineText);
                    //getdataRadical()
                }

                // 此功能是为了防止某些用户 点击取消联动后立即回点联动
                if(mouseLinked == 'no'){
                    mouseLinked = 'yes';
                    //重新加载数据
                    $.when(getdataVideo()).done(function( data, textStatus, jqXHR ){
                        $("#containerVideo").addClass("containerLian");
                        $("#containerNews").addClass("containerLian");
                        $("#containerRadical").addClass("containerLian");
                        $.when(getdataNews()).done(function(){
                            $.when(getdataRadical()).done(function () {

                            })
                        });
                    })
                }else {
                    mouseLinked = 'yes';
                }

            }
        }
    }
}

/*

function isMouseLink() {
    if($("#mouseLinkMove").hasClass("selected")){

        $("#containerVideo").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        $("#containerNews").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        $("#containerRadical").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
        /!*!/!*
         00001判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
         *!/!*!/

        $("#selectedTime_video>span").removeClass("selected");
        $("#selectedTime_news>span").removeClass("selected");
        $("#selectedTime_radical>span").removeClass("selected");
        if(lastCheckTime =='7天'){
            $("#selectedTime_video>span:first-child").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:first-child").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:first-child").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='30天'){
            $("#selectedTime_video>span:nth-child(2)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(2)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(2)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");

        }else if(lastCheckTime =='90天'){
            $("#selectedTime_video>span:nth-child(3)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(3)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(3)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='半年'){
            $("#selectedTime_video>span:nth-child(4)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(4)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(4)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else if(lastCheckTime =='全部'){
            $("#selectedTime_video>span:nth-child(5)").addClass("selected");
            $("#customTime_video").show();
            $("#date_video").hide();
            $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_news>span:nth-child(5)").addClass("selected");
            $("#customTime_news").show();
            $("#date_news").hide();
            $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");

            $("#selectedTime_radical>span:nth-child(5)").addClass("selected");
            $("#customTime_radical").show();
            $("#date_radical").hide();
            $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
        }else {
            $("#customTime_video").hide();
            $("#date_video").show();
            $("#date_video>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);

            $("#customTime_news").hide();
            $("#date_news").show();
            $("#date_news>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
            $("#customTime_radical").hide();
            $("#date_radical").show();
            $("#date_radical>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
        }

        $("#baseline_video>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_video>button").text(lastCheckBaseLineText);

        $("#baseline_news>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_news>button").text(lastCheckBaseLineText);

        $("#baseline_radical>button").attr('baseval',lastCheckBaseLine);
        $("#baseline_radical>button").text(lastCheckBaseLineText);

        /!**
         * 为了让多个图表的提示框即十字准星线能够联动，这里绑定多个图表的附件 dom 的鼠标事件进行联动
         *!/
        $(".containerLian").on('mousemove', function (e) {
            var chart,
                point,
                i,
                event;
            for (i = 0; i < Highcharts.charts.length; i++) {
                //console.log(Highcharts.charts);
                chart = Highcharts.charts[i];
                if(typeof(chart) !== "undefined"){
                    event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                    point = chart.series[0].searchPoint(event, true); // Get the hovered point
                    if (point) {
                        point.highlight(e);
                    }
                }
            }
        });
        /!**
         * 重写内部的方法， 这里是将提示框即十字准星的隐藏函数关闭
         *!/
        Highcharts.Pointer.prototype.reset = function () {
            return undefined;
        };
        /!**
         * 高亮当前的数据点，并设置鼠标滑动状态及绘制十字准星线
         *!/
        Highcharts.Point.prototype.highlight = function (event) {
            this.onMouseOver(); // 显示鼠标激活标识
            //this.series.chart.tooltip.refresh(this); // 显示提示框
            this.series.chart.xAxis[0].drawCrosshair(event, this); // 显示十字准星线
        };

        $.when(getdataVideo()).done(function( data, textStatus, jqXHR ){
            $("#containerVideo").addClass("containerLian");
            $("#containerNews").addClass("containerLian");
            $("#containerRadical").addClass("containerLian");
            $.when(getdataNews()).done(function(){
                $.when(getdataRadical()).done(function () {

                })
            });
        })



    }
}

function mouseLinkMove(obj) {
    var videoAttr = $("#doSearchBtn").attr("video");
    var newsAttr = $("#doSearchBtn").attr("news");
    var radicalAttr = $("#doSearchBtn").attr("radical");
    if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
        if($("#selected_video>li").length == 0){
            return false;
        }else {
            if( $(obj).hasClass('selected') ){
                $(obj).removeClass("selected");
                $(".containercon ").off("mousemove");
                $("#containerVideo,#containerNews,#containerRadical").removeClass("containerLian");
                $(".lianDong").hide().empty();
                $.blockUI({
                    message: '<img style="margin: 0 auto;" src="' + basePath + 'common/image/loading.gif" alt="请稍后..."/>'
                });

                analysisVideo()
                analysisNews()
                analysisRadical()
                /!* /!*
                 * //00001判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_video = $("#selectedTime_video > span.selected").text();
                 if(time_video){
                 time_video = $("#selectedTime_video > span.selected").text();
                 }else {
                 var timeCustom = $("#date_video>a>.startTimeAndEndTime").text();
                 time_video = timeCustom.slice(3);
                 }
                 var baseLine_video = $("#baseline_video>button").attr("baseVal");
                 if(time_video ==lastCheckTime && baseLine_video ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisVideo();
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataVideo();
                 }

                 /!*
                 * //00002判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_news = $("#selectedTime_news > span.selected").text();
                 if(time_news){
                 time_news = $("#selectedTime_news > span.selected").text();
                 }else {
                 var timeCustom = $("#date_news>a>.startTimeAndEndTime").text();
                 time_news = timeCustom.slice(3);
                 }
                 var baseLine_news = $("#baseline_news>button").attr("baseVal");
                 if(time_news ==lastCheckTime && baseLine_news ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisNews()
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataNews();
                 }
                 /!*
                 * //00003判断条件如果相等，则无需重新查询数据，但是需要重新渲染图表 以去掉计量单位 保持宽度一致
                 *!/
                 var time_radical = $("#selectedTime_radical > span.selected").text();
                 if(time_radical){
                 time_radical = $("#selectedTime_radical > span.selected").text();
                 }else {
                 var timeCustom = $("#date_radical>a>.startTimeAndEndTime").text();
                 time_radical = timeCustom.slice(3);
                 }
                 var baseLine_radical = $("#baseline_radical>button").attr("baseVal");
                 if(time_radical ==lastCheckTime && baseLine_radical ==lastCheckBaseLine ){
                 //渲染图表即可
                 analysisRadical()
                 }else {
                 //按照最后一次选择的条件查询数据 并 渲染图表
                 getdataRadical();
                 }*!/

                Highcharts.Point.prototype.highlight = function (event) {
                    return false;
                };
                $(".containercon ").off("mousemove");
                $.unblockUI();
            }else {
                $(obj).addClass("selected");

                $("#containerVideo").addClass("containerLian");
                $("#containerNews").addClass("containerLian");
                $("#containerRadical").addClass("containerLian");
                /!**
                 * 为了让多个图表的提示框即十字准星线能够联动，这里绑定多个图表的附件 dom 的鼠标事件进行联动
                 *!/

                $(".containerLian").on('mousemove', function (e) {
                    var chart,
                        point,
                        i,
                        event;
                    for (i = 0; i < Highcharts.charts.length; i++) {
                        //console.log(Highcharts.charts);
                        chart = Highcharts.charts[i];
                        if(typeof(chart) !== "undefined"){
                            event = chart.pointer.normalize(e.originalEvent); // Find coordinates within the chart
                            point = chart.series[0].searchPoint(event, true); // Get the hovered point
                            if (point) {
                                point.highlight(e);
                            }
                        }
                    }
                });
                /!**
                 * 重写内部的方法， 这里是将提示框即十字准星的隐藏函数关闭
                 *!/
                Highcharts.Pointer.prototype.reset = function () {
                    return undefined;
                };
                /!**
                 * 高亮当前的数据点，并设置鼠标滑动状态及绘制十字准星线
                 *!/
                Highcharts.Point.prototype.highlight = function (event) {
                    this.onMouseOver(); // 显示鼠标激活标识
                    //this.series.chart.tooltip.refresh(this); // 显示提示框
                    this.series.chart.xAxis[0].drawCrosshair(event, this); // 显示十字准星线
                };

                // 0001 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var video_time = $("#selectedTime_video > span.selected").text();
                if(video_time){
                    video_time = $("#selectedTime_video > span.selected").text();
                }else {
                    var timeCustom = $("#date_video>a>.startTimeAndEndTime").text();
                    video_time = timeCustom.slice(3);
                }
                var video_baseLine = $("#baseline_video>button").attr("baseVal");
                if(video_time == lastCheckTime && video_baseLine == lastCheckBaseLine){
                    analysisVideo()
                }else {// 需要设置时间 并查询
                    $("#selectedTime_video>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_video>span:first-child").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_video>span:nth-child(2)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_video>span:nth-child(3)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_video>span:nth-child(4)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_video>span:nth-child(5)").addClass("selected");
                        $("#customTime_video").show();
                        $("#date_video").hide();
                        $("#date_video>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_video").hide();
                        $("#date_video").show();
                        $("#date_video>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_video>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_video>button").text(lastCheckBaseLineText);
                    getdataVideo()
                }

                // 0002 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var news_time = $("#selectedTime_news > span.selected").text();
                if(news_time){
                    news_time = $("#selectedTime_news > span.selected").text();
                }else {
                    var timeCustom = $("#date_news>a>.startTimeAndEndTime").text();
                    news_time = timeCustom.slice(3);
                }
                var news_baseLine = $("#baseline_news>button").attr("baseVal");
                if(news_time == lastCheckTime && news_baseLine == lastCheckBaseLine){
                    analysisNews()
                }else {// 需要设置时间 并查询
                    $("#selectedTime_news>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_news>span:first-child").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_news>span:nth-child(2)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_news>span:nth-child(3)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_news>span:nth-child(4)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_news>span:nth-child(5)").addClass("selected");
                        $("#customTime_news").show();
                        $("#date_news").hide();
                        $("#date_news>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_news").hide();
                        $("#date_news").show();
                        $("#date_news>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_news>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_news>button").text(lastCheckBaseLineText);
                    getdataNews()
                }

                // 0003 判断当前时间 和最后的时间 是否相同------------------------------------------------------
                var radical_time = $("#selectedTime_radical > span.selected").text();
                if(radical_time){
                    radical_time = $("#selectedTime_radical > span.selected").text();
                }else {
                    var timeCustom = $("#date_radical>a>.startTimeAndEndTime").text();
                    radical_time = timeCustom.slice(3);
                }
                var radical_baseLine = $("#baseline_radical>button").attr("baseVal");
                if(radical_time == lastCheckTime && radical_baseLine == lastCheckBaseLine){
                    analysisRadical()
                }else {// 需要设置时间 并查询
                    $("#selectedTime_radical>span").removeClass("selected");
                    if(lastCheckTime =='7天'){
                        $("#selectedTime_radical>span:first-child").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='30天'){
                        $("#selectedTime_radical>span:nth-child(2)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='90天'){
                        $("#selectedTime_radical>span:nth-child(3)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='半年'){
                        $("#selectedTime_radical>span:nth-child(4)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else if(lastCheckTime =='全部'){
                        $("#selectedTime_radical>span:nth-child(5)").addClass("selected");
                        $("#customTime_radical").show();
                        $("#date_radical").hide();
                        $("#date_radical>a>span.startTimeAndEndTime").removeClass("selected");
                    }else {
                        $("#customTime_radical").hide();
                        $("#date_radical").show();
                        $("#date_radical>a>span.startTimeAndEndTime").show().addClass("selected").text("日期："+lastCheckTime);
                    }

                    $("#baseline_radical>button").attr('baseval',lastCheckBaseLine);
                    $("#baseline_radical>button").text(lastCheckBaseLineText);
                    getdataRadical()
                }


            }
        }
    }
}

*/
