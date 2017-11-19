/**
 * v.0.2
 *
 * with jQuery
 * support
 * --- several blocks for one result
 * ---
 *
 *
 *
 */
var ajaxObjs = [];
var ajaxList = ['a11', 'a26'];

var ajaxSetting = {
	domAttr: {
		button: 'ajaxbutton',
		rs: 'ajaxrs',
		rspart: 'part'
	},

	defValues: {
		url: 'ajax/test.php'
	}
};

function oConstruct(button, rsDom, name) {
	var url = ajaxSetting.defValues.url,
		data, obj;

	//todo: сбор данных
	data = {name:name};

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
	console.log(o);
	var k, rsDomPart;
	$.ajax({
		type: 'POST',
		url: o.url,
		data: o.data,
		success: function(result) {
			// todo: добавить возможность апенда, препенда и т.д.
			if(result.res == 1){
				if(typeof(result.html) === "string") {
					if(o.rsDom.length > 1) {
						o.rsDom.html(result.html);
					} else {
						console.error("Error: No result dom");
						console.log(result.html);
					}

				} else if(typeof(result.html) === "object") {
					for(k in result.html) {
						rsDomPart = $('['+ajaxSetting.domAttr.rs+'="'+o.name+'"]['+ajaxSetting.domAttr.rspart+'="'+k+'"]');
						if(rsDomPart) {
							rsDomPart.html(result.html[k]);
						}
					}
					console.log("Oh, my God! It's object!!");
				} else {
					console.error("Error: wrong response type");
				}

			}

		},
		error: function(xhr){
			console.log(xhr);
		}
	});
};

function init() {
	var button, rsDom, name;

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

init();