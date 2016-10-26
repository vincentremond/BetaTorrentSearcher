/**
* jQuery PostBlank Plugin v1.0.0
*
* Copyright 2011, pac1250@gmail.com
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*/
(function($) {
    $.postblank = function(params) {
		// default values
		params = $.extend( {method: 'POST', action: document.location.href, target: '_blank', enctype: 'application/x-www-form-urlencoded', data: {}}, params);
		//
		var form = $('<form id="jQueryPostBlankPluginForm"></form>').appendTo('body');
		for(param in params)
			if (param != 'data')
				form.attr(param, params[param]);
		for(name in params.data)
			$('<input type="hidden" />').appendTo('#jQueryPostBlankPluginForm').attr('name', name).attr('value', params.data[name]);
		form.submit().remove();
		return this;
	}
	$.fn.postblank = $.postblank;
})(jQuery);
