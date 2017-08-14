$(document).ready(function(){

    $('#date_from').datepicker(option={"dateFormat": "yy-mm-dd"});
    $('#date_to').datepicker(option={"dateFormat": "yy-mm-dd"});

    var searchBtn = $('#search_button');
    searchBtn.bind('click', function(){
        from = $('#date_from').val();
        to = $('#date_to').val();
        if (!!!from) {
            alert('Please input from!');
            return;
        }
        if (!!!to) {
            alert('Please input to!');
            return;
        }
        data = {}
        data.start = from;
        data.end = to;

        var myChart = echarts.init(document.getElementById('result_div'));
        myChart.showLoading();
        $.getJSON("/assets.json", data, function(result){
            //alert(JSON.stringify(result));
            myChart.hideLoading();
            var option = {
                title: {
                    text: 'Trend',
                    left: 'center'
                },
                tooltip: {},
                legend: {
                    data: ['Asset'],
                    left:'right'
                },
                yAxis: {
                   type: 'value',
                   min: 200000
                },
                xAxis: {
                    data: [],
                    type: 'category'
                },
                series: [{
                    name: "Asset",
                    type: "line",
                    data: [],
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 30,

                        data: [
                            {type: 'max', name: '最高'},
                            {type: 'min', name: '最低'},
                        ]
                    }
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
                option.series[0].data[i] = result[i].assets;
                option.xAxis.data[i] = result[i].date;
            }
            myChart.setOption(option);

        });



        var myChart2 = echarts.init(document.getElementById('rates_div'));
        myChart2.showLoading();
        $.getJSON("/rates.json", data, function(result){
            //alert(JSON.stringify(result));
            myChart2.hideLoading();
            var option = {
                title: {
                    text: 'Trend',
                    left: 'center'
                },
                tooltip: {},
                legend: {
                    data: ['Asset Rate', 'Index Rate'],
                    left:'right'
                },
                yAxis: {
                   type: 'value'
                },
                xAxis: {
                    data: [],
                    type: 'category'
                },
                series: [{
                    name: "Asset Rate",
                    type: "line",
                    data: []
                }, {
                    name: "Index Rate",
                    type: "line",
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
            for (i = 0; i < result['index_rates'].length; i++){
                option.xAxis.data[i] = result['index_rates'][i].date;
                option.series[1].data[i] = result['index_rates'][i].rate;
            }
            len0 = result['asset_rates'].length;
            len1 = result['index_rates'].length;

            for (i = 0; i < (len1-len0); i++){
                option.series[0].data[i] = 1;
            }
            for (i = (len1-len0); i < len0; i++){
                option.series[0].data[i] = result['asset_rates'][i].rate;
            }
            myChart2.setOption(option);

        });

    });
});
