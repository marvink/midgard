
$(function(){

	var $panzoom;
	var activeRightMouse = false;
	var activeEraser = false;
	var activeDrawer = false;
	var activeFogOfWar = false;
	var topMargin = 62;
    var radius = 20; 

	$('body').on('click', '.widget-image img', function(e) {
		var path = $(this).attr('src');
		if ($(this).parents('li').data("name") != "") {
			tab = addTab('<span class="icon fa-picture-o"></span>' + $(this).parents('li').data("name"));
		} else {
			tab = addTab('<span class="icon fa-picture-o"></span>' + $(this).parents('li').data("Bild"));
		}
		tab.addClass("imageTab");
		ipcRenderer.send("image-message", path);
		tab.append('<div class="btn-toolbar"><div class="btn-group"><button class="showImage btn btn-mini btn-default"><span title="Anzeigen" class="icon fa-eye"></span></button><button class="hideImage btn btn-mini btn-default"><span title="Verbergen" class="icon fa-low-vision"></span></button><button class="fogOfWar btn btn-mini btn-default"><span title="Fog of war" class="icon fa-cloud"></span></button><button class="removePaint btn btn-mini btn-default"><span title="Radierer" class="icon fa-eraser"></span></button><label for="radius">Radius:</label><input type="number" value="40" min="0" step="20" name="radius"></div></div></div>');

		tab.append('<div class="overflow"><div class="panzoom"><canvas class="imageCanvas"></canvas><canvas class="fogOfWarCanvas"></canvas></div></div><div id="radiusCursor"></div>');

		loadCanvas(tab.find('.imageCanvas')[0], path);
		tab.find('.imageCanvas').attr("data-path", path);

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


	    tab.find('.fogOfWarCanvas')[0].onmousemove = function(e) {

	    	if (activeEraser) {
	    		extRadius = radius * parseFloat($panzoom.panzoom("getMatrix")[0])

				$('#radiusCursor').css('left', e.clientX - extRadius/2).css('top', e.clientY - extRadius/2).css('width', extRadius ).css('height', extRadius ).show();
			} 

            if (!activeRightMouse) {
               return;
            } else {

            	if (activeEraser && activeFogOfWar) {
            		var coordinates = getMousePos(this, e, radius)
		            var x = coordinates.x;
		            var y = coordinates.y;
		            var fillColor = '#ff0000';
		            var context = tab.find('.fogOfWarCanvas')[0].getContext('2d');

		            context.fillCircle = function(x, y, radius, fillColor) {
			            this.fillStyle = fillColor;
			            this.beginPath();
			            this.moveTo(x, y);
			            this.arc(x, y, radius/2, 0, Math.PI * 2, false);
			            this.fill();
			        };

			        ipcRenderer.send("fogOfWar-draw-erase", {"x": x, "y": y, "radius": radius, "fillColor": fillColor});

		            context.globalCompositeOperation = 'destination-out';
		            context.fillCircle(x, y, radius, fillColor);
            	}

            }
            
        };

        tab.find('.fogOfWarCanvas')[0].onmouseout = function(e) {
        	$('#radiusCursor').hide();
        };


        tab.find('.fogOfWarCanvas')[0].onmousedown = function(e) {
        	if (e.which === 3) {
            	activeRightMouse = true;
        	}
        };
        tab.find('.fogOfWarCanvas')[0].onmouseup = function(e) {
            activeRightMouse = false;
        };
		
	    $panzoom.on('panzoomchange', function(e, panzoom, transform) {
			ipcRenderer.send("image-change", transform);
		});
	});

    $('body').on('click', '.fogOfWar', function(e) {
    	var context = tab.find('.fogOfWarCanvas')[0].getContext('2d');
    	console.log(activeFogOfWar)
    	if (activeFogOfWar) {
    		activeFogOfWar = false;
    		context.clearRect(0, 0, tab.find('.imageCanvas').data("width"), tab.find('.imageCanvas').data("height"));
	    	ipcRenderer.send("fogOfWar-change", {"width": tab.find('.imageCanvas').data("width"), "height": tab.find('.imageCanvas').data("height")});

    	} else {
    		activeFogOfWar = true;
			context.fillStyle = "rgba(255,0,0,0.5)";
	    	context.fillRect(0, 0, tab.find('.imageCanvas').data("width"), tab.find('.imageCanvas').data("height"));
	    	ipcRenderer.send("fogOfWar-change", {"width": tab.find('.imageCanvas').data("width"), "height": tab.find('.imageCanvas').data("height")});
    	}
		
    });

    $('body').on('click', '.removePaint', function(e) {
    	if ($(this).hasClass("active")) {
    		activeEraser = false;
    		$(this).removeClass("active");
    	} else {	    		
    		activeEraser = true;
    		$(this).addClass("active");
    	}
    });

    $('body').on('change', 'input[name=radius]', function(e) {
    	radius = $(this).val();
    });

	function getMousePos(canvas, evt, radius) {
		var diffX = ( $(canvas).parent().width() * parseFloat($panzoom.panzoom("getMatrix")[0]) - $(canvas).parent().width() ) / 2;
    	var diffY = ( $(canvas).parent().height() * parseFloat($panzoom.panzoom("getMatrix")[3]) - $(canvas).parent().height() ) / 2;

    	var oppositeMatrixTransformX = parseFloat($panzoom.panzoom("getMatrix")[4]) * -1
    	var oppositeMatrixTransformY = parseFloat($panzoom.panzoom("getMatrix")[5]) * -1

	    return {
	      x: ((evt.clientX + oppositeMatrixTransformX + diffX) / parseFloat($panzoom.panzoom("getMatrix")[0])),
	      y: ((evt.clientY - topMargin + oppositeMatrixTransformY + diffY) / parseFloat($panzoom.panzoom("getMatrix")[3]))
	    };
	  }

	function loadCanvas(canvas, dataURL) {
        var context = canvas.getContext('2d');

        // load image from data url
        var imageObj = new Image();
        imageObj.onload = function() {
          $(canvas).data("width", imageObj.naturalWidth);
  		  $(canvas).data("height", imageObj.naturalHeight);
          tab.find('.fogOfWarCanvas').attr("width",imageObj.naturalWidth).attr("height",imageObj.naturalHeight);
          tab.find('.panzoom').attr("width",imageObj.naturalWidth).attr("height",imageObj.naturalHeight);
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