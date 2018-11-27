/* 时间选择处理*/

var startAndEndTimeNSNews = (function () {
    // //////////////////////////////////////////////////////////////////////////
    // 模型层
    // //////////////////////////////////////////////////////////////////////////
    var dateSelection ={
        startTime: "",
        endTime: "",
        status: ""
    };
    function getSelection() {
        dateSelection.startTime=$("#startTimeId").val();
        dateSelection.endTime=$("#endTimeId").val();
        dateSelection.status=true;
        if(dateSelection.startTime=="" ||dateSelection.endTime==""){
            dateSelection.status=false;
        }
        return dateSelection;
    }

    // //////////////////////////////////////////////////////////////////////////
    // 视图层
    // //////////////////////////////////////////////////////////////////////////
    function bindEvent() {
        onTimeTabClick();
    }

    // //////////////////////////////////////////////////////////////////////////
    // 交互层
    // //////////////////////////////////////////////////////////////////////////

    /**
     * 配置 “时间条件过滤器”入口
     */
    function onTimeTabClick() {
        var minDate = $("#minStartTime").val(),
            minDate = minDate != 'null' ? minDate : '',
            maxDate = $("#maxStartTime").val();
        // 开始时间
        WdatePicker({
            eCont: "startDiv_news",
            startDate: $("#startTime_news").val(),
            dateFmt: "yyyy-MM-dd",
            minDate: minDate,
            maxDate: $("#endTime_news").val(),
            onpicked: function (datePacker) {
                onStartTimeSelected(datePacker);
            }
        });

        // 结束时间
        WdatePicker({
            eCont: "endDiv_news",
            startDate: $("#endTime_news").val(),
            dateFmt: "yyyy-MM-dd",
            minDate: $("#startTime_news").val(),
            maxDate: maxDate,
            onpicked: function (datePacker) {
                onEndTimeSelected(datePacker);
            }
        });

        $("#date_news .startTimeAndEndTime").html("日期："+ $("#startTime_news").val() +"~"+$("#endTime_news").val());
        //console.log($("#startTime_news").val())
        return false;
    }

    /** 开始时间选中 */
    function onStartTimeSelected(datePacker) {
        var startTime = datePacker.cal.getDateStr();
        // 1 将结束时间控件中【比开始时间早的日期】进行【置灰处理】且无法点击
        var endMaxTime = $("#maxStartTime").val();
        WdatePicker({
            eCont: 'endDiv_news',
            dateFmt: 'yyyy-MM-dd',
            startDate: $("#endTime_news").val(),
            minDate: '#F{\'' + startTime + '\'||$dp.$D(\'startDiv_news\')}',
            maxDate: endMaxTime,
            onpicked: onEndTimeSelected
        });
        // 2 将【开始时间】赋值保存
        $("#startTime_news").val(startTime);
        $("#startTimeId").val(startTime);
        // 3 回显【所选日期】
        //$("#date_news .startTimeAndEndTime").html("日期："+ startTime +"~"+$("#endTime_news").val());
        //$("#date s.data_error_x").show();
        // 4 让开始控件或得焦点
        $dp.$('endTime_news').focus();
    }

    /** 结束时间选中 */
    function onEndTimeSelected(datePacker) {
        var endTime = datePacker.cal.getDateStr();
        // 1 将开始时间控件中【比结束时间晚的日期】进行【置灰处理】且无法点击
        var startMinTime = $("#minStartTime").val();
        WdatePicker({
            eCont: 'startDiv_news',
            dateFmt: 'yyyy-MM-dd',
            startDate: $("#startTime_news").val(),
            minDate: startMinTime,
            maxDate: '#F{\'' + endTime + '\'||$dp.$D(\'endDiv_news\')}',
            onpicked: onStartTimeSelected
        });
        // 2 将开始时间,结束时间赋值给时间构造函数
        $("#endTime_news").val(endTime);
        $("#endTimeId").val(endTime);
        dateSelection.status = true;
        // 3 回显【所选日期】
        //$("#date_news .startTimeAndEndTime").html("日期：" + $("#startTime_news").val() + "~" + endTime);
        //$("#date s.data_error_x").show();
        //if(!$(".dataPop").is(":hidden"))$(".dataPop").hide();
    }


    function okTime() {
        $("#date_news .startTimeAndEndTime").html("日期：" + $("#startTime_news").val() + "~" + $("#endTime_news").val());
        var startEndTimeVal = $("#date_news .startTimeAndEndTime").text()
        if(startEndTimeVal != null && startEndTimeVal != '' && startEndTimeVal != '请选择日期'&& startEndTimeVal != '日期：~'){
            $("#selectedTime_news>span").removeClass("selected");
            $("#biao_news").removeClass("selected");//表
            $("#biao_table_news").hide();
            $("#setJunNews").removeClass("selected");//均

            $(this).parent(".dataPop").siblings("span").removeClass("selected");
            $("#date_news .startTimeAndEndTime").addClass("selected");
            $(".dataPop").hide();

            var time =  $("#date_news .startTimeAndEndTime").text();
            lastCheckTime =  time.slice(3);
            if($("#mouseLinkMove").hasClass("selected")){
                isMouseLink()
            }else {
                getdataNews(); //查询 更新图表
            }
        }else {
            return false;
        }
    }


    return {
        bindEvent: bindEvent,
        getTimeSelection: getSelection,
        okTime: okTime
    };
}());

/**
 * 日期控件显示隐藏功能，加点击事件
 */
$(function () {
    startAndEndTimeNSNews.bindEvent();
    //自定义点击
    $("#customTime_news").click(function () {
        $(".baseline_dropdown").hide();
        if($("#selected_news li").length == 0){
            return false;
        }else {
            $(this).hide();
            $("#date_news, #date_news .dataPop").show();
            $("#startTime_news ,#endTime_news").css("width", 182);
            $("#startDiv_news iframe,#endDiv_news iframe").prop("width", 186);
            $("#startDiv_news iframe,#endDiv_news iframe").prop("height", 178);
        }
        stopPropagation()
    });
    //时间点击startTimeAndEndTime
    $("#date_news .startTimeAndEndTime ").click(function () {
        $(".baseline_dropdown").hide();
        $('#date_news .dataPop').show();
        stopPropagation()
    });
    //取消按钮点击
    $("#cancel_news").click(function () {
        if($("#date_news .startTimeAndEndTime").hasClass("selected")){
            $("#date_news .dataPop").hide();
        }else {
            $("#customTime_news").show();
            $("#date_news").hide();
        }
    })
});