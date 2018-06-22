$(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".header");
    var $menu = $(".main-menu");
    var $loader = $(".preloader");
    var $thanks = $("#thanks");
    var headerHeight = 82;

    var utms = parseGET();

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    // $wnd.on('load', function() {        
    //     $loader.fadeOut('slow');            
    // });

    $wnd.scroll(function() { onscroll(); });

    var onscroll = function() {
        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        if($wnd.scrollTop() > 0) {
            $header.addClass('inverse');
        } else {
            $header.removeClass('inverse');
        }

        var scrollPos = $wnd.scrollTop() + 83;

        $menu.find(".link").each(function() {
            var link = $(this);
            var id = link.attr('href');
            var section = $(id);
            
            if(section && section.length > 0) {
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

    onscroll();

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $(".hamburger").click(function() {
        $this = $(this);

        if(!$this.hasClass("is-active")) {
            $this.addClass('is-active');
            $menu.slideDown('700');
        } else {
            $this.removeClass('is-active');
            $menu.slideUp('700');
        }

        return false;
    });  

    $(".main-menu .link").click(function(e) {
        var $href = $(this).attr('href');

        if($href.length > 0 && $($href) && $($href).length > 0) {
            e.preventDefault();
            var top = $($href).offset().top - headerHeight;
            $html.stop().animate({ scrollTop: top }, "slow", "swing");
        }
    });

    $(".modal-open").click(function() {
        var id = $(this).data('id');
        var $dialog = $('#'+id);        

        $dialog.fadeIn(500);
        return false;
    });

    $(".modal").click(function() {
        var $modal = $(this);
        closeModal($modal);
    });

    $(".modal-content").click(function(e) {
        e.stopPropagation();
    });

    $(".modal-close").click(function() {
        var $modal = $(this).closest('.modal');
        closeModal($modal);
    });

    function closeModal($modal) {
        $modal.fadeOut(500);

        var $form = $modal.find('form');
        if($form.length > 0) $form[0].reset();

        var $phone = $form.find('.phone');
        if($phone.length > 0) $phone.removeClass('error');
    }

    $(".form-submit").click(function(e) {
        e.preventDefault();
        
        var $form = $(this).closest('form');
        var $requireds = $form.find(':required');
        var formValid = true;

        $requireds.each(function() {
            $elem = $(this);

            if(!$elem.val() || !checkInput($elem)) {
                $elem.addClass('error');
                formValid = false;
            }
        });

        var data = $form.serialize();

        if(Object.keys(utms).length > 0) {
            for(var key in utms) {
                data += '&' + key + '=' + utms[key];
            }
        } else {
            data += '&utm=Прямой переход'
        } 

        if(formValid) {
            $.ajax({
                type: "POST",
                url: "/mail.php",
                data: data
            }).done(function() {                
            });

            $(this).closest('.modal').fadeOut(500);
            $requireds.removeClass('error');
            $form[0].reset();
            window.location = '/thanks.html';
            // $thanks.fadeIn(500);
        }
    });

    $(".phone").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    });    

    var categoryTitle = "";
    var categoryId = 1;
    var catalogId = 1; 
    var catalogs = [];

    var carousel = $(".carousel-catalog");
    carousel.owlCarousel();

    $(".category").click(function() {
        $(".category").removeClass("active");
        $(this).addClass("active");
         
        categoryId = $(this).data('id');
        catalogId = 1;
        createCatalogs();
        createCarousel();
    });

    function createCatalogs() {
        catelogs = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].id === categoryId) {
                categoryTitle = data[i].title;
                catalogs = data[i].catalogs;
                break;
            }
        }

        var catalogHtml = '';
        for (var i = 0; i < catalogs.length; i++) {
            catalogHtml += '<div class="catalog ' + (catalogId === catalogs[i].id ? 'active' : '') + '" data-id="' + catalogs[i].id + '">' + catalogs[i].title + '</div>';
        }
        $(".catalogs").html(catalogHtml);

        $(".catalog").click(function() {
            catalogId = $(this).data("id");
            $(".catalog").removeClass('active');
            $(this).addClass('active');
            createCarousel();
        });
    }

    function createCarousel() {
        carousel.data('owl.carousel').destroy();
        var galleryHtml = '';

        for (var i = 0; i < catalogs.length; i++) {
            if(catalogs[i].id === catalogId) {
                for (var j = 1; j <= catalogs[i].imageCount; j++) {
                    var imageSrc = "./img/catalogs/" + categoryTitle + "/" + catalogs[i].title + "/mini/" + j + ".jpg";
                    var link = "./img/catalogs/" + categoryTitle + "/" + catalogs[i].title + "/" + j + ".jpg";                    
                    galleryHtml += '<div class="carousel-catalog-item"><div class="carousel-catalog-image"><a href="' + link + '" data-fancybox="catalogGallery"><img src="' + imageSrc + '" alt=""></a></div><button class="button modal-open" data-id="application">Хочу также</button></div>';
                }
                break;
            }
        }

        carousel.html(galleryHtml);
        carousel.owlCarousel({
            nav: true,
            dots: false,
            loop: false,
            smartSpeed: 500,
            // autoplay: true,
            // autoplayTimeout: 2000,
            margin: 30,
            navText: ['', ''],
            responsive: {
                0: { items: 1 },
                768: { items: 2 },        
                992: { items: 3 },
            },
        });

        $(".modal-open").click(function() {
            var id = $(this).data('id');
            var $dialog = $('#'+id);        
    
            $dialog.fadeIn(500);
            return false;
        });
    }

    if(carousel && carousel.length > 0) {
        createCatalogs();
        createCarousel();
    }

    $("input:required, textarea:required").keyup(function() {
        var $this = $(this);
        if(!$this.hasClass('phone')) {
            checkInput($this);
        }
    });    

    $(".carousel-reviews").owlCarousel({
        items: 1,
        nav: false,
        dots: true,
        loop: true,
        smartSpeed: 500,
        autoplay: true,
        autoplayTimeout: 10000,
        margin: 60,
        navText: ['', ''],
    });        

    

    $(".carousel-izdelie").owlCarousel({
        nav: true,
        dots: false,
        loop: true,
        smartSpeed: 500,
        autoplay: true,
        autoplayTimeout: 10000,
        margin: 30,
        navText: ['', ''],
        onChanged: function(e) {
            var $gallery = $(this)[0].$element;
            $gallery.find('.izdelie-image').equalHeights();            
        },
        responsive: {
            0: { items: 1 },
            768: { items: 2 },        
            992: { items: 3 },
        },
    });


});

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    

function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};