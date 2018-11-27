/* 时间选择处理*/

var startAndEndTimeNSRadical = (function () {
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
            eCont: "startDiv_radical",
            startDate: $("#startTime_radical").val(),
            dateFmt: "yyyy-MM-dd",
            minDate: minDate,
            maxDate: $("#endTime_radical").val(),
            onpicked: function (datePacker) {
                onStartTimeSelected(datePacker);
            }
        });

        // 结束时间
        WdatePicker({
            eCont: "endDiv_radical",
            startDate: $("#endTime_radical").val(),
            dateFmt: "yyyy-MM-dd",
            minDate: $("#startTime_radical").val(),
            maxDate: maxDate,
            onpicked: function (datePacker) {
                onEndTimeSelected(datePacker);
            }
        });

        $("#date_radical .startTimeAndEndTime").html("日期："+ $("#startTime_radical").val() +"~"+$("#endTime_radical").val());
        //console.log($("#startTime_radical").val())
        return false;
    }

    /** 开始时间选中 */
    function onStartTimeSelected(datePacker) {
        var startTime = datePacker.cal.getDateStr();
        // 1 将结束时间控件中【比开始时间早的日期】进行【置灰处理】且无法点击
        var endMaxTime = $("#maxStartTime").val();
        WdatePicker({
            eCont: 'endDiv_radical',
            dateFmt: 'yyyy-MM-dd',
            startDate: $("#endTime_radical").val(),
            minDate: '#F{\'' + startTime + '\'||$dp.$D(\'startDiv_radical\')}',
            maxDate: endMaxTime,
            onpicked: onEndTimeSelected
        });
        // 2 将【开始时间】赋值保存
        $("#startTime_radical").val(startTime);
        $("#startTimeId").val(startTime);
        // 3 回显【所选日期】
        //$("#date_radical .startTimeAndEndTime").html("日期："+ startTime +"~"+$("#endTime_radical").val());
        //$("#date s.data_error_x").show();
        // 4 让开始控件或得焦点
        $dp.$('endTime_radical').focus();
    }

    /** 结束时间选中 */
    function onEndTimeSelected(datePacker) {
        var endTime = datePacker.cal.getDateStr();
        // 1 将开始时间控件中【比结束时间晚的日期】进行【置灰处理】且无法点击
        var startMinTime = $("#minStartTime").val();
        WdatePicker({
            eCont: 'startDiv_radical',
            dateFmt: 'yyyy-MM-dd',
            startDate: $("#startTime_radical").val(),
            minDate: startMinTime,
            maxDate: '#F{\'' + endTime + '\'||$dp.$D(\'endDiv_radical\')}',
            onpicked: onStartTimeSelected
        });
        // 2 将开始时间,结束时间赋值给时间构造函数
        $("#endTime_radical").val(endTime);
        $("#endTimeId").val(endTime);
        dateSelection.status = true;
        // 3 回显【所选日期】
        //$("#date_radical .startTimeAndEndTime").html("日期：" + $("#startTime_radical").val() + "~" + endTime);
        //$("#date s.data_error_x").show();
        //if(!$(".dataPop").is(":hidden"))$(".dataPop").hide();
    }

    function okTime() {
        $("#date_radical .startTimeAndEndTime").html("日期：" + $("#startTime_radical").val() + "~" + $("#endTime_radical").val());
        var startEndTimeVal = $("#date_radical .startTimeAndEndTime").text()
        if(startEndTimeVal != null && startEndTimeVal != '' && startEndTimeVal != '请选择日期'&& startEndTimeVal != '日期：~'){
            $("#selectedTime_radical>span").removeClass("selected");
            $(this).parent(".dataPop").siblings("span").removeClass("selected");
            $("#date_radical .startTimeAndEndTime").addClass("selected");
            $(".dataPop").hide();

            var time =  $("#date_radical .startTimeAndEndTime").text();
            lastCheckTime =  time.slice(3);
            if($("#mouseLinkMove").hasClass("selected")){
                isMouseLink()
            }else {
                getdataRadical(); //查询 更新图表
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
    startAndEndTimeNSRadical.bindEvent();
    //自定义点击
    $("#customTime_radical").click(function () {
        $(".baseline_dropdown").hide();
        if($("#selected_radical li").length == 0){
            return false;
        }else {
            $(this).hide();
            $("#date_radical, #date_radical .dataPop").show();
            $("#startTime_radical ,#endTime_radical").css("width", 182);
            $("#startDiv_radical iframe,#endDiv_radical iframe").prop("width", 186);
            $("#startDiv_radical iframe,#endDiv_radical iframe").prop("height", 178);
        }
        stopPropagation()
    });
    //时间点击startTimeAndEndTime
    $("#date_radical .startTimeAndEndTime ").click(function () {
        $(".baseline_dropdown").hide();
        $('#date_radical .dataPop').show();
        stopPropagation()
    });
    //取消按钮点击
    $("#cancel_radical").click(function () {
        if($("#date_radical .startTimeAndEndTime").hasClass("selected")){
            $("#date_radical .dataPop").hide();
        }else {
            $("#customTime_radical").show();
            $("#date_radical").hide();
        }
    })
});