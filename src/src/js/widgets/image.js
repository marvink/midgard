
$(function(){

	var $panzoom 

	$('body').on('click', '.widget-image img', function(e) {
		var path = $(this).attr('src');
		if ($(this).parents('li').data("name") != "") {
			tab = addTab('<span class="icon fa-picture-o"></span>' + $(this).parents('li').data("name"));
		} else {
			tab = addTab('<span class="icon fa-picture-o"></span>' + $(this).parents('li').data("Bild"));
		}
		tab.addClass("imageTab");
		ipcRenderer.send("image-message", path);
		tab.append('<div class="btn-toolbar"><div class="btn-group"><button class="showImage btn btn-mini btn-default"><span title="Anzeigen" class="icon fa-eye"></span></button><button class="hideImage btn btn-mini btn-default"><span title="Verbergen" class="icon fa-low-vision"></span></button></div></div>');

		tab.append('<div class="overflow"><div class="panzoom"><canvas></canvas></div></div>');

		loadCanvas(tab.find('canvas')[0], path)
		tab.find('canvas').attr("data-path", path);

		$panzoom = $('.panzoom').panzoom();

	    $panzoom.parent().on('mousewheel.focal', function( e ) {
	        e.preventDefault();
	        var delta = e.delta || e.originalEvent.wheelDelta;
	        var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
	        $panzoom.panzoom('zoom', zoomOut, {
	          increment: 0.1,
	          animate: false,
	          focal: e
	        });
	    });
		
	    $panzoom.on('panzoomchange', function(e, panzoom, transform) {
			ipcRenderer.send("image-change", transform);
		});
	});

	function loadCanvas(canvas, dataURL) {
        var context = canvas.getContext('2d');

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
          $(canvas).attr("width",imageObj.naturalWidth).attr("height",imageObj.naturalHeight);
          context.drawImage(this, 0, 0);
        };

        imageObj.src = dataURL;
		/*
		var isDrawing;

		canvas.onmousedown = function(e) {
		  isDrawing = true;
		  console.log($panzoom.getTransform())
		  context.moveTo(e.clientX, e.clientY);
		};
		canvas.onmousemove = function(e) {
		  if (isDrawing) {
		    var radgrad = context.createRadialGradient(e.clientX, e.clientY,10,e.clientX,e.clientY,20);
		    
		    radgrad.addColorStop(0, '#000');
		    radgrad.addColorStop(0.5, 'rgba(0,0,0,0.5)');
		    radgrad.addColorStop(1, 'rgba(0,0,0,0)');
		    context.fillStyle = radgrad;
		    
		    context.fillRect(e.clientX-20, e.clientY-20, 40, 40);
		  }
		};
		canvas.onmouseup = function() {
		  isDrawing = false;
		};*/

  	}

	$('body').on('click', '.imageTab .hideImage', function(e) {
		var path = $(this).parents('.imageTab').find('canvas').data('path');
		ipcRenderer.send("toggle-image", {"display": "none", "path": path});
	});

	$('body').on('click', '.imageTab .showImage', function(e) {
		var path = $(this).parents('.imageTab').find('canvas').data('path');
		ipcRenderer.send("toggle-image", {"display": "block", "path": path});
	});

    ipcRenderer.on('viewport-change', function(event, arg) {
        $('.imageTab .overflow').width(arg.width).height(arg.height);

        $panzoom.panzoom('reset');
  		$panzoom.panzoom('resetDimensions');  		
    }); 
});