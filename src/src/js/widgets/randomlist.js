
$(function(){
	$('body').on('click', '.widget-randomlist button', function(e) {
    	that = $(this);
		fs.readFile(that.data('path'), 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    that.next('.result').html("");
		    var lines = data.split('\n');		    
		    that.next('.result')
		    	.append(lines[Math.floor(Math.random()*lines.length)]+"<br>")
		    	.append(lines[Math.floor(Math.random()*lines.length)]+"<br>")
		    	.append(lines[Math.floor(Math.random()*lines.length)]+"<br>")
		    	.append(lines[Math.floor(Math.random()*lines.length)]+"<br>")
		    	.append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		});
	});
});