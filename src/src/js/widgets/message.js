
$(function(){
	$('body').on('click', '.widget-message button', function(e) {
		var message = $(this).prev("input").val();

		
		ipcRenderer.send("asynchronous-message", message);					
	});
});