$(document).ready(function(){

    $('#date_from').datepicker(option={"dateFormat": "yy-mm-dd"});
    $('#date_to').datepicker(option={"dateFormat": "yy-mm-dd"});
    $('#stock_code').autocomplete({
        source: '/stock_list.json',
        minLength: 3
    });


    // render pie chart
    var stock_pie = echarts.init(document.getElementById('stock_pie'));
    stock_pie.showLoading();
    var pie_option = {
        title : {
            text: 'Asset Distribution',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: []
        },
        series : [
            {
                name: 'Market Value',
                type: 'pie',
                radius : '70%',
                center: ['50%', '60%'],
                data:[],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    $.getJSON('/current_hold_stocks.json', function(result){
        stock_pie.hideLoading();
        for (i = 0; i < result.length; i++) {
            pie_option.legend.data[i] = result[i].stock_name + ' - ' + result[i].stock_code;
            pie_option.series[0].data[i] = {
                value: result[i].market_value,
                name: result[i].stock_name + ' - ' + result[i].stock_code
            }
        };
        stock_pie.setOption(pie_option);

    })

    var searchBtn = $('#search_button');
    searchBtn.bind('click', function(){
        from = $('#date_from').val();
        to = $('#date_to').val();
        stock_code = $('#stock_code').val();
        if (!!!from) {
            alert('Please input from!');
            return;
        }
        if (!!!to) {
            alert('Please input to!');
            return;
        }
        if (!!!stock_code) {
            alert('Please input stock code!');
            return;
        }

        data = {}
        data.start = from;
        data.end = to;
        data.stock_code = stock_code;

        var myChart = echarts.init(document.getElementById('result_div'));
        myChart.showLoading();
        $.getJSON("/stock_profits.json", data, function(result){
            //alert(JSON.stringify(result));
            myChart.hideLoading();
            var option = {
                title: {
                    text: 'Trend',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['Profit', 'Hold'],
                    top:'bottom'
                },
                yAxis: {
                   type: 'value'
                },
                xAxis: {
                    data: [],
                    type: 'category'
                },
                series: [{
                    name: "Profit",
                    type: "line",
                    data: []
                }, {
                    name: "Hold",
                    type: 'line',
                    data: []
                }],
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        start: 0,
                        end: 100,
                    },
                    {
                        type: 'inside'
                    }
                ]
            };
            for (i = 0; i < result.length; i++){
                option.series[0].data[i] = result[i].profit;
                option.series[1].data[i] = result[i].amount;
                option.xAxis.data[i] = result[i].date;
            }
            myChart.setOption(option);

        });
    });
});
