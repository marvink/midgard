const fs = require('fs');
const shell = require('electron').shell;
const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const dialog = require('electron').remote.dialog;
const remote = require('electron').remote;
const app = remote.app;
const path = require('path')

const ElectronSettings = require('electron-settings');
let settings = new ElectronSettings();

$(function(){ //DOM Ready

    gridster = $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [140, 140],
        min_cols: 10,
        min_rows: 10,
        serialize_params: function ($w, wgd) {
        	var id = $w.find("> div").attr("class");
        	var d = {}, 
	        re_dataAttr = /^data\-(.+)$/;
		    $.each($w.get(0).attributes, function(index, attr) {
		        if (re_dataAttr.test(attr.nodeName)) {
		            var key = attr.nodeName.match(re_dataAttr)[1];
		            d[key] = attr.nodeValue;
		        }
		    });

		    return {
		      id: id,
		      args: d,
		      col: wgd.col,
		      row: wgd.row,
		      size_x: wgd.size_x,
		      size_y: wgd.size_y,
		    };
		},
		draggable: {
			enabled: false,
			stop: function(e, ui, $widget) {
				saveGrid();
			}
		},
		resize: {
			enabled: true,
			stop: function(e, ui, $widget) {
				saveGrid();
			}
		}
    }).data('gridster').disable();

    $('body').on('click', 'button.gridMove', function() {
    	if ($(this).hasClass('active')) {
    		gridster.disable();
	    	$(this).removeClass('active');
    	} else {
    		gridster.enable();
    		$(this).addClass('active');	
    	}
    	
    });

    if (gridster != undefined) { 
    	gridster.remove_all_widgets();
    
		fs.readFile(app.getPath('userData') + '/adventures/' + settings.get('currentAdventure'), 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    json = JSON.parse(data);
		    $.each(json.grid, function() {
		    	var that = this;

		    	$.get("widgets/" + that.id + '.handlebars', function(response){
		    	    var template = Handlebars.compile(response);
		            html = template(that);
		            gridster.add_widget(html, that.size_x, that.size_y, that.col, that.row);
			    });
		    });
		});
	}

	$('button.fancybox').click(function () {
		href = $(this).data('fancybox');
        $.fancybox([{ 
        	'href' : href,
            padding: 0
            }
        ]);
    });

	$('body').on('click', 'button.openFile', function() {

		type = $(this).data('type');
		element = $(this).prev('input');

		openFile(type, element);
	});

	$('body').on('click', 'input.openFile', function() {

		type = $(this).data('type');
		element = $(this);

		openFile(type, element);
	});

	function openFile(type, element) {

		if (type == "directory") {
			dialog.showOpenDialog({properties: ['openDirectory']}, function (fileNames) {
				element.val(fileNames);
	  		});
		} else if (type == "images") {
			dialog.showOpenDialog({properties: ['openFile'], filters: [{name: 'Images', extensions: ['jpg', 'png', 'gif']}] }, function (fileNames) {
				element.val(fileNames);
	  		});
		} else {
			dialog.showOpenDialog(function (fileNames) {
				element.val(fileNames);
	  		});
		}		
	}

	$('body').on('click', 'header.remove-widget', function(e) {
		removeWidget($(this).parent('li'));
		saveGrid();
	});

	$('button.add').click(function() {
		var args = {};
		var id;
		if ($(this).data('id') != undefined) {
			id = $(this).data('id');
		} else {
			id = $(this).parents('form').data('id');			
			$(this).parents('form').find('input,select').each(function() {
				args[$(this).attr('name')] = $(this).val();
			});
		}
		$.get("widgets/" + id + '.handlebars', function(response){
		    var template = Handlebars.compile(response);
	        html = template({"args": args});
	        gridster.add_widget(html, 1, 1, 1, 1);
	        saveGrid();
	        $.fancybox.close();
	    });
	});

	$('.tab-group').each(function(){
	    // For each set of tabs, we want to keep track of
	    // which tab is active and its associated content
	    var $active, $content, $links = $(this).find('div');

	    // If the location.hash matches one of the links, use that as the active tab.
	    // If no match is found, use the first link as the initial active tab.
	    $active = $($links.filter('[data-href="'+location.hash+'"]')[0] || $links[0]);
	    $active.addClass('active');
	    $content = $($active).data('href');
	    
	    // Hide the remaining content
	    $links.not($active).each(function () {
	      $($(this).data('href')).hide();
	    });

	    // Bind the click event handler
	    $(this).on('click', '.tab-item', function(e){
	      // Make the old tab inactive.
	      $active.removeClass('active');
	      $($content).hide();

	      // Update the variables with the new link and content
	      $active = $(this);
	      $content = $(this).data('href');

	      // Make the tab active.
	      $active.addClass('active');
	      $($content).show();

	      // Prevent the anchor's default click action
	      e.preventDefault();
	    });

	});

	// SETTINGS

	navigator.mediaDevices.enumerateDevices().then(function(devices) {
	  devices.forEach(function(device) {
	  	if (device.kind == "audiooutput") {
	  		if (settings.get('sounddevice') == device.deviceId) {
	  			$('.sounddevices').append($('<option selected="selected"></option>').val(device.deviceId).html(device.label));
	  		} else {
	  			$('.sounddevices').append($('<option></option>').val(device.deviceId).html(device.label));
	  		}
	  	}
	  })
	});

	$('body').on('change', '.sounddevices', function(e) {
		settings.set('sounddevice', $(this).val());
	}); 

    fs.readdir(app.getPath('userData') + '/adventures', function(err, files) {
      for(var i in files) {

        var filename = files[i];

        file = fs.readFileSync(app.getPath('userData') + '/adventures/' + filename, 'utf8');

        name = JSON.parse(file).name;

        $('select[name=adventureSettings]').append('<option value='+ filename +'>'+name+'</option');
      }     
    });

    $('body').on('click', '.adventureSettings', function(e) {
      e.preventDefault();
      var value = $('select[name=adventureSettings]').val();

      for(var i in value) {
        fs.unlinkSync(app.getPath('userData') + '/adventures/' + value[i])
      }
    });

});

function saveGrid() {

	fs.readFile(app.getPath('userData') + '/adventures/' + settings.get('currentAdventure'), 'utf8', function (err, data) {
	    if (err) return console.log(err);
	    json = JSON.parse(data);

	   	json.grid = gridster.serialize()
	    
	    fs.writeFile(app.getPath('userData') + '/adventures/' + settings.get('currentAdventure'), JSON.stringify(json), (err) => {
		  if (err) throw err;
		  console.log('It\'s saved!');
		});	
	    
	});
}

function removeWidget(widget) {
	gridster.remove_widget(widget);
}

function addTab(name) {
	id = new Date().getTime();
	$('.tab-group').append("<div class='tab-item removable' data-href='#cont"+id+"'>"+name+"<span onclick='removeTab(\"#cont"+id+"\")' class='icon fa-times icon-close-tab'></span></div>");
	$('.panel-container').append("<div id='cont"+id+"'></div>");
	$('.tab-group').find('div[data-href="#cont'+id+'"]').trigger('click');

	return $('.panel-container').find('#cont'+id); 
}

function removeTab(id) {
	ipcRenderer.send("toggle-image", "none");
	$('.tab-group').find('div[data-href="#dashboard"]').trigger('click');	
	$('.tab-group').find('div[data-href="'+id+'"]').remove();
	$(id).remove();
}