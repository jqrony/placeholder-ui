/**
 * jQrony placeholder UI Javascript plugin v1.0.0
 * https://github.com/jqrony/placeholder-ui
 * 
 * @license MIT license
 * @version 1.0.0
 * 
 * Copyright https://github.com/jqrony
 * Released under the MIT license
 * 
 * @author Shahzada Modassir
 * Date: 19 December 2023 14:31 GMT+0530 (India)
 */
(function($) {

const location = window.location.href;
const types = {
	video: "video/*",
	img: "image/*"
};

function dataToBlob(dataURI) {
	const byteString = atob(dataURI.split(",")[1]);
	const arrayBuffer = new ArrayBuffer(byteString.length);
	const unit8Array = new Uint8Array(arrayBuffer);

	for(let i=0; i < byteString.length; i++) {
		unit8Array[i]=byteString.charCodeAt(i);
	}

	return new Blob([arrayBuffer], {type: "image/png"});
}

function run(element, src) {
	const canvas = document.createElement("canvas");
	canvas.width=src.width;
	canvas.height=src.height;

	element.alt=src.text;
	const context = canvas.getContext("2d");

	context.fillStyle=src.background;
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.font=src.font;
	context.fillStyle=src.fillStyle;

	var matrics = context.measureText(src.text);
	var x = (canvas.width / 2) - (matrics.width / 2);
	var y = (canvas.height / 2);
	context.fillText(src.text, x, y);

	if (src.sizePreview) {
		matrics = context.measureText(src.sizes);
		x = (canvas.width / 2) - (matrics.width / 2);
		context.fillText(src.sizes, x, y + src.lineHeight + 2);
	}

	const dataURL = canvas.toDataURL("image/png");
	const blob = dataToBlob(dataURL);
	const blobURL = URL.createObjectURL(blob);
	element.src=blobURL;
}

function force(copy, src, key, value) {
	copy[key]=(src=src||{})[key]||value;
}

$.fn.placeholder=function(src) {
	var copy, sizes, font, runits=/^(\d+)(?:px|rem|em|%)$/, options;
	extract(this).each(function(_i, elem) {
		options = {};
		copy = {};
		copy.sizes=[elem.getAttribute("width"), elem.getAttribute("height")];
		copy.text=elem.dataset["text"]||elem.alt;

		sizes=(elem.dataset["sizes"]||"").split("x");

		!copy.sizes[0] && (copy.sizes[0]=+sizes[0]);
		!copy.sizes[1] && (copy.sizes[1]=+sizes[1]);

		copy.dimenssion=copy.sizes.join("x");

		force(copy, src, "background", "#eeeeee");
		force(copy, src, "fontWeight", 600);
		force(copy, src, "fontSize", 18);
		force(copy, src, "fontFamily", "Arial");
		force(copy, src, "color", "#9d9292");
		force(copy, src, "fontStyle", "normal");
		force(copy, src, "type", types[elem.nodeName.toLowerCase()]);

		if (!runits.test(copy.fontSize)) {
			copy.fontSize=copy.fontSize + "px";
		}

		options.sizePreview=!!(src||{}).sizePreview;
		options.background=copy.background;
		options.height=copy.sizes[1];
		options.width=copy.sizes[0];
		options.fillStyle=copy.color;
		options.sizes=copy.dimenssion;
		options.lineHeight=parseFloat(copy.fontSize);
		options.text=copy.text||copy.dimenssion;
		font=[copy.fontStyle, copy.fontWeight, copy.fontSize, copy.fontFamily];
		options.font=font.join(" ");

		run(elem, options);
	});
};

function extract(elems) {
	return $.fn.pushStack($.grep(elems, function(elem) {
		return elem.src===location;
	}));
}
})(jQrony);