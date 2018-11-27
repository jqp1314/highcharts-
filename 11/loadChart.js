//为导出保存chart对象
var chartVideo = null;
var chartNews = null;
var chartRadical = null;

/* 【00发起ajax请求 获取数据 】----Video--------------------------------------------------------------------  */
function getdataVideo() {
    /*重新加载*/
    $("#selected_video").find("li").removeClass("cured cur"); // 平台 还原
    $("#setJunVideo").removeClass('selected');  // 平均 不选

    var time = '7天';
    var baseLine = 'day';
    if($("#mouseLinkMove").hasClass("selected")){
        time = lastCheckTime;
        baseLine =lastCheckBaseLine;
        var mouseLink = '1'
    }else {
        time = $("#selectedTime_video > span.selected").text();
        if(time){
            time = $("#selectedTime_video > span.selected").text();
        }else {
            var timeCustom = $("#date_video>a>.startTimeAndEndTime").text();
            time = timeCustom.slice(3);
        }
        baseLine = $("#baseline_video>button").attr("baseVal");
        var mouseLink = '0';
        mouseLinked = 'no';
    }
    var parm = {programId: programIdArr.join(","), programName: programValArr.join(","), videoId: videoIdArr.join(","),videoName:videoArr.join(","),videoTime: time,baseline: baseLine,mouseLink:mouseLink}
    console.log(parm);
    //var defer = $.Deferred();
    // $.ajax({
    //     //async: false,
    //     type: "POST",
    //     url: basePath + 'programTrendAnalysis/getVideoPlayback',
    //     data: JSON.stringify(parm),
    //     contentType: "application/json",
    //     dataType: "json",
    //     // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
    //     beforeSend: function () {
    //         $("#containerVideo").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
    //         $("#doSearchBtn").attr("video",'pending');
    //         //$("#loading_video").show();
    //     },
    //     success: function (data) {

    var data = {
        categories:['2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07', '2018-10-08', '2018-10-09', '2018-10-10'],
        "series":{
            "爱奇艺":[{
                name: '长盛天歌01',
                data: [0, 0, 0, 301, 401, 501, 1010],
                jun:'0',
                percent:[10, 10, 10, 10, 10, 10, 10],
                upDown:['equal','equal','equal','equal','equal','equal','equal']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'111',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','down','down','down','down','down']
            }],
            "搜狐视频":[{
                name: '长盛天歌02',
                data: [01, 101, 201, 301, 401, 501, 101],
                jun:'222',
                percent:[-20, -20, -20, -20, -20, -20, -20],
                upDown:['up','up','up','up','up','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'222',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }],
        }};


            // /* 拿到数据后：先处理——两步走*/
            // /*第一步 先排序 按照视频平台：的显示顺序 与先后选择无关 -------11111111111111111----------------------------*/
            // 后台已经排序好，暂不需要排序

            // /*第二步 加属性：marker{symbol:circle} color:"#CC9999" ----------2222222222222222222---------------------*/
            var series =[];
            var dataCur = data['series'];
            var tab = [];
            // 021 加marker
            var w= 0;
            for(var key in dataCur){
                series = series.concat(dataCur[key]);
                for(var v = 0;v < programValArr.length;v++){ //   v=01234,    programValArr.length=1 2 3 4 5最多五个节目
                    if(dataCur[key] == ''){
                        //console.log('没有')
                    }else {
                        var dataCurList = dataCur[key][v];
                        if (typeof(dataCurList) !== "undefined"){
                            dataCur[key][v].marker={};
                            dataCur[key][v].marker.symbol=symbol[w];
                        }
                    }
                }
                w++;// 1 2 3 4 5
                tab  += '<li onclick="setChartsXaisVideo(this)"> <span class="cls'+w+'"></span>'+key+' </li>';
                $("#selected_video").empty().append(tab);
            }

            if(series.length > 0){
                // 022 加color
                for(var r=0;r<series.length;r++){
                    series[r].color=colors[r];
                }
                resultsDataVideo = data;
                analysisVideo()

            }else {
                resultsDataVideo = [];
                //chartVideo = null;
                $("#containerVideo").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>');
            }
    //         defer.resolve(data)
    //     },
    //     complete: function () {
    //         $("#doSearchBtn").attr("video",'done');
    //     },
    //     error: function(XMLHttpRequest, textStatus, errorThrown) {
    //         // textStatus的值：null, timeout, error, abort, parsererror
    //         // errorThrown的值：收到http出错文本，如 Not Found 或 Internal Server Error
    //         console.log(textStatus)
    //     }
    // });
    // return defer;
}

// 01 设置图表setChartsOptions
// 02 渲染图表
function analysisVideo() {
    var data = resultsDataVideo;
    if(data == ''){
        return false;
    }else {
        // 设置图形数据
        var series =[];
        var dataCur = data['series'];
        for(key in dataCur){
            series = series.concat(dataCur[key]);
        }

        xuanranChartsVideo(data,series);

    }

}

function xuanranChartsVideo(data,series) {
    var options = setChartsOptions();
    var xAxisTime = data['categories'];
    if(xAxisTime.length >= 20){
        var num = Math.round(xAxisTime.length/10)
        options.xAxis.tickInterval = num;
    }
    options.chart.renderTo = 'containerVideo';
    options.credits.text = '视频播放量分析-击壤大数据';
    //options.xAxis.categories = data['categories'];
    options.xAxis.max = xAxisTime.length-1;
    options.xAxis.maxRange = xAxisTime.length-1;
    options.xAxis.maxPadding = xAxisTime.length-1;
    options.xAxis.labels.formatter = function () {return xAxisTime[this.value]};
    options.yAxis.labels.formatter = function () {return this.value + '次'};
    options.series = series;

    // 是否显示均线 增加平均线
    if($("#setJunVideo").hasClass("selected")){
        //有均线的提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //有均线显示数据
            var contentJun = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {

                //获取百分比
                var percentArr = this.points[i].series.userOptions.percent;
                var percent_;
                if(percentArr instanceof  Array) percent_ = percentArr[index];

                //获取upDown
                var upDownArr = this.points[i].series.userOptions.upDown;
                var upDown_;
                if(upDownArr instanceof  Array) upDown_ =upDownArr[index];
                var bgImg = '';
                if(upDown_ == 'up'){
                    bgImg = '<span style="background:url(./11/image/up.png) left no-repeat; "></span>'
                }else if(upDown_ == 'down'){
                    bgImg = '<span style="background:url(./11/image/down.png) left no-repeat; "></span>';
                    percent_ = '-'+percent_
                }else if(upDown_ == 'equal') {
                    bgImg = '<span>—</span>';
                }else {
                    bgImg = '<span>--</span>';
                }
                //获取平均值
                var jun_ = this.points[i].series.userOptions.jun;

                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                contentJun += '<div class="toolTip">'
                    + '<span>' +bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>'+ bgImg + this.points[i].y +'</span>'
                    + '<span>'+jun_+'</span>' //平均值
                    + '<span>'+percent_+'%</span></div>'; // 升降百分比
            }
            return contentJun;
        }
        //获取plotLines
        var plotLinesCur = [];
        for( var j = 0;j<series.length ;j++){
            var colorName = series[j].color;
            var idName = 'id'+colorName.slice(1);
            plotLinesCur = plotLinesCur.concat({color:series[j].color, value:series[j].jun,width:1,dashStyle:'longdashdot',className:idName,zIndex:3})
        }
        options.yAxis.plotLines = plotLinesCur;
        chartVideo = new Highcharts.Chart(options);

        //判断隐藏的节目 均线也隐藏
        var lengthS = chartVideo.series.length;
        for(var i=0;i<lengthS;i++){
            if(chartVideo.series[i].visible){//true
            }else {
                chartVideo.userOptions.yAxis.plotLines[i] = {};
                $("#containerVideo .highcharts-plot-lines-3 .highcharts-plot-line").eq(i).hide()
            }
        }
    }else {
        //无均线提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //没有均线显示数据
            var content = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {
                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                content += '<div class="toolTip" id="toolTop1">'
                    + '<span>' +bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>' + this.points[i].y +'</span></div>';

                //content += '<span style="color: ' + this.points[i].series.color + '">' + this.points[i].series.name + '</span>: ' + this.points[i].y + '<br/>';
            }
            return content;
        }
        chartVideo = new Highcharts.chart(options);
    }
}

// 03left 点击平台  改变横坐标事件  每次加减五组数据  操作数据-不去后台请求
function setChartsXaisVideo(obj) {
    var data = resultsDataVideo;
    // 设置图形数据
    var series =[];
    var dataCur = data['series'];
    //根据是否有cured 加载对应数据
    if($(obj).hasClass("cured")){
        $(obj).removeClass("cured");

        var str = $("#selected_video>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, ""); // 去除两头空格
        var curArr = arr.split('  ');

        for(var i = 0;i<curArr.length;i++ ){
            var name = curArr[i];
            if(name){
                series = series.concat(dataCur[name]);
            }
        }
    }else {
        $(obj).addClass("cured");

        var str = $("#selected_video>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, "");
        var curArr = arr.split('  ');

        for(var i = 0;i<curArr.length;i++ ){
            var name = curArr[i];
            if(name){
                series = series.concat(dataCur[name]);
            }else {
                $("#containerVideo").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>');
            }
        }
    }

    if(series != ''){
        xuanranChartsVideo(data,series);
    }else {
        $("#containerVideo").empty().append('<div class="no_data">'
            +'<div><img src="./11/image/none_data.png" /> </div>'
            +'<p>在当前搜索条件下无数据</p>'
            +'<p>建议您放宽搜索条件进行查询！</p></div>')
    }
}

// 04点击均 显示平均线
function setJunVideo() {
    if($("#selected_video>li").length == 0){
        return false;
    }else {
        var data = resultsDataVideo;

        // 设置图形数据
        var series =[];
        var dataCur = data['series'];

        var str = $("#selected_video>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, "");
        var curArr = arr.split('  ');

        if(curArr.length >= 1){
            //获取series
            if(typeof(dataCur) != "undefined"){
                for(var i = 0;i<curArr.length;i++ ) {
                    var name = curArr[i];
                    series = series.concat(dataCur[name]);
                }
            }
            if(series != ''){
                // 是否显示均线 增加平均线
                if( $("#setJunVideo").hasClass('selected') ){
                    $("#setJunVideo").removeClass("selected");
                    xuanranChartsVideo(data,series);
                }else {
                    $("#setJunVideo").addClass("selected");
                    xuanranChartsVideo(data,series);
                }
            }else {
                $("#containerVideo").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>')
            }
        }else {
            $("#containerVideo").empty().append('<div class="no_data">'
                +'<div><img src="./11/image/none_data.png" /> </div>'
                +'<p>在当前搜索条件下无数据</p>'
                +'<p>建议您放宽搜索条件进行查询！</p></div>')
        }
    }
}

// 05日线 周线 月线...
function searchClickBaselineVideo(obj) {
    var baseVal = $(obj).attr("baseVal") ;
    var baseName = $(obj).text();
    if($("#selected_video>li").length == 0){
        $(obj).parent('.baseline_dropdown').hide();
        return false;
    }else {

        var videoAttr = $("#doSearchBtn").attr("video");
        var newsAttr = $("#doSearchBtn").attr("news");
        var radicalAttr = $("#doSearchBtn").attr("radical");
        if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
            $(obj).addClass("cur").siblings().removeClass("cur");
            $(obj).parent().siblings('button').text(baseName);
            $(obj).parent().siblings('button').attr({ "baseVal" : baseVal});
            $(obj).parent('.baseline_dropdown').hide();
            lastCheckBaseLine =  $(obj).attr("baseVal");
            lastCheckBaseLineText =  $(obj).text();
            if($("#mouseLinkMove").hasClass("selected")){
                isMouseLink()
            }else {
                getdataVideo();
            }
        }

    }
}

/* 【00发起ajax请求 获取数据 】----news--------------------------------------------------------------------  */
function getdataNews() {
    $("#selected_news").find("li").removeClass("cured cur"); // 平台 还原
    $("#setJunNews").removeClass('selected');  // 平均 不选

    var time = '7天';
    var baseLine = 'day';
    if($("#mouseLinkMove").hasClass("selected")){
        time = lastCheckTime;
        baseLine =lastCheckBaseLine;
        var mouseLink = '1'
    }else {
        time = $("#selectedTime_news > span.selected").text();
        if(time){
            time = $("#selectedTime_news > span.selected").text();
        }else {
            var timeCustom = $("#date_news>a>.startTimeAndEndTime").text();
            time = timeCustom.slice(3);
        }
        baseLine = $("#baseline_news>button").attr("baseVal");
        var mouseLink = '0';
        mouseLinked = 'no';
    }

    if($("#quchong_news").hasClass("selected")){
        var quChong = 'true';
    }else {
        var quChong = 'false';
    }

    var parm = {programId: programIdArr.join(","), programName: programValArr.join(","), newsPlatId: newsPlatId.join(","),newsPlatName:newsPlatName.join(","),newsTime: time,quChong:quChong,baseline: baseLine,mouseLink:mouseLink};
    console.log(parm);
    // var defer = $.Deferred();
    // var getXHRNews = $.ajax({
    //     //async: false,
    //     type: "POST",
    //     url: 'programTrendAnalysis/getNewsStatistic',
    //     data: JSON.stringify(parm),
    //     contentType: "application/json",
    //     dataType: "json",
    //     // 请求发送之前（发送请求前可修改XMLHttpRequest对象的函数，如添加自定义HTTP头。）。
    //     beforeSend: function () {
    //         $("#containerNews").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
    //         $("#doSearchBtn").attr("news",'pending');
    //         //$("#loading_news").show();
    //     },
    //     success: function (data) {

    var data = {
        categories:['2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07', '2018-10-08', '2018-10-09', '2018-10-10'],
        "series":{
            "百度新闻":[{
                name: '长盛天歌01',
                data: [0, 0, 0, 301, 401, 501, 1010],
                jun:'0',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'111',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }],
            "搜狗新闻":[{
                name: '长盛天歌02',
                data: [01, 101, 201, 301, 401, 501, 101],
                jun:'222',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'222',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }],
            "360新闻":[{
                name: '长盛天歌03',
                data: [01, 101, 201, 301, 401, 501, 101],
                jun:'333',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'333',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }]
        }};

            // /* 拿到数据后：先处理——两步走*/
            // /*第一步 先排序 按照视频平台：的显示顺序 与先后选择无关 -------11111111111111111----------------------------*/
            // 后台已经排序好，暂不需要排序

            // /*第二步 加参数：marker{symbol:circle} color:"#CC9999" ----------2222222222222222222-----------------------------------------*/
            var series =[];
            var dataCur = data['series'];
            var tab = [];
            // 021 加marker

            var w= 0;
            for(var key in dataCur){
                series = series.concat(dataCur[key]);
                for(var v = 0;v < programValArr.length;v++){ //   v=01234,    programValArr.length=1 2 3 4 5最多五个节目
                    if(dataCur[key] == ''){
                        //console.log('没有')
                    }else {
                        var dataCurList = dataCur[key][v];
                        if (typeof(dataCurList) !== "undefined"){
                            dataCur[key][v].marker={};
                            dataCur[key][v].marker.symbol=symbol[w];
                        }
                    }
                }
                w++;// 1 2 3 4 5
                tab  += '<li onclick="setChartsXaisNews(this)"> <span class="cls'+w+'"></span>'+key+' </li>';
                $("#selected_news").empty().append(tab);
            }

            if(series.length > 0){
                // 022 加color
                for(var r=0;r<series.length;r++){
                    series[r].color=colors[r];
                }
                resultsDataNews = data;
                analysisNews()
            }else {
                resultsDataNews = [];
                chartNews = null;
                $("#containerNews").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>')
                $("#loading_news").hide()
            }

    //         defer.resolve(data)
    //     },
    //     complete: function () {
    //         $("#doSearchBtn").attr("news",'done');
    //     },
    //     error:function(XMLHttpRequest, textStatus, errorThrown){
    //         console.log(textStatus);
    //     }
    // });
    // return defer;
}

// 01 设置图表setChartsOptions
// 02 渲染图表
function analysisNews() {
    var data = resultsDataNews;
    if(data == ''){
        return false;
    }else {
        // 设置图形数据
        var series =[];
        var dataCur = data['series'];
        for(key in dataCur){
            series = series.concat(dataCur[key]);
        }
        xuanranChartsNews(data,series)
    }
}

function xuanranChartsNews(data,series) {
    var options = setChartsOptions();
    var xAxisTime = data['categories'];
    if(xAxisTime.length >= 20){
        var num = Math.round(xAxisTime.length/10)
        options.xAxis.tickInterval = num;
    }
    options.chart.renderTo = 'containerNews';
    options.credits.text = '新闻统计分析-击壤大数据';
    options.xAxis.max = xAxisTime.length-1;
    options.xAxis.maxRange = xAxisTime.length-1;
    options.xAxis.maxPadding = xAxisTime.length-1;
    options.xAxis.labels.formatter = function () {return xAxisTime[this.value]};
    //options.xAxis.categories = data['categories'];
    options.yAxis.labels.formatter = function () {return this.value + '条'};
    options.series = series;

    // 是否显示均线 增加平均线
    if($("#setJunNews").hasClass("selected")){
        //有均线的提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //有均线显示数据
            var contentJun = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {

                //获取百分比
                var percentArr = this.points[i].series.userOptions.percent;
                var percent_;
                if(percentArr instanceof  Array) percent_ = percentArr[index];

                //获取upDown
                var upDownArr = this.points[i].series.userOptions.upDown;
                var upDown_;
                if(upDownArr instanceof  Array) upDown_ =upDownArr[index];
                var bgImg = '';
                if(upDown_ == 'up'){
                    bgImg = '<span style="background:url(./11/image/up.png) left no-repeat; "></span>'
                }else if(upDown_ == 'down'){
                    bgImg = '<span style="background:url(./11/image/down.png) left no-repeat; "></span>';
                    percent_ = '-'+percent_
                }else if(upDown_ == 'equal') {
                    bgImg = '<span>—</span>';
                }else {
                    bgImg = '<span>--</span>';
                }
                //获取平均值
                var jun_ = this.points[i].series.userOptions.jun;

                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                contentJun += '<div class="toolTip">'
                    + '<span>' +bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>'+ bgImg + this.points[i].y +'</span>'
                    + '<span>'+jun_+'</span>' //平均值
                    + '<span>'+percent_+'%</span></div>'; // 升降百分比
            }
            return contentJun;
        }
        //获取plotLines
        var plotLinesCur = [];
        for( var j = 0;j<series.length ;j++){
            var colorName = series[j].color;
            var idName = 'id'+colorName.slice(1);
            plotLinesCur = plotLinesCur.concat({color:series[j].color, value:series[j].jun,width:1,dashStyle:'longdashdot',className:idName,zIndex:3})
        }
        options.yAxis.plotLines = plotLinesCur;
        chartNews = new Highcharts.Chart(options);
        //判断隐藏的节目 均线也隐藏
        var lengthS = chartNews.series.length;
        for(var i=0;i<lengthS;i++){
            if(chartNews.series[i].visible){//true
            }else {
                chartNews.userOptions.yAxis.plotLines[i] = {};
                $("#containerNews .highcharts-plot-lines-3 .highcharts-plot-line").eq(i).hide()
            }
        }
    }else {
        //无均线提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //没有均线显示数据
            var content = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {
                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                content += '<div class="toolTip" id="toolTop1">'
                    + '<span>' +bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>' + this.points[i].y +'</span></div>';

                //content += '<span style="color: ' + this.points[i].series.color + '">' + this.points[i].series.name + '</span>: ' + this.points[i].y + '<br/>';
            }
            return content;
        }
        chartNews = new Highcharts.Chart(options);
    }
}

// 03left 点击平台  改变横坐标事件  每次加减五组数据  操作数据-不去后台请求
function setChartsXaisNews(obj) {
    var data = resultsDataNews;
    // 设置图形数据
    if(data == ''){
        return false
    }else {
        var series =[];
        var dataCur = data['series'];
        //根据是否有cured 加载对应数据
        if($(obj).hasClass("cured")){
            $(obj).removeClass("cured");

            var str = $("#selected_news>li").not(".cured").text();
            var arr = str.replace(/(^\s*)|(\s*$)/g, ""); // 去除两头空格
            var curArr = arr.split('  ');

            for(var i = 0;i<curArr.length;i++ ){
                var name = curArr[i];
                if(name){
                    series = series.concat(dataCur[name]);
                }else {
                    console.log("name=空 不会走")
                }
            }
        }else {
            $(obj).addClass("cured");

            var str = $("#selected_news>li").not(".cured").text();
            var arr = str.replace(/(^\s*)|(\s*$)/g, "");
            var curArr = arr.split('  ');

            for(var i = 0;i<curArr.length;i++ ){
                var name = curArr[i];
                if(name){
                    series = series.concat(dataCur[name]);
                }else {
                    $("#containerNews").empty().append('<div class="no_data">'
                        +'<div><img src="./11/image/none_data.png" /> </div>'
                        +'<p>在当前搜索条件下无数据</p>'
                        +'<p>建议您放宽搜索条件进行查询！</p></div>');
                }
            }
        }
        if(series.length == 0){
            $("#containerNews").empty().append('<div class="no_data">'
                +'<div><img src="./11/image/none_data.png" /> </div>'
                +'<p>在当前搜索条件下无数据</p>'
                +'<p>建议您放宽搜索条件进行查询！</p></div>')

        }else {
            xuanranChartsNews(data,series)
        }
    }
}

// 04点击均 显示平均线
function setJunNews() {
    if($("#selected_news>li").length == 0){
        return false;
    }else {
        var data = resultsDataNews;

        // 设置图形数据
        var series =[];
        var dataCur = data['series'];


        var str = $("#selected_news>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, "");
        var curArr = arr.split('  ');

        if(curArr.length >= 1){
            //获取series
            if(typeof(dataCur) != "undefined"){
                for(var i = 0;i<curArr.length;i++ ) {
                    var name = curArr[i];
                    series = series.concat(dataCur[name]);
                }
            }
            if(series != ''){
                // 是否显示均线 增加平均线
                if( $("#setJunNews").hasClass('selected') ){
                    $("#setJunNews").removeClass("selected");
                    xuanranChartsNews(data,series)

                }else {
                    $("#setJunNews").addClass("selected");
                    xuanranChartsNews(data,series)
                }

            }else {
                $("#containerNews").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>')
            }
        }else {
            $("#containerNews").empty().append('<div class="no_data">'
                +'<div><img src="./11/image/none_data.png" /> </div>'
                +'<p>在当前搜索条件下无数据</p>'
                +'<p>建议您放宽搜索条件进行查询！</p></div>')
        }
    }
}

// 05日线 周线 月线...
function searchClickBaselineNews(obj) {
    var baseVal = $(obj).attr("baseVal") ;
    var baseName = $(obj).text();
    if($("#selected_news>li").length == 0){
        $(obj).parent('.baseline_dropdown').hide();
        return false;
    }else {
        var videoAttr = $("#doSearchBtn").attr("video");
        var newsAttr = $("#doSearchBtn").attr("news");
        var radicalAttr = $("#doSearchBtn").attr("radical");
        if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
            $(obj).addClass("cur").siblings().removeClass("cur");
            $(obj).parent().siblings('button').text(baseName);
            $(obj).parent().siblings('button').attr({ "baseVal" : baseVal});
            $(obj).parent('.baseline_dropdown').hide();

            lastCheckBaseLine =  $(obj).attr("baseVal");
            lastCheckBaseLineText =  $(obj).text();
            if($("#mouseLinkMove").hasClass("selected")){
                isMouseLink()
            }else {
                getdataNews();
            }
        }

    }
}

/* 【00发起ajax请求 获取数据 】----Radical--------------------------------------------------------------------  */
function getdataRadical() {
    $("#selected_radical").find("li").removeClass("cured cur"); // 平台 还原
    $("#setJunRadical").removeClass('selected');  // 平均 不选

    // var programId = [];
    // var programName = [];
    // $("#programInput > .program_name > input").each(function(){
    //     var valEach = $(this).val();
    //     var valEachName = $(this).attr("name");
    //     var valEachId = $(this).attr("id");
    //     programName.push(valEachName);
    //     programId.push(valEachId)
    // });
    // //获取 平台 name id
    // var radicalId = [];
    // var radicalName = [];
    // $("#radical .selected").each(function(){
    //     var valEach = $(this).text();
    //     var valEachId = $(this).attr("data");
    //     radicalName.push(valEach);
    //     radicalId.push(valEachId);
    // });

    var time = '7天';
    var baseLine = 'day';
    if($("#mouseLinkMove").hasClass("selected")){
        time = lastCheckTime;
        baseLine =lastCheckBaseLine;
        var mouseLink = '1'
    }else {
        time = $("#selectedTime_radical > span.selected").text();
        if(time){
            time = $("#selectedTime_radical > span.selected").text();
        }else {
            var timeCustom = $("#date_radical>a>.startTimeAndEndTime").text();
            time = timeCustom.slice(3);
        }
        baseLine = $("#baseline_radical>button").attr("baseVal");
        var mouseLink = '0';
        mouseLinked = 'no';
    }

    var parm = {programId: programIdArr.join(","), programName: programValArr.join(","), radicalPlatId: radicalPlatId.join(","),radicalPlatName:radicalPlatName.join(","),radicalTime: time,baseline: baseLine,mouseLink:mouseLink};
    console.log(parm);
    // var defer = $.Deferred();
    // $.ajax({
    //     //async: false,
    //     type: "POST",
    //     url: 'programTrendAnalysis/getIndexCount',
    //     data: JSON.stringify(parm),
    //     contentType: "application/json",
    //     dataType: "json",
    //     beforeSend: function () {
    //         $("#containerRadical").empty().append('<div class="loadingImg" ><img style="padding-top:150px" src="./common/image/loading.gif"></div>');
    //         $("#doSearchBtn").attr("radical",'pending');
    //         //$("#loading_news").show();
    //     },
    //     success: function (data) {

    var data = {
        categories:['2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07', '2018-10-08', '2018-10-09', '2018-10-10'],
        "series":{
            "新浪微博指数":[{
                name: '长盛天歌01',
                data: [0, 0, 0, 301, 401, 501, 1010],
                jun:'0',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'111',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }],
            "百度指数":[{
                name: '长盛天歌02',
                data: [01, 101, 201, 301, 401, 501, 101],
                jun:'222',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'222',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }],
            "微信指数":[{
                name: '长盛天歌03',
                data: [01, 101, 201, 301, 401, 501, 101],
                jun:'333',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }, {
                name: '如懿传',
                data: [21, 201, 301, 401, 501, 601, 701],
                jun:'333',
                percent:[21, 201, 301, 401, 501, 601, 701],
                upDown:['down','down','up','equal','equal','up','up']
            }]
        }};


            // /* 拿到数据后：先处理——两步走*/
            // /*第一步 先排序 按照视频平台：的显示顺序 与先后选择无关 -------11111111111111111----------------------------*/
            // 后台已经排序好，暂不需要排序

            // /*第二步 加属性：marker{symbol:circle} color:"#CC9999" ----------2222222222222222222---------------------*/
            var series =[];
            var dataCur = data['series'];
            var tab = [];
            // 021 加marker
            var w= 0;
            for(var key in dataCur){
                series = series.concat(dataCur[key]);
                for(var v = 0;v < programValArr.length;v++){ //   v=01234,    programValArr.length=1 2 3 4 5最多五个节目
                    if(dataCur[key] == ''){
                        //console.log('没有')
                    }else {
                        var dataCurList = dataCur[key][v];
                        if (typeof(dataCurList) !== "undefined"){
                            dataCur[key][v].marker={};
                            dataCur[key][v].marker.symbol=symbol[w];
                        }
                    }
                }
                w++;// 1 2 3 4 5
                tab  += '<li onclick="setChartsXaisRadical(this)"> <span class="cls'+w+'"></span>'+key+' </li>';
                $("#selected_radical").empty().append(tab);
            }

            if(series.length > 0){
                // 022 加color
                for(var r=0;r<series.length;r++){
                    series[r].color=colors[r];
                }
                resultsDataRadical = data;
                analysisRadical();

            }else {
                resultsDataRadical = [];
                chartRadical = null;
                $("#containerRadical").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>');
                $("#loading_radical").hide()
            }
    //         defer.resolve(data)
    //     },
    //     complete: function () {
    //         $("#doSearchBtn").attr("radical",'done');//成果失败都会触发  defer将之延后提示
    //     },
    //     error:function(XMLHttpRequest, textStatus, errorThrown){
    //         console.log(textStatus);
    //     }
    // });
    // return defer;
}
// 01 设置图表setChartsOptions
// 02 渲染图表
function analysisRadical() {
    var data = resultsDataRadical;
    if(data == ''){
        return false;
    }else {
        // 设置图形数据
        var series =[];
        var dataCur = data['series'];
        for(key in dataCur){
            series = series.concat(dataCur[key]);
        }
        xuanranChartsRadical(data,series)
    }
}

function xuanranChartsRadical(data,series) {
    var options = setChartsOptions();
    var xAxisTime = data['categories'];
    if(xAxisTime.length >= 20){
        var num = Math.round(xAxisTime.length/10)
        options.xAxis.tickInterval = num;
    }
    options.chart.renderTo = 'containerRadical';
    options.credits.text = '平台指数分析-击壤大数据';
    //options.xAxis.categories = data['categories'];
    options.xAxis.max = xAxisTime.length-1;
    options.xAxis.maxRange = xAxisTime.length-1;
    options.xAxis.maxPadding = xAxisTime.length-1;
    options.xAxis.labels.formatter = function () {return xAxisTime[this.value]};
    options.yAxis.labels.formatter = function () {return this.value + '条'};
    options.series = series;

    // 是否显示均线 增加平均线
    if($("#setJunRadical").hasClass("selected")){
        //有均线的提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //有均线显示数据
            var contentJun = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {

                //获取百分比
                var percentArr = this.points[i].series.userOptions.percent;
                var percent_;
                if(percentArr instanceof  Array) percent_ = percentArr[index];

                //获取upDown
                var upDownArr = this.points[i].series.userOptions.upDown;
                var upDown_;
                if(upDownArr instanceof  Array) upDown_ =upDownArr[index];
                var bgImg = '';
                if(upDown_ == 'up'){
                    bgImg = '<span style="background:url(./11/image/up.png) left no-repeat; "></span>'
                }else if(upDown_ == 'down'){
                    bgImg = '<span style="background:url(./11/image/down.png) left no-repeat; "></span>';
                    percent_ = '-'+percent_
                }else if(upDown_ == 'equal') {
                    bgImg = '<span>—</span>';
                }else {
                    bgImg = '<span>--</span>';
                }
                //获取平均值
                var jun_ = this.points[i].series.userOptions.jun;

                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                contentJun += '<div class="toolTip">'
                    + '<span>' +bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>'+ bgImg + this.points[i].y +'</span>'
                    + '<span>'+jun_+'</span>' //平均值
                    + '<span>'+percent_+'%</span></div>'; // 升降百分比
            }
            return contentJun;
        }
        //获取plotLines
        var plotLinesCur = [];
        for( var j = 0;j<series.length ;j++){
            var colorName = series[j].color;
            var idName = 'id'+colorName.slice(1);
            plotLinesCur = plotLinesCur.concat({color:series[j].color, value:series[j].jun,width:1,dashStyle:'longdashdot',className:idName,zIndex:3})
        }
        options.yAxis.plotLines = plotLinesCur;
        chartRadical = new Highcharts.Chart(options);
        //判断隐藏的节目 均线也隐藏
        var lengthS = chartRadical.series.length;
        for(var i=0;i<lengthS;i++){
            if(chartRadical.series[i].visible){//true
            }else {
                chartRadical.userOptions.yAxis.plotLines[i] = {};
                $("#containerRadical .highcharts-plot-lines-3 .highcharts-plot-line").eq(i).hide()
            }
        }
    }else {
        //无均线提示
        options.tooltip.formatter = function () {
            var index = this.x;
            //获取日期
            var xCategories = xAxisTime[index];
            var weekDayNum = new Date(xCategories).getDay();
            var weekDay;
            if(weekDayNum == 0){
                weekDay = '  星期天'
            }else if(weekDayNum == 1){
                weekDay = '  星期一'
            }else if(weekDayNum == 2){
                weekDay = '  星期二'
            }else if(weekDayNum == 3){
                weekDay = '  星期三'
            }else if(weekDayNum == 4){
                weekDay = '  星期四'
            }else if(weekDayNum == 5){
                weekDay = '  星期五'
            }else if(weekDayNum == 6){
                weekDay = '  星期六'
            }

            //没有均线显示数据
            var content = '<h3>' + xCategories + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
            for (var i = 0; i < this.points.length; i++) {
                //获取图形形状symbol'circle','square','diamond','triangle-down','triangle'
                var thisSymbol = this.points[i].series.symbol;
                var bgimgSymbol='';
                if(thisSymbol=='circle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='square'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='diamond'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="background-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle-down'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-top-color: ' + this.points[i].series.color + '"></span></span>';
                }else if(thisSymbol=='triangle'){
                    bgimgSymbol='<span class="bgBox ' + thisSymbol + ' ">' +
                        '<span class="bgLine" style="background-color: ' + this.points[i].series.color + '"></span>' +
                        '<span class="bgSymbol" style="border-bottom-color: ' + this.points[i].series.color + '"></span></span>';
                }
                //'<span style="color: '+ this.points[i].series.color + '">\u25CF</span> '
                content += '<div class="toolTip" id="toolTop1">'
                    + '<span>' + bgimgSymbol + this.points[i].series.name + '</span>'
                    + '<span>' + this.points[i].y +'</span></div>';

                //content += '<span style="color: ' + this.points[i].series.color + '">' + this.points[i].series.name + '</span>: ' + this.points[i].y + '<br/>';
            }
            return content;
        }
        chartRadical = new Highcharts.Chart(options);
    }
}

