
$(function(){

	var $panzoom 

	$('body').on('click', '.widget-image img', function(e) {
		var path = $(this).attr('src');

		tab = addTab("Image");
		tab.addClass("imageTab");

		ipcRenderer.send("image-message", path);

		tab.append('<button class="showImage">Anzeigen</button>');
		tab.append('<button class="hideImage">Verbergen</button>');
		tab.append('<!--<button class="rotate">90 Grad drehen</button><br/>-->');

		tab.append('<div class="overflow"><div class="panzoom"><img src="'+path+'"></div></div>');

		$panzoom = $('.panzoom').panzoom();

	    $panzoom.parent().on('mousewheel.focal', function( e ) {
	        e.preventDefault();
	        console.log(e.originalEvent.wheelDelta)
	        var delta = e.delta || e.originalEvent.wheelDelta;
	        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
	        $panzoom.panzoom('zoom', zoomOut, {
	          increment: 0.1,
	          animate: false,
	          focal: e
	        });
	    });

	    ipcRenderer.on('image-change-reply', function(event, arg) {   
	    	$panzoom.off('panzoomchange');

	        $panzoom.panzoom("setMatrix", arg);

	        $panzoom.on('panzoomchange', function(e, panzoom, transform) {
				ipcRenderer.send("image-change", transform);
			});
	    }); 
		
	    $panzoom.on('panzoomchange', function(e, panzoom, transform) {
			ipcRenderer.send("image-change", transform);
		});
	});

	$('body').on('click', '.imageTab .rotate', function(e) {
		$(this).parent('.imageTab').find('img').css('transform','rotate(90deg)'); 	
        $panzoom.panzoom('reset');
  		$panzoom.panzoom('resetDimensions');	
	});

	$('body').on('click', '.imageTab .hideImage', function(e) {
		ipcRenderer.send("toggle-image", "none");
	});

	$('body').on('click', '.imageTab .showImage', function(e) {
		ipcRenderer.send("toggle-image", "block");
	});

    ipcRenderer.on('viewport-change', function(event, arg) {
        $('.imageTab .overflow').width(arg.width).height(arg.height);

        $panzoom.panzoom('reset');
  		$panzoom.panzoom('resetDimensions');
  		
    }); 
});