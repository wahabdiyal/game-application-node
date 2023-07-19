$(document).ready(function(){
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker3').datetimepicker({
        format: 'LT'
    });
    $('#datetimepicker4').datetimepicker({
        format: 'L'
    });
    $('#datetimepicker5').datetimepicker();
    $('#datetimepicker13').datetimepicker({
        inline: true,
        sideBySide: false
    });
});
