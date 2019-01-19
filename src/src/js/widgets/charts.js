$(function(){

	$('body').on('click', '.widget-charts .minus', function(e) {
		curVal = $(this).next().val();

		if (curVal == "") {
			curVal = 0;
		}

		$(this).next().val( parseInt(curVal) - 1 );
		name = $(this).next().attr('name');
		$(this).parents('li').data(name, $(this).next().val());
		$(this).parents('li').attr('data-'+name, $(this).next().val());

		saveGrid();
	});

	$('body').on('click', '.widget-charts .plus', function(e) {
		curVal = $(this).prev().val();

		if (curVal == "") {
			curVal = 0;
		}

		$(this).prev().val( parseInt(curVal) + 1 );
		name = $(this).prev().attr('name');
		$(this).parents('li').data(name, $(this).prev().val());
		$(this).parents('li').attr('data-'+name, $(this).prev().val());

		saveGrid();
	});

});