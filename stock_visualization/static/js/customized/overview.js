$(document).ready(function(){

    // render pie chart
    var stock_pie_div = document.getElementById('stock_pie');
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
                radius : '80%',
                center: ['60%', '60%'],
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

	var resize_pie = function(){
		stock_pie_div.style.width = window.innerWidth + 'px';
		stock_pie_div.style.height = window.innerHeight * 3/4 + 'px';
	};

    window.onresize = function(){
       resize_pie();
       stock_pie.resize();
    }
});
