
$(function(){

	function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
			if(roa.length > 0){
				result[sheetName] = roa;
			}
		});
		return result;
	}

	$('body').on('keyup', '.widget-handel .search', function(e) {
		
		var path = $(this).parents('li').data('path');

		input = $(this).val();

		
		var workbook = XLSX.readFile(path);
		table = $(this).parents('.widget-handel').find('tbody tbody');
		table.find('tr').remove();

		json = to_json(workbook);

		$.each(json.Tabelle1, function(i, v) {
			if (v.name.toLowerCase().indexOf(input.toLowerCase()) >= 0 || v.typ.toLowerCase().indexOf(input.toLowerCase()) >= 0) {				
				table.append('<tr><td class="name">'+v.name+'</td><td class="gewicht">'+v.weight/1000+' kg</td><td class="preis">'+v.price+' GS</td></tr>')
			}
			if (v.alias != undefined) {
				if (v.alias.toLowerCase().indexOf(input.toLowerCase()) >= 0) {
					table.append('<tr><td class="name">'+v.name+'</td><td class="gewicht">'+v.weight/1000+' kg</td><td class="preis">'+v.price+' GS</td></tr>')
				}
			}
		});

	});

	

});