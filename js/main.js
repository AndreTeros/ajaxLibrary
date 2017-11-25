/**
 * v.0.3.5
 *
 * with jQuery
 * support
 * --- several blocks for one result
 * --- append / prepend
 *
 *
 */
var ajaxObjs = [];
// var ajaxList = ['a11', 'a26', 'b1', 'b2', 'b3'];
var ajaxList = [];
// todo: [idea] отдельный опциональный файл с сеттингами
// todo: добавить поддежку классов
var ajaxSetting = {
	searchAttr: 'ajaxbutton',

	domAttr: {
		button: 'ajaxbutton',
		rs: 'ajaxrs',
		rspart: 'part',
		ajaxData: 'ajaxData',
		rsInsertType: 'ajaxrst'
	},

	defValues: {
		url: 'ajax/test.php'
	}
};

function oConstruct(button, rsDom, name) {
	var url = ajaxSetting.defValues.url,
		data, obj;

	data = button.attr(ajaxSetting.domAttr.ajaxData);
	if(data === undefined) {
		data = {};
	} else {
		try {
			data = JSON.parse(data);
		} catch (e) {
			data = {};
			console.error("Error: data in "+name+"|| "+e);
		}
	}

	this.url = url;
	this.rsDom = rsDom;
	this.name = name;
	this.button = button;
	this.data = data;
	obj = this;

		this.button.on('click', function () {
		ajaxAction(obj);
	});

}

function ajaxAction(o) {
	$.ajax({
		type: 'POST',
		url: o.url,
		data: o.data,
		success: function(result) {
			// todo: добавить возможность апенда, препенда и т.д.
			if(result.res == 1){
				prepareResult(o, result)
			} else {
				// todo: вывод ошибок
			}
		},
		error: function(xhr){
			console.log(xhr);
		}
	});
}


function prepareResult(o, r) {
	var k, rsDomPart,
		rsInsertType;
	if(typeof(r.html) === "string") {
		rsInsertType = o.rsDom.attr(ajaxSetting.domAttr.rsInsertType);
		if(o.rsDom.length > 0) {
			insertResult(o.rsDom, r.html, rsInsertType);
		} else {
			console.error("Error: No result dom");
			console.log(r.html);
		}

	} else if(typeof(r.html) === "object") {
		for(k in r.html) {
			rsDomPart = $('['+ajaxSetting.domAttr.rs+'="'+o.name+'"]['+ajaxSetting.domAttr.rspart+'="'+k+'"]');
			if(rsDomPart) {
				rsInsertType = rsDomPart.attr(ajaxSetting.domAttr.rsInsertType);
				// rsDomPart.html(r.html[k]);
				insertResult(rsDomPart, r.html[k], rsInsertType);
			}
		}
	} else {
		console.error("Error: wrong response type");
	}
}

function insertResult(dom, html, rsInsertType) {
	switch(rsInsertType) {
		case 'append':
			dom.append(html);
			break;
		case 'prepend':
			dom.prepend(html);
			break;
		default:
			dom.html(html);
			break;
	}
}

function init() {
	var button, rsDom, name;
	ajaxListCollect();
	if(!!ajaxList) {
		for(var i=0; i < ajaxList.length; i++) {

			button = $('['+ajaxSetting.domAttr.button+'="'+ajaxList[i]+'"]');
			rsDom = $('['+ajaxSetting.domAttr.rs+'="'+ajaxList[i]+'"]');
			name = ajaxList[i];

			if(button.length === 0) {
				console.error("Error:No action button for "+name);
				continue;
			}

			if(rsDom.length === 0) {
				console.error("Error: No result dom for "+name);
				continue;
			}

			ajaxObjs[i] = new oConstruct(button, rsDom, name);
		}
	}
}

function ajaxListCollect() {
	var searchAttrValue;
	$('['+ajaxSetting.searchAttr+']').each(function() {
		console.log($(this).attr(ajaxSetting.searchAttr));
		searchAttrValue = $(this).attr(ajaxSetting.searchAttr);
		if(!!searchAttrValue && ajaxList.indexOf(searchAttrValue) === -1) {
			ajaxList.push(searchAttrValue);
		}
	});
	console.log(ajaxList);

	// ajaxList
}

$(document).ready(function() {
	init();
});