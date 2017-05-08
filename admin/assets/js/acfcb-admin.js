var bind_cb_width = function(block){

	if(!block.is('[data-layout^="acfcb_block_"]')) // Maybe also exclude clones
		return null;

	var handle_input = block.find('[data-name$="_block_handle"] .acf-input input[type="text"]');
	
	var width_input = block.find('[data-name$="_block_width"] .acf-input input[type="number"]');
	var proxy 		= jQuery('<input class="proxy-width" type="number" val="100">');

	width_input.parents('.acf-field').eq(0).css('display', 'none');
	handle_input.parents('.acf-field').eq(0).css('display', 'none');

	proxy
	.val(width_input.val())
	.attr({
		'min': width_input.attr('min'),
		'max': width_input.attr('max'),
		'step': width_input.attr('step'),
	})
	.change(function(){
		width_input.val(proxy.val()).change()
	})

	var handle 		= block.find('.acf-fc-layout-handle');
	var acf_fields 	= block.find('.acf-fields');
	var overlay 	= acf_fields.find('.acf-overlay')

	//handle.text(handle_input.val())

	if(overlay.length < 1){
		var overlay 	= jQuery('<div class="acf-overlay"></div>');
		overlay
		.appendTo(acf_fields)
	}

	var hide_cb_box = function(callback){

		overlay
		.animate({opacity: 0, width: '100%'}, 200, function(){
				//overlay.removeAttr('style')
		});

		acf_fields
		.animate({'right': '-100%'}, 200, function(){
			//acf_fields.removeAttr('style');
			callback()
		});
	}

	acf_fields
	.addClass('float')

	var proxy_input = jQuery('<div class="proxy-wrapper acf-input"><div class="acf-input-append">columns</div><div class="acf-input-wrap"></div></div>')
	
	
	proxy_input
	.find('.acf-input-wrap')
	.prepend(proxy)

	proxy_input
	.prependTo(block);
	
	overlay
	.click(function(){
		
		hide_cb_box(function(){
			handle.click();
		});

	});

	handle.click(function(){

		if(!block.hasClass('-collapsed'))
			return null;

		overlay
		.animate({opacity: 1, width: '30%'}, 200);

		acf_fields
		.animate({'right': '0%'}, 200)

	})

	acf_fields.on("keypress", function(e) {
            /* ENTER PRESSED*/
            if(!block.hasClass('-collapsed') && e.keyCode == 13) {
            	hide_cb_box(function(){
            		handle.click()
            	});
                e.stopPropagation();
                e.preventDefault()
            }
        });

	width_input.change(function(){

		var val 	= parseInt(width_input.val());
		var width 	= val * (100/12);
		
		var offset  = 10;
		
		if(val > 10)
			offset = 15;

		if(val < 8)
			offset = 12;

		block.css('width', 'calc('+width+'% - '+offset+'px)')
	})
	.change()

	if(!block.hasClass('-collapsed')){
		handle
		.click();
	}

	hide_cb_box(function(){});


}

acf.add_action('append', function($el){
	bind_cb_width($el);
});


jQuery(document).ready(function($) {
	
	var blocks = $('.acf-field .layout');
	blocks.each(function(k, block){
		var block = $(block);
		bind_cb_width(block);
	})

});