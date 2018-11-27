var symbol = ['circle','square','diamond','triangle-down','triangle'];
var colors = ['#CC9999','#69bcc0','#c32bff','#cc0000','#ffff00','#cc6600','#047acd','#cccc33','#ff0033','#009933','#ff6666','#cc6633','#ffcc99','#cc0066','#009999','#ffcc33','#ff6666','#006699','#339933','#ff9900','#99cccc','#990066','#ffcc00','#009999','#99cc00'];

$(function() {
    // for(var i=0;i<=colors.length;i++){
    //     var liDiv = '<li style="width: 100%;height: 50px;background: '+colors[i]+';margin: 0 auto"></li>'
    //     $("#containerVideo").append(liDiv);
    // }

    // 第一次进入显示情况
    var len = $("#programInput .program_name").length;
    if(len < 5){
        $("#addName").show();
    }else {
        $("#addName").hide();
    }
    $("#programInput").on("mouseover mouseout",".program_name", function(event) {
        if(event.type == "mouseover"){
            $(this).children("img").show();
        }else if(event.type == "mouseout"){
            $(this).children("img").hide();
        }
    });

    //点击 平台 选中效果 --------------------
    $(".selectPlat").click(function(){
        var this_ = $(this)
        var len_selected = this_.parent().children(".selected").length;
        if(len_selected <=4 ){
            if( this_.hasClass('selected') ){
                this_.removeClass("selected");
            }else {
                this_.addClass("selected");
            }
        }else if(len_selected == 5) {
            this_.removeClass("selected");
        }
    });

    // 查看更多setingSee
    $("#setingSee").click(function(){
        var this_ = $(this)
        if( this_.hasClass('selected') ){
            this_.removeClass('selected');
            $(".list_selection").css({"height": "auto"});
            $("#setingSee").css({"transform": "rotate(0deg)"});
            $("#setingSee .moreSee").addClass("gray");
        }else{
            this_.addClass('selected');
            $(".list_selection").css({"height": "52px"});
            $("#setingSee").css({"transform": "rotate(180deg)"});
            $("#setingSee .moreSee").removeClass("gray");
        }
    });
});

// 点击 隐藏or展示 container
function container(obj) {
    if( $(obj).hasClass('gray') ){
        $(obj).removeClass("gray").css({"transform": "rotate(180deg)"});
        $(obj).parent().css({"border-color": "#009b0e"});
        $(obj).parent().parent().parent(".greenLine").siblings(".container").css({"display": "none"});
    }else {
        $(obj).addClass("gray").css({"transform": "rotate(0deg)"});
        $(obj).parent().css({"border-color": "#a6a6a6"});
        $(obj).parent().parent().parent(".greenLine").siblings(".container").css({"display": "block"});
    }
}

// onkeyup 键盘抬起 节目输入框
var timer = null;
function searchProgram(obj,event) {
    timer = new Date().getTime();
    var inputName = $.trim($(obj).val()),keyCode = event.keyCode;   //8 backSpace键 40下 38向上   13回车  37 = Left 39 = Right   32空格
    if (inputName == "" || keyCode == 13 || keyCode == 40 || keyCode == 38 || keyCode == 37|| keyCode == 39 || keyCode == 16 || keyCode == 17 ) {
        return false;
    }
    $(obj).siblings('#programUl').show().empty().append('<div class="loadingImg"><img style="height: 40px;margin: 0 auto" src="./common/image/loading.gif"></div>');
    setTimeout(function(){
        if(new Date().getTime()-timer >= 1000){
            doAjaxSearch(obj,event);
        }
    }, 1000);
}
function doAjaxSearch(obj) {
    var inputName = $.trim($(obj).val())
    var checkProgramId = [];
    $("#programInput > .program_name > input").each(function(){
        var valEachId = $(this).attr("id");
        if(typeof(valEachId) !== "undefined" ){
            checkProgramId.push(valEachId)
        }
    });
    var parm = {programName: inputName,checkProgramId:checkProgramId.join(',')};
    $.ajax({
        async: true,
        type: "POST",
        url: 'programTrendAnalysis/getProgramMainList',
        data:JSON.stringify(parm),
        contentType:"application/json",
        dataType: "json",
        success: function (data) {
            var tab = "";
            if(data==''){
                tab = '<div align="center">暂无数据<div>'
            }else {
                for (var i = 0; i < data.length; i++) {
                    tab += '<li onclick="searchClickProgram(this);" programid = ' +data[i].programId + ' >' + data[i].programName + '</li>';
                }
            }
            $(obj).siblings('#programUl').show().empty().html(tab);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(data)
        }
    });
}

// li选择节目
function searchClickProgram(obj) {
    var programId = $(obj).attr("programid") ;
    var programName = $(obj).text();
    $(obj).parent().siblings('input').val(programName);
    $(obj).parent().siblings('input').attr({ "id" : programId, "name" : programName});
    $(obj).parent().siblings('input').removeClass("erro");
    $(obj).parent('#programUl').hide();
}

