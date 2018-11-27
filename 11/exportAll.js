
$(function(){
    $('#exportAll').click(function (){
        var canvasAllH1=0,canvasAllH2=0,canvasAllH3=0;
        //判断为null  // 1. 获取svg
        if (!chartVideo && typeof(chartVideo)!="undefined" && chartVideo!=0){
            //alert("null");
        }else {
            var svgData1 = chartVideo.getSVG();
            canvasAllH1 = 500;
            var canvas1 = document.getElementById("canvas1");
            canvg(canvas1,svgData1); //svg 转vanvas 吧data转到canvasId里
        }

        if (!chartNews && typeof(chartNews)!="undefined" && chartNews!=0){
            //alert("null");
        }else {
            var svgData2 = chartNews.getSVG();
            canvasAllH2 = 500;
            var canvas2 = document.getElementById("canvas2");
            canvg(canvas2,svgData2); //svg 转vanvas 吧data转到canvasId里
        }
        if (!chartRadical && typeof(chartRadical)!="undefined" && chartRadical!=0){
            //alert("null");
        }else {
            var svgData3 = chartRadical.getSVG();
            canvasAllH3 = 500;
            var canvas3 = document.getElementById("canvas3");
            canvg(canvas3,svgData3); //svg 转vanvas 吧data转到canvasId里
        }

        if(typeof svgData1 == 'undefined' && typeof svgData2 =='undefined' && typeof svgData3 =='undefined'){
            return false;
        }else {

            //2. 在本地进行文件保存
            /**
             * 在本地进行文件保存
             * @param  {String} imgData     要保存到本地的图片数据
             * @param  {String} filename 文件名
             */
            var saveFile = function (data, filename) {
                var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
                save_link.href = data;
                save_link.download = filename;

                var event = document.createEvent('MouseEvents');
                event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                save_link.dispatchEvent(event);
            };

            //3. 图片导出为 png 格式
            var type = 'png';
            // 下载后的图片名
            var filename = '节目趋势分析' +  '.' + type;

            function getFullCanvasDataURL(){
                //将canvasAll画布作为基准。
                var canvasAll = document.getElementById('canvasAll');

                canvasAll.fillStyle = '#fff';
                canvasAll.width = 1200;
                canvasAll.height = canvasAllH1+canvasAllH2+canvasAllH3;
                var width = 1200;
                var height = 400;
                var ctx = canvasAll.getContext("2d");

                //遍历，将后续的画布添加到在第一个上
                $("#canvasOut").find("canvas").each(function(i,obj){
                    //视频
                    if(typeof svgData1 == 'string'){
                        if(i==0){
                            var canvasTmp = $(obj)[0];
                            //画白色背景
                            ctx.fillStyle="#fff";
                            ctx.fillRect(0,0,1200,500);
                            //图标
                            ctx.drawImage(canvasTmp,0,50,width,height);
                            //文字-水印
                            // ctx.fillStyle="#d6d6d6";
                            // ctx.font="14px Arial";
                            // ctx.fillText("视频播放量分析-击壤大数据",10,360);
                            //文字-日期
                            //文字-节目
                        }
                    }
                    // 新闻
                    if(typeof svgData2=='string'){
                        if(i==1){
                            var canvasTmp = $(obj)[0];
                            if(typeof svgData1 =='string'){
                                //画白色背景
                                ctx.fillStyle="#fff";
                                ctx.fillRect(0,500,1200,500);

                                ctx.drawImage(canvasTmp,0,550,width,height);
                                //文字-水印
                                // ctx.fillStyle="#d6d6d6";
                                // ctx.font="14px Arial";
                                // ctx.fillText("新闻统计分析-击壤大数据",10,860);
                                //文字-日期
                                //文字-节目

                            }else {
                                //画白色背景
                                ctx.fillStyle="#fff";
                                ctx.fillRect(0,0,1200,500);

                                ctx.drawImage(canvasTmp,0,50,width,height);
                                //文字-水印
                                // ctx.fillStyle="#d6d6d6";
                                // ctx.font="14px Arial";
                                // ctx.fillText("新闻统计分析-击壤大数据",10,360);
                                //文字-日期
                                //文字-节目
                            }
                        }
                    }

                    // 指数
                    if(typeof svgData3=='string'){
                        if(i==2){
                            var canvasTmp = $(obj)[0];
                            if(canvasAll.height == 1500 ){
                                //画白色背景
                                ctx.fillStyle="#fff";
                                ctx.fillRect(0,1000,1200,500);

                                ctx.drawImage(canvasTmp,0,1050,width,height);
                                //文字-水印
                                // ctx.fillStyle="#d6d6d6";
                                // ctx.font="14px Arial";
                                // ctx.fillText("平台指数分析-击壤大数据",10,1360);
                                //文字-日期
                                //文字-节目
                            }else if(canvasAll.height == 1000){
                                //画白色背景
                                ctx.fillStyle="#fff";
                                ctx.fillRect(0,500,1200,500);

                                ctx.drawImage(canvasTmp,0,550,width,height);
                                //文字-水印
                                // ctx.fillStyle="#d6d6d6";
                                // ctx.font="14px Arial";
                                // ctx.fillText("平台指数分析-击壤大数据",10,860);
                                //文字-日期
                                //文字-节目
                            }else {
                                //画白色背景
                                ctx.fillStyle="#fff";
                                ctx.fillRect(0,0,1200,500);

                                ctx.drawImage(canvasTmp,0,50,width,height);
                                //文字-水印
                                // ctx.fillStyle="#d6d6d6";
                                // ctx.font="14px Arial";
                                // ctx.fillText("平台指数分析-击壤大数据",10,360);
                                //文字-日期
                                //文字-节目
                            }
                        }
                    }
                });
                return canvasAll.toDataURL(type);
            }
            var base64img = getFullCanvasDataURL()
            saveFile(base64img, filename)
        }
    })
})
