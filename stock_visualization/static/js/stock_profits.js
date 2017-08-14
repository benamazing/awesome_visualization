$(document).ready(function(){

    $('#date_from').datepicker(option={"dateFormat": "yy-mm-dd"});
    $('#date_to').datepicker(option={"dateFormat": "yy-mm-dd"});

    var searchBtn = $('#search_button');
    searchBtn.bind('click', function(){
        from = $('#date_from').val();
        to = $('#date_to').val();
        code = $('#stock_code').val();
        if (!!!from) {
            alert('Please input from!');
            return;
        }
        if (!!!to) {
            alert('Please input to!');
            return;
        }
        if (!!!code) {
            alert('Please input stock code!');
            return;
        }

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
                tooltip: {},
                legend: {
                    data: ['Profit'],
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
                }]
            };
            for (i = 0; i < result.length; i++){
                option.series[0].data[i] = result[i].profit;
                option.xAxis.data[i] = result[i].date;
            }
            myChart.setOption(option);

        });
    });
});
