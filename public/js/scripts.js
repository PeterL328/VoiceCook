function initializeJS() {

    //tool tips
    jQuery('.tooltips').tooltip();

    //popovers
    jQuery('.popovers').popover();

    //custom scrollbar
        //for html
    jQuery("html").niceScroll({styler:"fb",cursorcolor:"#007AFF", cursorwidth: '6', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: '', zindex: '1000'});
        //for sidebar
    jQuery("#sidebar").niceScroll({styler:"fb",cursorcolor:"#007AFF", cursorwidth: '3', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: ''});
        // for scroll panel
    jQuery(".scroll-panel").niceScroll({styler:"fb",cursorcolor:"#007AFF", cursorwidth: '3', cursorborderradius: '10px', background: '#F7F7F7', cursorborder: ''});
    
    //sidebar dropdown menu
    jQuery('#sidebar .sub-menu > a').click(function () {
        var last = jQuery('.sub-menu.open', jQuery('#sidebar'));        
        jQuery('.menu-arrow').removeClass('arrow_carrot-right');
        jQuery('.sub', last).slideUp(200);
        var sub = jQuery(this).next();
        if (sub.is(":visible")) {
            jQuery('.menu-arrow').addClass('arrow_carrot-right');            
            sub.slideUp(200);
        } else {
            jQuery('.menu-arrow').addClass('arrow_carrot-down');            
            sub.slideDown(200);
        }
        var o = (jQuery(this).offset());
        diff = 200 - o.top;
        if(diff>0)
            jQuery("#sidebar").scrollTo("-="+Math.abs(diff),500);
        else
            jQuery("#sidebar").scrollTo("+="+Math.abs(diff),500);
    });

    // sidebar menu toggle
    jQuery(function() {
        function responsiveView() {
            var wSize = jQuery(window).width();
            if (wSize <= 768) {
                jQuery('#container').addClass('sidebar-close');
                jQuery('#sidebar > ul').hide();
                jQuery('.button-one').css({'margin-left': '-100px'});
                jQuery('.button-two').css({'margin-left': '-100px'});
            }

            if (wSize > 768) {
                jQuery('#container').removeClass('sidebar-close');
                jQuery('#sidebar > ul').show();
                jQuery('#sidebar').animate({'margin-left':"0px"}, 500 );
                jQuery('.button-one').css({'margin-left': '-10px'});
                jQuery('.button-one').css({'margin-top': '-200px'});
                jQuery('.button-two').css({'margin-left': '-10px'});
                jQuery('.button-two').css({'margin-top': '50px'});
            }
        }
        jQuery(window).on('load', responsiveView);
        jQuery(window).on('resize', responsiveView);
    });

    jQuery('.toggle-nav').click(function () {
        if (jQuery('#sidebar > ul').is(":visible") === true) {
            jQuery('#main-content').css({
                'margin-left': '0px'
            });
            if (jQuery(window).width() > 768) {
                jQuery('.button-one').animate({'margin-left': '-100px'}, 500);
                jQuery('.button-one').css({'margin-top': '-200px'});
                jQuery('.button-two').animate({'margin-left': '-100px'}, 500);
                jQuery('.button-two').css({'margin-top': '50px'});
            }
            // jQuery('#sidebar').css({
            //     'margin-left': '-180px'
            // });
            jQuery('#sidebar').animate({'margin-left':"-180px"}, 500 );
            jQuery('#sidebar > ul').hide();
            jQuery("#container").addClass("sidebar-closed");
        } else {
            jQuery('#main-content').css({
                'margin-left': '180px'
            });
            if (jQuery(window).width() > 768) {
                jQuery('.button-one').animate({'margin-left': '-10px'}, 500);
                jQuery('.button-two').animate({'margin-left': '-10px'}, 500);
            }
            // else
            // {
            //     jQuery('.button-one').css({'margin-top': '100px'});
            //     jQuery('.button-two').css({'margin-top': '350px'});
            // }
            jQuery('#sidebar > ul').show();
            // jQuery('#sidebar').css({
            //     'margin-left': '0'
            // });
            jQuery('#sidebar').animate({'margin-left':"0px"}, 500 );
            jQuery("#container").removeClass("sidebar-closed");

        }
    });

    //bar chart
    if (jQuery(".custom-custom-bar-chart")) {
        jQuery(".bar").each(function () {
            var i = jQuery(this).find(".value").html();
            jQuery(this).find(".value").html("");
            jQuery(this).find(".value").animate({
                height: i
            }, 2000)
        })
    }

}

jQuery(document).ready(function(){
    initializeJS();
});