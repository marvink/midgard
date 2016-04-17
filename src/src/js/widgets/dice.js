
$(function(){
	$('body').on('click', '.widget-dice button', function(e) {
		$(this).nextAll('.result').html(Math.floor(Math.random()*$(this).data('value'))+1+"");		
	});

	$('body').on('change', '.widget-dice input', function(e) {
		$(this).next('button').data("value", $(this).val());
	});
});