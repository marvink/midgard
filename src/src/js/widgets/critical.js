
$(function(){
	$('body').on('click', '.widget-critical button', function(e) {
		that = $(this);	


		tab = addTab(that.html())
		tab.addClass("criticalTab").data("list", that.data('list'))

		
		fs.readFile(that.data('list'), 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    json = JSON.parse(data);
		    random = Math.floor(Math.random()*100)+1;

		    json.list.forEach(function(crit) {
		    	if (tab.is(':empty')) {
				    if(crit.von <= random && crit.bis >= random) {
						tab.append('<div class="slider"><input type="range" class="range" max="100" min="0" value="'+random+'"></div>');
						tab.append("<div class='vonbis'>"+crit.von+"-"+crit.bis+ "</div>");
						tab.append("<div class='auswirkung'>"+crit.auswirkung+"</div>");
						tab.append("<div class='description'>"+crit.description+"</div>");
						tab.append("<div class='description2'>"+crit.description2+"</div>");
						tab.append("<div class='description3'>"+crit.description3+"</div>");
						tab.append("<button class='random' onclick=\"$(this).parents('.criticalTab').find('.slider input').val(Math.floor(Math.random()*100)+1).trigger('input')\">Random</button>");
						tab.append("<button class='showOnScreen' onclick='ipcRenderer.send(\"asynchronous-message\", \""+crit.auswirkung+"\")'>Anzeigen</button>");
						tab.append("<button class='exit' onclick='removeTab(\"#"+tab.attr('id')+"\")'>Tab schließen</button>");
				    }
				}
			});
			
		});


		tab.on('click', 'button', function(e) {
			var dice = typeof $(this).data("dice") !== 'undefined' ? $(this).data("dice") : 6;
			var quantity = typeof $(this).data("quantity") !== 'undefined' ? $(this).data("quantity") : 1;
			var mali = typeof $(this).data("mali") !== 'undefined' ? $(this).data("mali") : 0;
			random = 0;

			for (var i = 0; i < quantity; ++i) {
				random = random + (Math.floor(Math.random()*dice)+1);
			}

			random = random+mali;

			if (random < 0) {
				random = 1;
			}

			$(this).find('span').html('= '+ random);
			
		});

	});


	$('body').on('input', '.range', function(e) {

		tab = $(this).parents('.criticalTab')
		list = tab.data('list');
		value = $(this).val();


		fs.readFile(list, 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    json = JSON.parse(data);

		    json.list.forEach(function(crit) {
			    if(crit.von <= value && crit.bis >= value) {					
					tab.find(".vonbis").html(crit.von+"-"+crit.bis);
					tab.find(".auswirkung").html(crit.auswirkung);
					tab.find(".description").html(crit.description);
					tab.find(".description2").html(crit.description2);
					tab.find(".description3").html(crit.description3);
					tab.find(".showOnScreen").attr("onclick", "ipcRenderer.send(\"asynchronous-message\", \""+crit.auswirkung+"\")");
			    }
			});
			
		});
	});
});