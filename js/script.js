"use strict";
$(document).ready(function () {
    var userAgent = navigator.userAgent.toLowerCase(),
        initialDate = new Date(),
        $document = $(document),
        $window = $(window),
        $html = $("html"),
        isDesktop = $html.hasClass("desktop"),
        isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouch = "ontouchstart" in window,
        plugins = {
            pointerEvents: isIE < 11 ? "js/pointer-events.min.js" : false,
            bootstrapTooltip: $("[data-toggle='tooltip']"),
            rdNavbar: $(".rd-navbar"),
            owl: $(".owl-carousel"),
            swiper: $(".swiper-slider"),
            counter: $(".counter"),
            mfp: $('[data-lightbox]').not('[data-lightbox="gallery"] [data-lightbox]'),
            mfpGallery: $('[data-lightbox^="gallery"]'),
            progressBar: $(".progress-linear"),
            dateCountdown: $('.DateCountdown'),
            viewAnimate: $('.view-animate'),
            rdInputLabel: $(".form-label"),
            customToggle: $('[data-custom-toggle]'),
            rdMailForm: $(".rd-mailform"),
            regula: $("[data-constraints]")
        };
    var isNoviBuilder = window.xMode;

    function getSwiperHeight(object, attr) {
        var val = object.attr("data-" + attr),
            dim;
        if(!val) {
            return undefined;
        }
        dim = val.match(/(px)|(%)|(vh)$/i);
        if(dim.length) {
            switch(dim[0]) {
            case "px":
                return parseFloat(val);
            case "vh":
                return $(window).height() * (parseFloat(val) / 100);
            case "%":
                return object.width() * (parseFloat(val) / 100);
            }
        } else {
            return undefined;
        }
    }

    function isScrolledIntoView(elem) {
        var $window = $(window);
        return elem.offset().top + elem.outerHeight() >= $window.scrollTop() && elem.offset().top <= $window.scrollTop() + $window.height();
    }

    function lazyInit(element, func) {
        var $win = jQuery(window);
        $win.on('load scroll', function () {
            if((!element.hasClass('lazy-loaded') && (isScrolledIntoView(element)))) {
                func.call();
                element.addClass('lazy-loaded');
            }
        });
    }

    function attachFormValidator(elements) {
        for(var i = 0; i < elements.length; i++) {
            var o = $(elements[i]),
                v;
            o.addClass("form-control-has-validation").after("<span class='form-validation'></span>");
            v = o.parent().find(".form-validation");
            if(v.is(":last-child")) {
                o.addClass("form-control-last-child");
            }
        }
        elements.on('input change propertychange blur', function (e) {
            var $this = $(this),
                results;
            if(e.type != "blur") {
                if(!$this.parent().hasClass("has-error")) {
                    return;
                }
            }
            if($this.parents('.rd-mailform').hasClass('success')) {
                return;
            }
            if((results = $this.regula('validate')).length) {
                for(i = 0; i < results.length; i++) {
                    $this.siblings(".form-validation").text(results[i].message).parent().addClass("has-error")
                }
            } else {
                $this.siblings(".form-validation").text("").parent().removeClass("has-error")
            }
        }).regula('bind');
    }

    function isValidated(elements) {
        var results, errors = 0;
        if(elements.length) {
            for(j = 0; j < elements.length; j++) {
                var $input = $(elements[j]);
                if((results = $input.regula('validate')).length) {
                    for(k = 0; k < results.length; k++) {
                        errors++;
                        $input.siblings(".form-validation").text(results[k].message).parent().addClass("has-error");
                    }
                } else {
                    $input.siblings(".form-validation").text("").parent().removeClass("has-error")
                }
            }
            return errors === 0;
        }
        return true;
    }
    var o = $("#copyright-year");
    if(o.length) {
        o.text(initialDate.getFullYear());
    }

    function initBootstrapTooltip(tooltipPlacement) {
        if(!isNoviBuilder) {
            if(window.innerWidth < 599) {
                plugins.bootstrapTooltip.tooltip('destroy');
                plugins.bootstrapTooltip.tooltip({
                    placement: 'bottom'
                });
            } else {
                plugins.bootstrapTooltip.tooltip('destroy');
                plugins.bootstrapTooltip.tooltipPlacement;
                plugins.bootstrapTooltip.tooltip();
            }
        }
    }
    if(isIE) {
        if(isIE < 10) {
            $html.addClass("lt-ie-10");
        }
        if(isIE < 11) {
            if(plugins.pointerEvents) {
                $.getScript(plugins.pointerEvents).done(function () {
                    $html.addClass("ie-10");
                    PointerEventsPolyfill.initialize({});
                });
            }
        }
        if(isIE === 11) {
            $("html").addClass("ie-11");
        }
        if(isIE === 12) {
            $("html").addClass("ie-edge");
        }
    }
    if(plugins.bootstrapTooltip.length) {
        var tooltipPlacement = plugins.bootstrapTooltip.attr('data-placement');
        initBootstrapTooltip(tooltipPlacement);
        $(window).on('resize orientationchange', function () {
            initBootstrapTooltip(tooltipPlacement);
        })
    }
    if(plugins.progressBar.length) {
        for(i = 0; i < plugins.progressBar.length; i++) {
            var progressBar = $(plugins.progressBar[i]);
            $window.on("scroll load", $.proxy(function () {
                var bar = $(this);
                if(!bar.hasClass('animated-first') && isScrolledIntoView(bar)) {
                    var end = bar.attr("data-to");
                    bar.find('.progress-bar-linear').css({
                        width: end + '%'
                    });
                    bar.find('.progress-value').countTo({
                        refreshInterval: 40,
                        from: 0,
                        to: end,
                        speed: 500
                    });
                    bar.addClass('animated-first');
                }
            }, progressBar));
        }
    }
    if(plugins.mfp.length > 0 || plugins.mfpGallery.length > 0 && !isNoviBuilder) {
        if(plugins.mfp.length) {
            for(i = 0; i < plugins.mfp.length; i++) {
                var mfpItem = plugins.mfp[i];
                $(mfpItem).magnificPopup({
                    type: mfpItem.getAttribute("data-lightbox")
                });
            }
        }
        if(plugins.mfpGallery.length) {
            for(i = 0; i < plugins.mfpGallery.length; i++) {
                var mfpGalleryItem = $(plugins.mfpGallery[i]).find('[data-lightbox]');
                for(var c = 0; c < mfpGalleryItem.length; c++) {
                    $(mfpGalleryItem).addClass("mfp-" + $(mfpGalleryItem).attr("data-lightbox"));
                }
                mfpGalleryItem.end().magnificPopup({
                    delegate: '[data-lightbox]',
                    type: "image",
                    gallery: {
                        enabled: true
                    }
                });
            }
        }
    }
    if(plugins.dateCountdown.length) {
        for(i = 0; i < plugins.dateCountdown.length; i++) {
            var dateCountdownItem = $(plugins.dateCountdown[i]),
                time = {
                    "Days": {
                        "text": "Days",
                        "color": "#ffffff",
                        "show": true
                    },
                    "Hours": {
                        "text": "Hours",
                        "color": "#ffffff",
                        "show": true
                    },
                    "Minutes": {
                        "text": "Minutes",
                        "color": "#ffffff",
                        "show": true
                    },
                    "Seconds": {
                        "text": "Seconds",
                        "color": "#ffffff",
                        "show": true
                    }
                };
            dateCountdownItem.TimeCircles({
                "animation": "smooth",
                "bg_width": 0.5,
                "fg_width": 0.02,
                "circle_bg_color": dateCountdownItem.attr('data-bg') ? dateCountdownItem.attr('data-bg') : "rgba(255,255,255,.39)",
                "time": time
            });
            $(window).on('load resize orientationchange', (function ($dateCountdownItem, time) {
                return function () {
                    if(window.innerWidth < 479) {
                        $dateCountdownItem.TimeCircles({
                            time: {
                                Minutes: {
                                    show: true
                                },
                                Seconds: {
                                    show: false
                                }
                            }
                        }).rebuild();
                    } else if(window.innerWidth < 767) {
                        $dateCountdownItem.TimeCircles({
                            time: {
                                Seconds: {
                                    show: false
                                }
                            }
                        }).rebuild();
                    } else {
                        $dateCountdownItem.TimeCircles({
                            time: time
                        }).rebuild();
                    }
                }
            })($(dateCountdownItem), time));
        }
    }
    if(isDesktop && !isNoviBuilder) {
        $().UItoTop({
            easingType: 'easeOutQuart',
            containerClass: 'ui-to-top fa fa-angle-up'
        });
    }
    if(plugins.rdNavbar.length) {
        plugins.rdNavbar.RDNavbar({
            stickUpClone: (plugins.rdNavbar.attr("data-stick-up-clone") && !isNoviBuilder) ? plugins.rdNavbar.attr("data-stick-up-clone") === 'true' : false,
            responsive: {
                0: {
                    stickUp: plugins.rdNavbar.attr("data-stick-up") ? (!isNoviBuilder ? plugins.rdNavbar.attr("data-stick-up") === 'true' : false) : !isNoviBuilder
                },
                768: {
                    stickUp: plugins.rdNavbar.attr("data-sm-stick-up") ? (!isNoviBuilder ? plugins.rdNavbar.attr("data-sm-stick-up") === 'true' : false) : !isNoviBuilder
                },
                992: {
                    stickUp: plugins.rdNavbar.attr("data-md-stick-up") ? (!isNoviBuilder ? plugins.rdNavbar.attr("data-md-stick-up") === 'true' : false) : !isNoviBuilder
                },
                1200: {
                    stickUp: plugins.rdNavbar.attr("data-lg-stick-up") ? (!isNoviBuilder ? plugins.rdNavbar.attr("data-lg-stick-up") === 'true' : false) : !isNoviBuilder
                }
            }
        });
        if(plugins.rdNavbar.attr("data-body-class")) {
            document.body.className += ' ' + plugins.rdNavbar.attr("data-body-class");
        }
        setTimeout(function () {
            $window.trigger('resize');
        }, 10);
    }
    if(plugins.swiper.length) {
        var i;
        for(i = 0; i < plugins.swiper.length; i++) {
            var s = $(plugins.swiper[i]);
            var pag = s.find(".swiper-pagination"),
                next = s.find(".swiper-button-next"),
                prev = s.find(".swiper-button-prev"),
                bar = s.find(".swiper-scrollbar"),
                parallax = s.parents('.rd-parallax').length,
                swiperSlide = s.find(".swiper-slide");
            for(j = 0; j < swiperSlide.length; j++) {
                var $this = $(swiperSlide[j]),
                    url;
                if(url = $this.attr("data-slide-bg")) {
                    $this.css({
                        "background-image": "url(" + url + ")",
                        "background-size": "cover"
                    })
                }
            }
            swiperSlide.end().find("[data-caption-animate]").addClass("not-animated").end().swiper({
                autoplay: s.attr('data-autoplay') && s.attr('data-autoplay') === "true",
                direction: s.attr('data-direction') ? s.attr('data-direction') : "horizontal",
                effect: s.attr('data-slide-effect') ? s.attr('data-slide-effect') : "slide",
                speed: s.attr('data-slide-speed') ? s.attr('data-slide-speed') : 600,
                keyboardControl: s.attr('data-keyboard') === "true",
                mousewheelControl: s.attr('data-mousewheel') === "true",
                mousewheelReleaseOnEdges: s.attr('data-mousewheel-release') === "true",
                nextButton: next.length ? next.get(0) : null,
                prevButton: prev.length ? prev.get(0) : null,
                pagination: pag.length ? pag.get(0) : null,
                simulateTouch: false,
                paginationClickable: pag.length ? pag.attr("data-clickable") !== "false" : false,
                paginationBulletRender: pag.length ? pag.attr("data-index-bullet") === "true" ? function (index, className) {
                    return '<span class="' + className + '">' + (index + 1) + '</span>';
                } : null : null,
                scrollbar: bar.length ? bar.get(0) : null,
                scrollbarDraggable: bar.length ? bar.attr("data-draggable") !== "false" : true,
                scrollbarHide: bar.length ? bar.attr("data-draggable") === "false" : false,
                loop: s.attr('data-loop') === "true",
                onInit: function (swiper) {
                    var swiperParalax = s.find(".swiper-parallax");
                    for(var k = 0; k < swiperParalax.length; k++) {
                        var $this = $(swiperParalax[k]),
                            speed;
                        if(parallax && !isIEBrows && !isMobile) {
                            if(speed = $this.attr("data-speed")) {
                                makeParallax($this, speed, s, false);
                            }
                        }
                    }
                    $(window).on('resize', function () {
                        swiper.update(true);
                    })
                }
            });
            $(window).on("resize", function () {
                var mh = getSwiperHeight(s, "min-height"),
                    h = getSwiperHeight(s, "height");
                if(h) {
                    s.css("height", mh ? mh > h ? mh : h : h);
                }
            }).trigger("resize");
        }
    }
    if(plugins.owl.length) {
        var i;
        for(i = 0; i < plugins.owl.length; i++) {
            var c = $(plugins.owl[i]),
                responsive = {};
            var aliaces = ["-", "-xs-", "-sm-", "-md-", "-lg-"],
                values = [0, 480, 768, 992, 1200],
                j, k;
            for(j = 0; j < values.length; j++) {
                responsive[values[j]] = {};
                for(k = j; k >= -1; k--) {
                    if(!responsive[values[j]]["items"] && c.attr("data" + aliaces[k] + "items")) {
                        responsive[values[j]]["items"] = k < 0 ? 1 : parseInt(c.attr("data" + aliaces[k] + "items"), 10);
                    }
                    if(!responsive[values[j]]["stagePadding"] && responsive[values[j]]["stagePadding"] !== 0 && c.attr("data" + aliaces[k] + "stage-padding")) {
                        responsive[values[j]]["stagePadding"] = k < 0 ? 0 : parseInt(c.attr("data" + aliaces[k] + "stage-padding"), 10);
                    }
                    if(!responsive[values[j]]["margin"] && responsive[values[j]]["margin"] !== 0 && c.attr("data" + aliaces[k] + "margin")) {
                        responsive[values[j]]["margin"] = k < 0 ? 30 : parseInt(c.attr("data" + aliaces[k] + "margin"), 10);
                    }
                }
            }
            if(c.attr('data-dots-custom')) {
                c.on("initialized.owl.carousel", function (event) {
                    var carousel = $(event.currentTarget),
                        customPag = $(carousel.attr("data-dots-custom")),
                        active = 0;
                    if(carousel.attr('data-active')) {
                        active = parseInt(carousel.attr('data-active'));
                    }
                    carousel.trigger('to.owl.carousel', [active, 300, true]);
                    customPag.find("[data-owl-item='" + active + "']").addClass("active");
                    customPag.find("[data-owl-item]").on('click', function (e) {
                        e.preventDefault();
                        carousel.trigger('to.owl.carousel', [parseInt(this.getAttribute("data-owl-item"), 10), 300, true]);
                    });
                    carousel.on("translate.owl.carousel", function (event) {
                        customPag.find(".active").removeClass("active");
                        customPag.find("[data-owl-item='" + event.item.index + "']").addClass("active")
                    });
                });
            }
            c.owlCarousel({
                autoplay: c.attr("data-autoplay") === "true",
                loop: isNoviBuilder ? false : c.attr("data-loop") !== "false",
                items: 1,
                dotsContainer: c.attr("data-pagination-class") || false,
                navContainer: c.attr("data-navigation-class") || false,
                mouseDrag: isNoviBuilder ? false : c.attr("data-mouse-drag") !== "false",
                nav: c.attr("data-nav") === "true",
                dots: c.attr("data-dots") === "true",
                dotsEach: c.attr("data-dots-each") ? parseInt(c.attr("data-dots-each"), 10) : false,
                animateOut: c.attr("data-animation-out") || false,
                responsive: responsive,
                navText: []
            });
        }
    }
    if(plugins.counter.length) {
        var i;
        for(i = 0; i < plugins.counter.length; i++) {
            var counterNotAnimated = plugins.counter.not(".animated");
            $window.on("scroll load", function () {
                for(i = 0; i < counterNotAnimated.length; i++) {
                    var counterNotAnimatedItem = $(counterNotAnimated[i]);
                    if((!counterNotAnimatedItem.hasClass("animated")) && (isScrolledIntoView(counterNotAnimatedItem))) {
                        counterNotAnimatedItem.countTo({
                            refreshInterval: 40,
                            speed: counterNotAnimatedItem.attr("data-speed") || 1000
                        });
                        counterNotAnimatedItem.addClass('animated');
                    }
                }
            });
        }
    }
    if(isDesktop && $html.hasClass("wow-animation") && $(".wow").length) {
        new WOW().init();
    }
    if(plugins.rdInputLabel.length) {
        plugins.rdInputLabel.RDInputLabel();
    }
    if(plugins.regula.length) {
        attachFormValidator(plugins.regula);
    }
    if(plugins.rdMailForm.length) {
        var i, j, k, msg = {
            'MF000': 'Successfully sent!',
            'MF001': 'Recipients are not set!',
            'MF002': 'Form will not work locally!',
            'MF003': 'Please, define email field in your form!',
            'MF004': 'Please, define type of your form!',
            'MF254': 'Something went wrong with PHPMailer!',
            'MF255': 'Aw, snap! Something went wrong.'
        };
        for(i = 0; i < plugins.rdMailForm.length; i++) {
            var $form = $(plugins.rdMailForm[i]);
            $form.attr('novalidate', 'novalidate').ajaxForm({
                data: {
                    "form-type": $form.attr("data-form-type") || "contact",
                    "counter": i
                },
                beforeSubmit: function () {
                    if(!isNoviBuilder) {
                        var form = $(plugins.rdMailForm[this.extraData.counter]);
                        var inputs = form.find("[data-constraints]");
                        if(isValidated(inputs)) {
                            var output = $("#" + form.attr("data-form-output"));
                            if(output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle fa fa-circle-o-notch fa-spin icon-xs"></span><span>Sending</span></p>');
                                output.addClass("active");
                            }
                        } else {
                            return false;
                        }
                    }
                },
                error: function (result) {
                    if(!isNoviBuilder) {
                        var output = $("#" + $(plugins.rdMailForm[this.extraData.counter]).attr("data-form-output"));
                        output.text(msg[result]);
                    }
                },
                success: function (result) {
                    if(!isNoviBuilder) {
                        var form = $(plugins.rdMailForm[this.extraData.counter]);
                        var output = $("#" + form.attr("data-form-output"));
                        form.addClass('success');
                        result = result.length === 5 ? result : 'MF255';
                        output.text(msg[result]);
                        if(result === "MF000") {
                            if(output.hasClass("snackbars")) {
                                output.html('<p><span class="icon text-middle fa-check icon-xs"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("success");
                                output.addClass("active");
                            }
                        } else {
                            if(output.hasClass("snackbars")) {
                                output.html(' <p class="snackbars-left"><span class="icon icon-xs fa-warning text-middle"></span><span>' + msg[result] + '</span></p>');
                            } else {
                                output.addClass("error");
                                output.addClass("active");
                            }
                        }
                        form.clearForm();
                        form.find('input, textarea').blur();
                        setTimeout(function () {
                            output.removeClass("active");
                            form.removeClass('success');
                        }, 5000);
                    }
                }
            });
        }
    }
    if(plugins.customToggle.length) {
        var i;
        for(i = 0; i < plugins.customToggle.length; i++) {
            var $this = $(plugins.customToggle[i]);
            $this.on('click', function (e) {
                e.preventDefault();
                $("#" + $(this).attr('data-custom-toggle')).add(this).toggleClass('active');
            });
            if($this.attr("data-custom-toggle-disable-on-blur") === "true") {
                $("body").on("click", $this, function (e) {
                    if(e.target !== e.data[0] && $("#" + e.data.attr('data-custom-toggle')).find($(e.target)).length === 0 && e.data.find($(e.target)).length === 0) {
                        $("#" + e.data.attr('data-custom-toggle')).add(e.data[0]).removeClass('active');
                    }
                })
            }
        }
    }
});
