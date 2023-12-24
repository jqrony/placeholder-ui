/**!
 * placeholder-ui is fast free, pure Javascript plugin v1.1.0
 * https://github.com/jqrony/placeholder-ui
 * 
 * @license MIT license
 * @version 1.1.0
 * 
 * Plugin dependent on Snizzle library
 * https://github.com/jqrony/snizzle
 * 
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://github.com/jqrony/placeholder-ui/blob/main/LICENSE
 * 
 * @author Shahzada Modassir <codingmodassir@gmail.com>
 * date: 23 December 2023 23:32 GMT+0530 (India Standard Time)
 */
(function($) {

/**
 * inject js strict mode
 * ---------------------
 * throw exceptions when non-strict code accesses strict mode
 */
"use strict";

const attachWith = {img: "src", video: "poster"};

function getStyle(elem, prop) {
	return window.getComputedStyle(elem)[prop];
}

function detach(elem) {
	elem.attachments.isAlt && (elem.alt=elem.attachments.alt);
	delete elem.attachments;
}

function attach(elem, options) {
	var attachments={}, text, sizes;
	attachments.height=parseInt(getStyle(elem, "height"));
	attachments.width=parseInt(getStyle(elem, "width"));
	attachments.color=options.color||"#5a7c9d";
	attachments.types=options.types;
	attachments.font=[
		options.fontStyle||"normal",
		options.fontWeight||"bold",
		options.fontSize||20,
		options.fontFamily||"Arial"
	];
	attachments.background=options.background||"#ebe8e8";
	attachments.lineHeight=attachments.font[2];
	attachments.text=elem.alt;
	attachments.isAlt=("alt" in elem);
	attachments.alt=elem.alt;
	attachments.sizes=attachments.width + "x" + attachments.height;
	if ((text=elem.dataset["text"])) {
		elem.removeAttribute("data-text");
		attachments.text=text;
	}
	if ((sizes=elem.dataset["sizes"]) &&
		options.types=="img") {
		elem.removeAttribute("data-sizes");
		attachments.sizes=sizes;
		elem.alt="";
		attachments.width=(sizes=sizes.split("x")) && +sizes.shift();
		attachments.height=+sizes.join("");
	}
	if (options.sizePreview) {
		attachments.text += "\\n" + attachments.sizes;
	}
	elem.attachments=attachments;
	return elem;
}

function initHolder(selector, options) {
	var elem, elems = $(selector), defSrc=window.location.href,
		relemsupport = /^(?:img|video)$/i;
	for(var i=0; i < elems.length; i++) {
		elem=elems[i];
		options.types=elem.nodeName.toLowerCase();
		if (!elem.src||
			(elem.src===defSrc&&relemsupport.test(options.types))) {
			canvaSetup(attach(elem, options));
		}
	}
}

function adjustFont(text, context, attachments) {
	var matrics, maxText=text[0], textLen=maxText.length,
		maxwidth=attachments.width, unit="px";

	test(parseFloat(attachments.font[2]));
	for(var i=0; i < text.length; i++) {
		if (textLen < text[i].length) {
			maxText=text[i];
			textLen=text[i].length;
		}
	}
	function test(font) {
		context.font=attachments.font.join(" ");
		matrics = context.measureText(maxText);
		if (matrics.width >= maxwidth && font) {
			font--;
			attachments.lineHeight--;
			(attachments.font[2]=font + unit), test(parseFloat(font));
		}
	}
}

function Placeholder() {
	return this.expando = "placeholder" + 1 * Date.now();
}

Placeholder.prototype = {
	constructor: Placeholder,
	init: initHolder,
	set: function(options) {
		options=options||{};
		if (typeof options!=="object") {
			window.console.error("Argument Error: Invalid or missing object");
			return;
		}
		initHolder("img, video", options);
	}
};

var placeholder = new Placeholder();

function fillText(textSource, context, {attachments}) {
	adjustFont(textSource, context, attachments);

	var matrics, text, x, y, lineHeight = attachments.lineHeight,
		{canva} = attachments, textHeight, textLen;
		
	for(var i=0; i < textSource.length; i++) {
		textLen=textSource.length;
		text=textSource[i];
		matrics = context.measureText(text);
		y = canva.height / 2 - (lineHeight * textLen / 2);
		x = canva.width / 2 - matrics.width / 2;
		textHeight = lineHeight + y;
		context.fillText(text, x, (lineHeight * i) + textHeight);
	}
}

function canvaSetup(elem) {
	var canva = document.createElement("canvas"), width, height,
		context = canva.getContext("2d");
	
	height=canva.height=elem.attachments.height;
	width=canva.width=elem.attachments.width;
	elem.attachments.context=context;
	elem.attachments.font[2]+="px";
	context.font=elem.attachments.font.join(" ");
	elem.attachments.canva=canva;

	context.fillStyle=elem.attachments.background;
	context.fillRect(0, 0, width, height);

	context.fillStyle=elem.attachments.color;
	fillText(elem.attachments.text.split("\\n"), context, elem);
	canva.toBlob(function(blob) {
		const url = URL.createObjectURL(blob);
		elem[attachWith[elem.attachments.types]]=url;
		detach(elem);
	});
}

// EXPOSE
window.placeholder=placeholder;
})(Snizzle);