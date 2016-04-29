const fs = require('fs');
const shell = require('electron').shell;
const ipcMain = require('electron').ipcMain;
const ipcRenderer = require('electron').ipcRenderer;
const remote = require('electron').remote;
const app = remote.app;
const dialog = remote.require('dialog');


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
			enabled: true,
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
    }).data('gridster');

    if (gridster != undefined) { 
    	gridster.remove_all_widgets();
    
		fs.readFile(app.getPath('userData') + '/widgets.txt', 'utf8', function (err, data) {
		    if (err) return console.log(err);
		    json = JSON.parse(data);
		    $.each(json, function() {
		    	var that = this;

		    	$.get("widgets/" + that.id + '.handlebars', function(response){
		    	    var template = Handlebars.compile(response);
		            html = template(that);
		            gridster.add_widget(html, that.size_x, that.size_y, that.col, that.row);
			    });
		    });
		});
	}

	$('button.openFile').click(function() {

		that = 	$(this);

		dialog.showOpenDialog(function (fileNames) {
			that.prev('input').val(fileNames);
  		});
	});

	$('body').on('click', 'header.remove-widget', function(e) {
		removeWidget($(this).parent('li'));
		saveGrid();
	});

	$('select[name="widget"]').change(function() {
		$(this).parent('body').find('div').hide();
		$(this).parent('body').find('.add-'+$(this).val()).show();
	});

	$('button.add').click(function() {
		var id = $(this).parent('form').data('id');
		var args = {}
		$(this).parent('form').find('input,select').each(function() {
			args[$(this).attr('name')] = $(this).val();
		});

		ipcRenderer.send("addWidgetToMainWindow", {'id':id,'args': args});
	});

	$('.etabs').each(function(){
	    // For each set of tabs, we want to keep track of
	    // which tab is active and its associated content
	    var $active, $content, $links = $(this).find('a');

	    // If the location.hash matches one of the links, use that as the active tab.
	    // If no match is found, use the first link as the initial active tab.
	    $active = $($links.filter('[href="'+location.hash+'"]')[0] || $links[0]);
	    $active.parent('.tab').addClass('active');

	    $content = $($active[0].hash);

	    // Hide the remaining content
	    $links.not($active).each(function () {
	      $(this.hash).hide();
	    });

	    // Bind the click event handler
	    $(this).on('click', 'a', function(e){
	      // Make the old tab inactive.
	      $active.parent('.tab').removeClass('active');
	      $content.hide();

	      // Update the variables with the new link and content
	      $active = $(this);
	      $content = $(this.hash);

	      // Make the tab active.
	      $active.parent('.tab').addClass('active');
	      $content.show();

	      // Prevent the anchor's default click action
	      e.preventDefault();
	    });

	     // Bind the click event handler
	    $(this).on('click', '.vorschau', function(e){
	      ipcRenderer.send("openSecondWindow");
	    });

	    $(this).on('click', '.addWidget', function(e){
	      ipcRenderer.send("openAddWidgetWindow");
	    });
	});

});

function saveGrid() {
	fs.writeFile(app.getPath('userData') + '/widgets.txt', JSON.stringify(gridster.serialize()), (err) => {
	  if (err) throw err;
	  console.log('It\'s saved!');
	});
}

function removeWidget(widget) {
	gridster.remove_widget(widget);
}

function addTab(name) {
	id = new Date().getTime();
	$('.etabs').append("<li class='tab removable'><a href='#cont"+id+"'>"+name+"</a><span onclick='removeTab(\"#cont"+id+"\")'>x</span></li>");
	$('.panel-container').append("<div id='cont"+id+"'></div>");
	$('.etabs').find('a[href="#cont'+id+'"]').trigger('click');

	return $('.panel-container').find('#cont'+id); 
}

function removeTab(id) {
	ipcRenderer.send("toggle-image", "none");
	$('.etabs').find('a[href="#dashboard"]').trigger('click');	
	$('.etabs').find('a[href="'+id+'"]').parent('li').remove();
	$(id).remove();
}

ipcRenderer.on('addWidgetToMainWindow-reply', function(event, arg) {        
	var that = arg;

	$.get("widgets/" + that.id + '.handlebars', function(response){
	    var template = Handlebars.compile(response);
        html = template(that);
        gridster.add_widget(html, 1, 1, 1, 1);
        saveGrid();
    });
}); 