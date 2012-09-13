/* Dialog plugin by Dragan Stefanov */
(function($){
	var defaults = {
        title           : null,
        text            : null,
		position        : "center",
        tmpl_url        : null,
        on_tmpl_load    : null,
		width		    : 400,
		height		    : null,
		margin 		    : 10,
		delay		    : 400,
		
		dialog 		        : false,
		confirm_label	    : "Yes",
		cancel_label	    : "Cancel",
		confirm_function 	: null
		
	};
	var settings = {};
	var parent;
	var sah_window;	
	
	var methods = {
        init : function( options ) {

                settings = $.extend({}, defaults, options);
                parent = this;

                methods.addListeners();

                methods.create();

        },

        create: function(){

            // destroy prev created dialogs
            methods.destroy();

            sah_window = $('<div></div>', {
                id: "boo_window"
            });

            sah_window.css({

                width		: settings.width,
                display : 'none'

            });

            if(settings.height){
                sah_window.css({
                    height	: settings.height
                });
            }

            // append content

            if(settings.title){
                var boo_title = $('<h1></h1>', {text: settings.title}).appendTo(sah_window);
            }

            if(settings.text){
                var boo_text = $('<p></p>', {text: settings.text}).appendTo(sah_window);
            }

            var content = $('<div></div>', {id: "boo_window_content"}).appendTo(sah_window);

            if(settings.tmpl_url){
                var fetch_html = methods.fetch(settings.tmpl_url);

                fetch_html.done(function(html){
                    $.template('html', html);
                    var my_html = $.tmpl('html');
                    content.append(my_html);
                    sah_window.appendTo(parent);
                    methods.setPosition(parent, sah_window, settings.position);
                    if(settings.on_tmpl_load){
                        settings.on_tmpl_load();
                    }
                });
            } else {
                sah_window.appendTo(parent);
                methods.setPosition(parent, sah_window, settings.position);
            }

            // append close button
            $('<a></a>', {href: "#", text: "close", id: "boo_window_close"}).appendTo(sah_window).on('click', function(e){ e.preventDefault(); methods.destroy(); });

            // dialog functions
            if(settings.dialog === true){

                var dialog_buttons = $('<div></div>', {id: 'dialog_buttons'});

                if(settings.confirm_function){
                    $('<button class="btn btn-danger">'+settings.confirm_label+'</button>', {text: settings.confirm_label}).appendTo(dialog_buttons).on('click', function(){settings.confirm_function()});
                }

                $('<button class="btn">'+settings.cancel_label+'</button>', {text: settings.cancel_label}).appendTo(dialog_buttons).on('click', function(){methods.destroy();});

                dialog_buttons.insertAfter(content);

            }

            sah_window.fadeIn(settings.delay);

        },

        fetch: function(url, data, type, dataType){
            return $.ajax({
                type: 'post',
                url: url
            }).promise();
        },

        destroy: function() {
            if(sah_window){
                sah_window.fadeOut(settings.delay, function(){
                    $(this).remove();
                });
            }

        },

        setPosition: function(parent, obj, position){ // topleft, topright, topcenter, centerleft, center, centerright, bottomleft, bottomcenter, bottomright

            var parentWidth = parent.width();
            var parentHeight = parent.height();

            var objWidth = obj.width();
            var objHeight = obj.height();

            var top = 'none', bottom = 'none', left = 'none', right = 'none';
            var margin = settings.margin;

            switch(position){

                case 'topleft':

                    top = margin;
                    left = margin;
                    break;

                case 'topright':

                    top = margin;
                    right = margin;
                    break;

                case 'topcenter':

                    top = margin;
                    left = parentWidth/2 - objWidth/2;
                    break;

                case 'centerleft':

                    top = parentHeight/2 - objHeight/2;
                    left = margin;
                    break;

                case 'centerright':

                    top = parentHeight/2 - objHeight/2;
                    right = margin;
                    break;

                case 'center':

                    top = parentHeight/2 - objHeight/2;
                    left = parentWidth/2 - objWidth/2;

                    break;

                case 'bottomleft':

                    left = margin;
                    bottom = margin;
                    break;

                case 'bottomright':

                    bottom = margin;
                    right = margin;
                    break;

                case 'bottomcenter':

                    left = parentWidth/2 - objWidth/2;
                    bottom = 0;
                    top = 'none';
                    break;

                default:
                    top = 0;
                    left = 0;
            }

            if (top < 50){
                top = 50
            }

            obj.css({
                'top' 		: top,
                'left' 		: left,
                'right' 	: right,
                'bottom' 	: bottom,
                'position' 	: 'absolute'
            });

        },

        addListeners: function(){
            parent.on('close_window', function(){
                methods.destroy();
            })
        }

    };

  $.fn.booDialog = function( method ) {
    
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist on jQuery.booDialog' );
    }    
  
  };

})(jQuery);