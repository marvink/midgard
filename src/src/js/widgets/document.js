
$(function(){
	$('body').on('click', '.widget-document a', function(e) {
		shell.openItem($(this).parents("li").data("path"));
	});
});