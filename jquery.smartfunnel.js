// jQuery SmartFunnel
// by Adam Prager <adam.prager@netlife.hu>
;(function($) {
    $.smartFunnel = function(el, options) {
        var defaults = {
            color: '#3277B5',
            data: false,
            dataSource: false,
            showValue: true,
            animation: {
                effect: false,
                options: {

                },
                duration: 100
            },
            animationOdd: false
        }

        var smartFunnel = this;

        smartFunnel.settings = {}

        var init = function() {
            smartFunnel.settings = $.extend({}, defaults, options);

            if (smartFunnel.settings.animationOdd == false) {
                smartFunnel.settings.animationOdd = smartFunnel.settings.animation;
            }

            smartFunnel.$container = $(el);

            if (smartFunnel.settings.data) {
                smartFunnel.draw();
            } else {
                smartFunnel.fetchData();
            }
        }

        smartFunnel.draw = function() {
            var width = smartFunnel.$container.width();
            var ratio;

            $.each(smartFunnel.settings.data, function(i, row) {
                if (i == 0) {
                    ratio = width / row.value;
                }

                var liWidth = row.value * ratio;
                var liMargin = (width - liWidth) / 2

                var html = '<span>' + row.label + '</span>';

                if (smartFunnel.settings.showValue) {
                    html += '<span>' + row.value + '</span>';
                }

                var $li = $('<li></li>').html(html).css({
                    'width': liWidth,
                    'margin-left': liMargin,
                    'display': 'none',
                    'background-color': row.color || smartFunnel.settings.color
                });

                smartFunnel.$container.append($li);

                var animation;

                if (i % 2 == 1) {
                    animation = smartFunnel.settings.animationOdd;
                } else {
                    animation = smartFunnel.settings.animation;
                }

                $li.show(animation.effect, animation.options, animation.duration);
            });
        },

        smartFunnel.fetchData = function() {
            $.ajax({
                dataType: "json",
                url: smartFunnel.settings.dataSource,
                success: function(data) {
                    smartFunnel.settings.data = data;

                    smartFunnel.draw();
                },
                error: function(data) {
                    // TODO
                }
            });
        }

        init();
    }

    $.fn.smartFunnel = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('smartFunnel')) {
                var smartFunnel = new $.smartFunnel(this, options);
                $(this).data('smartFunnel', smartFunnel);
            }
        });
    }

})(jQuery);