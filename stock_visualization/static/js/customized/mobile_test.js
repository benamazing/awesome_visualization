$(document).ready(function(){

 // 基于准备好的dom，初始化echarts图表
    var myChart = echarts.init(document.getElementById('showBar'));
     myChart.showLoading({
        text: 'Loding'
    });


    var option = {
        tooltip: {
            show: true
        },
        legend: {
            data:['Amount','Cost']
        },
        xAxis : [
            {
                type : 'category',
                data : ['a', 'b']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                "name":"Amount",
                "type":"bar",
                "data":[1, 2]
            },
             {
                "name":"Cost",
                "type":"bar",
                "data":[2, 3]
            }
        ]
    };
    // 为echarts对象加载数据
    myChart.setOption(option);
    myChart.hideLoading();
       resize();
     window.onresize = function(){
       resize();
    }
    function resize(){
        var height = document.documentElement.clientHeight - 50 + 'px';
        var width = document.documentElement.clientWidth + 'px';
        $('#content').height(height).width(width);
        $('.show').height(document.documentElement.clientHeight - 65 + 'px').width(width);
        myChart && myChart.resize();
    }
});