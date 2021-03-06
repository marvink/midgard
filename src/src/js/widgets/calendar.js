
$(function(){

	var moons = [ "Bärenmond", "Luchsmond", "Einhornmond", "Nixenmond", "Schlangenmond", "Feenmond", "Hirschmond", "Drachenmond", "Kranichmond", "Rabenmond", "Trollmond", "Draugmond", "Wolfmond" ]

	$('body').on('click', '.widget-calendar .minus', function(e) {
		var day = $(this).parents('li').data('day') - 1;
		var moonIndex = moons.indexOf($(this).parents('li').data('moon'));
		console.log(moonIndex)
		if(day == "0") {
			$(this).parents('li').data('day', 28);
			$(this).parents('li').attr('data-day', 28);
			$(this).parents('li').find('.day').html(28);
			if ((moonIndex - 1) <= 0) {
				$(this).parents('li').data('moon', moons[12]);
				$(this).parents('li').attr('data-moon', moons[12]);
				$(this).parents('li').find('.moon').html(moons[12]);
				$(this).parents('li').data('year', parseInt($(this).parents('li').data('year'))-1);
				$(this).parents('li').attr('data-year', $(this).parents('li').data('year'));
				$(this).parents('li').find('.year').html(parseInt($(this).parents('li').data('year')));
			} else {
				$(this).parents('li').data('moon', moons[moonIndex-1]);
				$(this).parents('li').find('.moon').html(moons[moonIndex-1]);
			}
		} else {
			$(this).parents('li').data('day', day);
			$(this).parents('li').attr('data-day', day);
			$(this).parents('li').find('.day').html(day);
		}

		saveGrid();
	});

	$('body').on('click', '.widget-calendar .plus', function(e) {
		var day = $(this).parents('li').data('day') + 1;
		var moonIndex = moons.indexOf($(this).parents('li').data('moon'));

		if(day == "29") {
			$(this).parents('li').data('day', 1);
			$(this).parents('li').attr('data-day', 1);
			$(this).parents('li').find('.day').html(1);
			if ((moonIndex + 1) >= 13) {
				$(this).parents('li').data('moon', moons[0]);
				$(this).parents('li').attr('data-moon', moons[0]);
				$(this).parents('li').find('.moon').html(moons[0]);
				$(this).parents('li').data('year', parseInt($(this).parents('li').data('year'))+1);
				$(this).parents('li').attr('data-year', $(this).parents('li').data('year'));
				$(this).parents('li').find('.year').html(parseInt($(this).parents('li').data('year')));
			} else {
				$(this).parents('li').data('moon', moons[moonIndex+1]);
				$(this).parents('li').attr('data-moon', moons[moonIndex+1]);
				$(this).parents('li').find('.moon').html(moons[moonIndex+1]);
			}
		} else {
			$(this).parents('li').data('day', day);
			$(this).parents('li').attr('data-day', day);
			$(this).parents('li').find('.day').html(day);
		}

		saveGrid();
	});

	$('body').on('click', '.widget-calendar .show', function(e) {
		var day = $(this).parents('li').data('day');
		var moon = $(this).parents('li').data('moon');
		var year = $(this).parents('li').data('year');
		var moonIndex = moons.indexOf(moon);

		var sounds = [ "sounds/majorasmask_newday.wav", "sounds/Hahn2.mp3", "sounds/Hahn_kraeht.mp3" ]

		random = Math.floor(Math.random()*sounds.length)

		var typeWriter = new Audio(sounds[random]);
		typeWriter.setSinkId(settings.get('sounddevice'));		
		typeWriter.play();

		var jahreszeit = "(Winter)";
		if (moonIndex >= 2 && moonIndex < 5) {
			jahreszeit = "(Frühling)";
		}		
		if (moonIndex >= 5 && moonIndex < 7) {
			jahreszeit = "(Sommer)";
		}
		if (moonIndex >= 7 && moonIndex < 10) {
			jahreszeit = "(Herbst)";
		}
		ipcRenderer.send("asynchronous-message", day+". "+moon+" "+year+"nL <br>"+jahreszeit );
	});
});