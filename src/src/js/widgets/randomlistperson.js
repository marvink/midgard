
$(function(){
	$('body').on('click', '.widget-randompersonen button', function(e) {
    	that = $(this);		
		that.nextAll('.resultm').find('span').html("");
		that.nextAll('.resultw').find('span').html("");
		fs.readFile(that.data('lastnamerandomlist'), 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    var lines = data.split('\n');
		    that.nextAll('.resultm').find('.lastname1').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.lastname2').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.lastname3').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.lastname4').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.lastname5').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");

		    var lines = data.split('\n');		    
		    that.nextAll('.resultw').find('.lastname1').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.lastname2').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.lastname3').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.lastname4').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.lastname5').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		});

		fs.readFile(that.data('firstnamemrandomlist'), 'utf8', function (err, data) {
		    if (err) return console.log(err);

		    var lines = data.split('\n');		    
		    that.nextAll('.resultm').find('.firstname1').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.firstname2').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.firstname3').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.firstname4').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultm').find('.firstname5').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		});

		fs.readFile(that.data('firstnamewrandomlist'), 'utf8', function (err, data) {
		    if (err) return console.log(err);

		    var lines = data.split('\n');		    
		    that.nextAll('.resultw').find('.firstname1').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.firstname2').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.firstname3').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.firstname4').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		    that.nextAll('.resultw').find('.firstname5').append(lines[Math.floor(Math.random()*lines.length)]+"<br>");
		});
	});
});