// 03left 点击平台  改变横坐标事件  每次加减五组数据  操作数据-不去后台请求
function setChartsXaisRadical(obj) {
    var data = resultsDataRadical;
    console.log(data)
    // 设置图形数据
    var series =[];
    var dataCur = data['series'];

    //根据是否有cured 加载对应数据
    if($(obj).hasClass("cured")){
        $(obj).removeClass("cured");

        var str = $("#selected_radical>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, ""); // 去除两头空格
        var curArr = arr.split('  ');

        for(var i = 0;i<curArr.length;i++ ){
            var name = curArr[i];
            if(name){
                series = series.concat(dataCur[name]);
            }else {
                console.log("name=空 不会走")
            }
        }
    }else {
        $(obj).addClass("cured");

        var str = $("#selected_radical>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, "");
        var curArr = arr.split('  ');

        for(var i = 0;i<curArr.length;i++ ){
            var name = curArr[i];
            if(name){
                series = series.concat(dataCur[name]);
            }else {
                $("#containerRadical").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>');
            }
        }
    }

    if(series != ''){
        xuanranChartsRadical(data,series)
    }else {
        $("#containerRadical").empty().append('<div class="no_data">'
            +'<div><img src="./11/image/none_data.png" /> </div>'
            +'<p>在当前搜索条件下无数据</p>'
            +'<p>建议您放宽搜索条件进行查询！</p></div>')
    }
}

// 04点击均 显示平均线
function setJunRadical() {
    if($("#selected_radical>li").length == 0){
        return false;
    }else {

        var data = resultsDataRadical;

        // 设置图形数据
        var series =[];
        var dataCur = data['series'];

        var str = $("#selected_radical>li").not(".cured").text();
        var arr = str.replace(/(^\s*)|(\s*$)/g, "");
        var curArr = arr.split('  ');

        if(curArr.length >= 1){
            //获取series
            if(typeof(dataCur) != "undefined"){
                for(var i = 0;i<curArr.length;i++ ) {
                    var name = curArr[i];
                    series = series.concat(dataCur[name]);
                }
            }
            if(series != ''){
                // 是否显示均线 增加平均线
                if( $("#setJunRadical").hasClass('selected') ){
                    $("#setJunRadical").removeClass("selected");
                    xuanranChartsRadical(data,series)
                }else {
                    $("#setJunRadical").addClass("selected");
                    xuanranChartsRadical(data,series)
                }

            }else {
                $("#containerRadical").empty().append('<div class="no_data">'
                    +'<div><img src="./11/image/none_data.png" /> </div>'
                    +'<p>在当前搜索条件下无数据</p>'
                    +'<p>建议您放宽搜索条件进行查询！</p></div>')
            }
        }else {
            $("#containerRadical").empty().append('<div class="no_data">'
                +'<div><img src="./11/image/none_data.png" /> </div>'
                +'<p>在当前搜索条件下无数据</p>'
                +'<p>建议您放宽搜索条件进行查询！</p></div>')
        }
    }
}

// 05日线 周线 月线...
function searchClickBaselineRadical(obj) {
    var baseVal = $(obj).attr("baseVal") ;
    var baseName = $(obj).text();
    if($("#selected_radical>li").length == 0){
        $(obj).parent('.baseline_dropdown').hide();
        return false;
    }else {

        var videoAttr = $("#doSearchBtn").attr("video");
        var newsAttr = $("#doSearchBtn").attr("news");
        var radicalAttr = $("#doSearchBtn").attr("radical");
        if(videoAttr =='done' && newsAttr =='done' && radicalAttr =='done') { //必须所有请求完成 才可以发起请求
            $(obj).addClass("cur").siblings().removeClass("cur");
            $(obj).parent().siblings('button').text(baseName);
            $(obj).parent().siblings('button').attr({ "baseVal" : baseVal});
            $(obj).parent('.baseline_dropdown').hide();

            lastCheckBaseLine =  $(obj).attr("baseVal");
            lastCheckBaseLineText =  $(obj).text();
            if($("#mouseLinkMove").hasClass("selected")){
                isMouseLink()
            }else {
                getdataRadical();
            }
        }
    }
}
