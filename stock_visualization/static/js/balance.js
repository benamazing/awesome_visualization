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
        $.getJSON("/balance.json", data, function(result){
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
                    name: "Asset",
                    type: "line",
                    data: []
                }]
            };
            for (i = 0; i < result.length; i++){
                option.series[0].data[i] = result[i].assets;
                option.xAxis.data[i] = result[i].date;
            }
            myChart.setOption(option);

        });

    });
});