// 01设置图表  视频播放量分析、新闻统计分析、平台指数分析 公用
function setChartsOptions(options) {
    // 加载图片的显示
    //$("#containerVideo").html('<div style="text-align: center;padding-top: 130px;"><img style="display: inline-block;" src="http://localhost:8080/ada/common/image/loading.gif"></div>');

    // 2.1横坐标 charts_x = 0 1 2 3 4  最大5*5
    var xAxisSetting = {
        //enabled: false,
        // //categories:['2018-10-04', '2018-10-05', '2018-10-06', '2018-10-07', '2018-10-08', '2018-10-09', '2018-10-10'], //['7天前', '6天前', '5天前', '4天前', '3天前', '2天前', '1天前',]
        // //categories:[],

        lineWidth: 1,//X坐标轴
        lineColor:'#ccc',
        tickWidth: 1,//刻度线
        tickColor: '#ccd6eb',
        tickLength:5,
        tickmarkPlacement: "on", // 标记(文字)显示的位置，on表示在正对位置上。

        gridLineWidth: 1, // 纵向格线的的大小
        gridLineColor: '#fbfbfb', // 纵向格线的颜色
        gridLineDashStyle: 'solid', // 纵向格栅线条的类型
        showFirstLabel: true, // 第一个标记的数值是否显示
        showLastLabel: true,

        labels: {//坐标轴标签，即在刻度位置显示对应的数值、名字或格式化后的内容。
            rotation: 0,
            align: 'center',
            x: 0,
            y: 15,
            // formatter: function() {
            //     return categories[this.value];
            // }
        },
        min:0,
        minRange:0,
        minPadding:0,
    };

    // 2.2纵坐标轴设置
    var yAxisSetting = {

        allowDecimals: false,//不允许小数 即显示为整数
        min: 0,
        title: {
            text: ''//视频播放总量
        },
        lineWidth: 0,
        lineColor:'#ccc',
        labels: {
            //enabled:false,
            overflow:false,
            animation: false,
            zIndex:1,
            align: 'left',
            x: 1,
            y: -2,
            style:{
                //color: "#047acd",
                cursor: "default",
                fontSize: "11px",
                whiteSpace: 'nowrap',//阻止换行
                textOverflow: 'none',//超出隐藏
            },
            formatter: function () {
                return this.value + '次';
            }
        },
        showFirstLabel: false, // 第一个标记的数值是否显示
        minPadding:0,
        startOnTick:false,
    };

    // 2.3图形设置 数据点选项
    var plotOption = {
        series: {
            duration: 1000,
            //animation: false,
            events: {
                legendItemClick: function(e) {
                    /*
                     * 默认实现是显示或隐藏当前数据列，e 代表事件， this 为当前数据列
                     */
                    // return false 即可禁止图例点击响应
                    var index = this.index;
                    var series = this.chart.series;

                    var plotLinesThis = this.yAxis.userOptions.plotLines;

                    if(typeof(plotLinesThis)!=="undefined"){
                        var renderToId =this.chart.userOptions.chart.renderTo;

                        var jun = this.userOptions.jun;
                        var colorName = this.color;
                        var idName = 'id'+colorName.slice(1);

                        if(series[index].visible){//可见
                            series[index].yAxis.userOptions.plotLines[index] = {}
                        }else {//不可见
                            series[index].yAxis.userOptions.plotLines[index] = {color: colorName, value: jun, width: 1, dashStyle: "longdashdot", className: idName}
                            //$(".highcharts-plot-line").eq(index).show();
                        }

                        $("#"+renderToId+" ."+idName).hide();
                        if(series[index].visible){//可见
                            $("#"+renderToId+" ."+idName).hide();
                        }else {//不可见
                            $("#"+renderToId+" ."+idName).show();
                        }
                    }

                    return true;
                }
            }
        },
        spline: {
            marker: {
                radius: 3,
                lineColor: '',
                lineWidth: 1
            }
        },

    };

    // 2.4提示设置
    var toolTip = {
        shared: true,
        useHTML:true,
        followTouchMove:false,
        crosshairs:{
            width: 1,
            color: "#a3a3b5",
            dashStyle: 'solid',
            //zIndex: 100
        },
        backgroundColor: '#4d4d4d',   // 背景颜色
        borderColor: '#4d4d4d',         // 边框颜色
        borderRadius: 0,             // 边框圆角
        borderWidth: 1,               // 边框宽度
        shadow: false,                 // 是否显示阴影
        animation: true,               // 是否启用动画效果
        style: {                      // 文字内容相关样式
            color: "#fff",
            fontSize: "12px",
            fontWeight: "blod",
            fontFamily: "Courir new"
        },

        formatter : function (){ // 提示框格式化字符串
            //console.log(this)

            var index = this.points[0].point.index;
            //获取日期
            var xCategories = this.x;
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
            var content = '<h3>' + this.x + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
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

            //有均线显示数据
            var contentJun = '<h3>' + this.x + '<span style="padding-left: 5px;">'+ weekDay +'</span></h3>';
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
            return content;
        },
    };

    // 2.5highChat的设置
    var options = {
        //marginRight: 10,
        chart: {
            type: 'spline',
            renderTo: '' //containerVideo
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        credits: {   // 显示版权信息
            enabled:true,
            text:'击壤大数据',
            href:'',
            position:{          // 位置设置
                align: 'left',
                x: 11,
                verticalAlign: 'bottom',
                y: -100
            },
            style: {            // 样式设置
                //cursor: 'pointer',
                color: '#d6d6d6',
                fontSize: '14px'
            }
        },
        noData: {
            style: {
                fontWeight: 'bold',
                fontSize: '15px',
                color: '#303030'
            }
        },
        legend: { //图例
            labelFormatter: function() {
                return '<span style="">'+this.name+'</span>'
            },
        },
        exporting: {
            //enabled: false  // 关闭导出按钮
            allowHTML:true,
            title:'导出',
            scale:1,
            buttons: {
                contextButton: {
                    height:25,
                    width: 27,
                    symbolSize: 26,
                    symbol: 'url(../11/image/exportgreen2.png)',
                    // 自定义导出菜单项目及顺序
                    menuItems: [
                        {
                            text: '下载PNG文件',
                            onclick: function () {
                                var creditsTextStr = this.credits.textStr;
                                var indexofNum = creditsTextStr.indexOf("-");
                                var filenameStr = creditsTextStr.slice(0,indexofNum);
                                this.exportChart({
                                    type: 'image/png',
                                    filename: filenameStr,
                                    width:1000,
                                    height:500,
                                    sourceWidth: 1000,
                                    sourceHeight: 400,
                                });
                            }
                        },
                        {
                            text: '下载JPEG文件',
                            onclick: function() {
                                var creditsTextStr = this.credits.textStr;
                                var indexofNum = creditsTextStr.indexOf("-");
                                var filenameStr = creditsTextStr.slice(0,indexofNum);
                                this.exportChart({
                                    type: 'image/jpeg',
                                    filename: filenameStr
                                });
                            }
                        }
                    ]
                }
            }
        },
        navigation: {
            buttonOptions: {
                //enabled: false, // 关闭导出按钮，效果同上
                height:26,
                width: 26,
                symbolSize: 26,
                symbolFill:"#000",
                background: '#f8f8f8',
                //symbolStrokeWidth: 2,
                verticalAlign: 'top',
                symbolX: 26,
                symbolY: 26,
                y: -95,
                x: -19,
                theme: {
                    r: 4,
                    states: {
                        hover: {
                            stroke: '#f8f8f8',
                            fill: '#f8f8f8'
                        },
                        select: {
                            stroke: '#f8f8f8',
                            fill: '#f8f8f8'
                        }
                    }
                }
            },
            menuItemHoverStyle: {
                //fontWeight: 'bold',
                background: 'green',
            }
        },

        xAxis: xAxisSetting,
        yAxis: yAxisSetting,
        tooltip: toolTip,
        plotOptions: plotOption,
        series: [],
    };

    return options
}// 01设置图表  视频播放量分析、新闻统计分析、平台指数分析 公用

// 基线选择
function baseLineShow(obj) {
    $(obj).siblings('.baseline_dropdown').show();
    if($("#date_video>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_video>.dataPop").hide();
    }else {
        $("#date_video").hide();
        $("#customTime_video").show()
    }
    if($("#date_news>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_news>.dataPop").hide();
    }else {
        $("#date_news").hide();
        $("#customTime_news").show()
    }
    if($("#date_radical>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_radical>.dataPop").hide();
    }else {
        $("#date_radical").hide();
        $("#customTime_radical").show()
    }
    stopPropagation()
}
// 阻止冒泡 默认事件
function stopPropagation(e) {
    var ev = e || window.event;
    if (ev.stopPropagation) {
        ev.stopPropagation();
    }
    else if (window.event) {
        window.event.cancelBubble = true;//兼容IE
    }
}
$(document).bind('click', function () {
    $(".baseline_dropdown").hide();
    if($("#date_video>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_video>.dataPop").hide();
    }else {
        $("#date_video").hide();
        $("#customTime_video").show()
    }
    if($("#date_news>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_news>.dataPop").hide();
    }else {
        $("#date_news").hide();
        $("#customTime_news").show()
    }
    if($("#date_radical>a>span.startTimeAndEndTime").hasClass("selected")){
        $("#date_radical>.dataPop").hide();
    }else {
        $("#date_radical").hide();
        $("#customTime_radical").show()
    }
});
