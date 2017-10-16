$(document).ready(function(){

    $('#date').datepicker(option={"dateFormat": "yy-mm-dd"});

    var btn = $('#submit_button');
    btn.bind('click', function(){
        day = $('#date').val();
        asset = $('#total_asset').val();
        if (!!!day) {
            alert('Please input date!');
            return;
        }
        if (!!!asset) {
            alert('Please input asset!');
            return;
        }
        if (isNaN(parseFloat(asset))) {
            alert('Invaid input!');
            return;
        }
        data = {}
        data.day = day;
        data.asset = parseFloat(asset);
        $.post('/edit_assets', data, function(result){
            result_obj = JSON.parse(result);
            if (result_obj.code == 'success'){
                alert('Saved asset successfully!')
            } else{
                alert('Failed: ' + result_obj.msg);
            }
        })
    });
});
