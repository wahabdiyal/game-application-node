jQuery(document).ready(function () {
    // use sctict mode js
    "use strict";
   jQuery(function($){
        var delay = 40;
        $(".progress-bar").each(function(i){
            $(this).delay( delay*i ).animate( { width: $(this).attr('aria-valuenow') + '%' }, delay );
        });
    });

    $('#menu1').metisMenu({
       
    });
   


    jQuery(function($){
       
        var url = window.location;
        var element = $('ul.metismenu a').filter(function() {
            return this.href == url || url.href.indexOf(this.href) == 0;
        }).addClass('active').parent().parent().addClass('in').parent();
        if (element.is('li')) {
            element.addClass('active');
        }
    });

    /*================================
    Start Footer resizer
    ==================================*/

    $('#sidebarCollapse').on('click', function() {
        $('.page-container').toggleClass('sbar_collapsed');
    });


    jQuery(function($){
        var e = function() {
            var e = (window.innerHeight > 0 ? window.innerHeight : this.screen.height) - 5;
            (e -= 67) < 1 && (e = 1), e > 67 && $(".main-content").css("min-height", e + "px")
        };
        $(window).ready(e), $(window).on("resize", e);
    });

   jQuery(function($){
        $('[data-toggle="tooltip"]').tooltip();
        $('#sidebarCollapse, .close-btn').on('click', function() {
            $('#sidebar').toggleClass('active');
        });

    });

    jQuery('.faq__accordian-heading').on('click', function(e) {
        e.preventDefault();
        if (!jQuery(this).hasClass('active')) {
            jQuery('.faq__accordian-heading').removeClass('active');
            jQuery('.faq__accordion-content').slideUp(500);
            jQuery(this).addClass('active');
            jQuery(this).next('.faq__accordion-content').slideDown(500);
        }
        else if (jQuery(this).hasClass('active')) {
            jQuery(this).removeClass('active');
            jQuery(this).next('.faq__accordion-content').slideUp(500);
        }
    });     

});





    

