


(function($, window, document,undefined) {
    //定义ScrollBar的构造函数
    var ScrollBar = function(ele, opt) {
        this.$element = ele;
        this.defaultVal = {
            horizontalBar:false,     /*是否显示竖滚动条*/
            scrollbarWidth : 37,     /*滚动条总宽度*/
            scrollbarMargin : 0,
            wheelSpeed : 18,         /*鼠标滚轮速度*/
            showArrows : true,       /*是否为用户显示的箭头滚动*/
            arrowSize : 37,          /*上下箭头中间滚动条距顶部高度，如果showArrows= TRUE*/
            arrowTop:37,             /*上箭头距顶部高度，如果showArrows= TRUE*/
            arrowHeight:78,          /*上箭头总高度，如果showArrows= TRUE*/
            animateTo : false,       /*当动画时调用scrollTo和scrollBy*/
            dragMinHeight : 1,       /*允许拖动栏的最小高度*/
            dragMaxHeight : 99999,   /*允许拖动栏的最大高度*/
            animateInterval : 100,   /*动画的速度毫秒*/
            animateStep: 3,          /*动画过程滚动距离（默认3）*/
            maintainPosition: true,
            scrollbarOnLeft: false,
            scrollbarOnLeftAdjust:false, /*横滚动条偏离校正*/
            dragTopBottomHeight:14,     /*上下箭头总高度*/
            clickOnTrack:true,
            speed:300,                  /*竖滚动条左右点击位移left值*/
            maintainPositio: true,
            horizontalDragMinWidth: 0,
            horizontalDragMaxWidth: 99999,
            animateScroll:false,
            scrollPagePercent: .8,
            horizontalArrowPositions: 'split',
            initialDelay:300,
            singleWidthAdjust:47, /*竖滚动条内容单个宽度校正值*/
            totalWidthAdjust:-23  /*竖滚动条内容总宽度校正值*/
        };
        this.options = $.extend({}, this.defaultVal, opt);
    };
    //定义ScrollBar的方法
    ScrollBar.prototype = {
        init: function(options,callback) {
            var that = this;
            var $this = $(this.$element);
            $this.css('overflow', 'hidden');
            this.currentScrollPosition = 0;
            this.paneWidth = $this.innerWidth();
            this.paneHeight = $this.innerHeight();
            this.trackHeight = 0;
            /*横向滚动条*/
            if(!this.options.horizontalBar){
                /*判断有没有scrollBarContainer 类*/
                if ($this.parent().hasClass('scrollBarContainer')) {
                    this.currentScrollPosition = this.options.maintainPosition ? $this.position().top : 0;
                    var $scrollBarContainer  = $this.parent();
                    this.paneWidth = $scrollBarContainer.innerWidth();
                    this.paneHeight = $scrollBarContainer.outerHeight();
                    this.trackHeight = this.paneHeight;
                    $scrollBarContainer.find(".scrollBarTrack").remove();
                    $scrollBarContainer.find(".scrollArrowUp").remove();
                    $scrollBarContainer.find(".scrollArrowDown").remove();
                    $this.css({'top':0});
                } else {
                    this.originalPadding = $this.css('paddingTop') + ' ' + $this.css('paddingRight') + ' ' + $this.css('paddingBottom') + ' ' + $this.css('paddingLeft');
                    this.originalSidePaddingTotal = (parseInt($this.css('paddingLeft')) || 0) + (parseInt($this.css('paddingRight')) || 0);
                    this.paneWidth = $this.innerWidth();
                    this.paneHeight = $this.innerHeight();
                    this.trackHeight = this.paneHeight;
                    $this.wrap(
                        $('<div></div>').attr( {'class':'scrollBarContainer'}).css({ 'height':this.paneHeight+'px', 'width':this.paneWidth+'px'})
                    );
                }
                /*处理滚动条偏离样式*/
                this.scrollbarOnLeft(this.originalSidePaddingTotal,$this);
                /*创建插入滚动条*/
                this.appendScrollBar($this);
            }else{
                /*竖着滚动条*/
                var $items = $this.find(".column_con");
                var width =   $items.find(".item").width()+that.options.singleWidthAdjust;
                var widthlen = $items.find(".item").length;
                /*定义宽度*/
                if(widthlen>3){
                    $items.width(parseInt(width*widthlen));
                }
                that.previousContentWidth = "";
                that.contentWidth = "";
                this.appendScrollBar2($this);
            }
        },
        /*创建插入竖着滚动条*/
        appendScrollBar2:function($this){
            var that = this;
            this.maintainAtRight = false;
            this.wasAtLeft = true;
            this.wasAtRight =  false;
            this.isMaintainingPositon = "";
            this.horizontalDragPosition = "";
            this.lastContentX = "";
            this.horizontalDragPosition = "";
            this.mwEvent = $.fn.mwheelIntent ? 'mwheelIntent' : 'mousewheel';
            this.$elem = $this;
            this.dragMaxX = "";
            var $length = $this.children(".jspContainer").length;
            if (!$length) {
                $this.width(that.paneWidth);
                this.$pane = $('<div class="jspPane" />').append($this.children());
                var pane2  = $('<div class="jspPane2" />');
                pane2 .css({
                    'width': that.paneWidth + 'px',
                    'height': that.paneHeight + 'px'
                });
                pane2.append(that.$pane);
                this.container = $('<div class="jspContainer" />')
                    .css({
                        'width': that.paneWidth + 'px',
                        'height': that.paneHeight + 'px'
                    }
                ).append(pane2).appendTo($this);
                this.$pane =  $this.find(".jspPane");
                this.container =  $this.find(".jspContainer");
            } else {
                this.$pane =  $this.find(".jspPane");
                this.container =  $this.find(".jspContainer");
                $this.css('width', '');
                that.hasContainingSpaceChanged = $this.innerWidth() + $this.outerHeight() != that.paneHeight;
                if (that.hasContainingSpaceChanged) {
                    that.paneWidth = $this.innerWidth();
                    that.paneHeight = $this.innerHeight();
                    this.container.css({
                        width: that.paneWidth + 'px',
                        height: that.paneHeight + 'px'
                    });
                    this.container.find(".jspPane2").css({
                        width: that.paneWidth + 'px',
                        height: that.paneHeight + 'px'
                    });
                }
                if (!that.hasContainingSpaceChanged && that.previousContentWidth == that.contentWidth) {
                    $this.width(that.paneWidth);
                    return;
                }
                that.previousContentWidth = that.contentWidth;
                that.$pane.css('width', '');
                $this.width(that.paneWidth);
                that.container.find('.jspHorizontalBar').remove().end();
            }
            this.$pane.css('overflow','auto');
            this.contentWidth = this.$pane[0].scrollWidth+that.options.totalWidthAdjust;
            this.$pane.css('overflow', '');
            this.percentInViewH = this.contentWidth / this.paneWidth;
            this.isScrollableH =  this.percentInViewH > 1;
            if (!(this.isScrollableH)) {
                $this.removeClass('jspScrollable');
                that.$pane.css({
                    top: 0,
                    left: 0,
                    width: that.container.width()
                });
                that.removeMousewheel();
                that.removeClickOnTrack();
            } else {
                $this.addClass('jspScrollable');
                that.isMaintainingPositon = that.options.maintainPosition && (that.horizontalDragPosition);
                if (that.isMaintainingPositon) {
                    that.lastContentX =  -that.$pane.position().left;
                }
                that.initialiseHorizontalScroll();
                that.resizeScrollbars();
                if (that.isMaintainingPositon) {
                    that.scrollToX(that.maintainAtRight  ? (this.contentWidth  - this.paneWidth) : this.lastContentX, false);
                }
                that.initMousewheel();
                if (that.options.clickOnTrack) {
                    that.initClickOnTrack();
                }
            }
        },
        scrollToX:function(destX, animate)  {
            var percentScrolled = destX / ((this.contentWidth  - this.paneWidth));
            this.positionDragX(percentScrolled * this.dragMaxX, animate);
        },
        positionDragX: function(destX, animate){
            var that = this;
            /*必走*/
            if (!that.isScrollableH) {
                return;
            }
            if (destX < 0) {
                destX = 0;
            } else if (destX > that.dragMaxX) {
                destX = that.dragMaxX;
            }
            var willScrollXEvent = new $.Event("jsp-will-scroll-x");
            this.$elem.trigger(willScrollXEvent, [destX]);
            if (willScrollXEvent.isDefaultPrevented()) {
                return;
            }
            var tmpHorizontalDragPosition = destX ||0;
            var isAtLeft = tmpHorizontalDragPosition === 0,
                isAtRight = tmpHorizontalDragPosition == that.dragMaxX,
                percentScrolled = destX / that.dragMaxX,
                destLeft = -percentScrolled * (that.contentWidth - that.paneWidth);

            if (animate === undefined) {
                animate = that.options.animateScroll;
            }
            if (animate) {
                /* jsp.animate(horizontalDrag, 'left', destX,	_positionDragX, function() {
                 elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
                 });*/
            } else {
                /*必走*/
                that.horizontalDrag.css('left', destX);
                this._positionDragX(destX);
                this.$elem.trigger('jsp-user-scroll-x', [-destLeft, isAtLeft, isAtRight]);
            }
        },
        _positionDragX: function(destX){
            var that = this;
            if (destX === undefined) {
                destX = that.horizontalDrag.position().left;
            }
            that.horizontalDragPosition = destX ||0;
            var isAtLeft = that.horizontalDragPosition === 0,
                isAtRight = that.horizontalDragPosition == that.dragMaxX,
                percentScrolled = destX / that.dragMaxX,
                destLeft = -percentScrolled * (that.contentWidth - that.paneWidth);
            if (that.wasAtLeft != isAtLeft || that.wasAtRight != isAtRight) {
                that.wasAtLeft = isAtLeft;
                that.wasAtRight = isAtRight;
                that.$elem.trigger('jsp-arrow-change', [that.wasAtLeft, that.wasAtRight]);
            }
            that.updateHorizontalArrows(isAtLeft, isAtRight);
            that.$pane.css('left', destLeft);
            that.$elem.trigger('jsp-scroll-x', [-destLeft, isAtLeft, isAtRight]).trigger('scroll');
        },
        updateHorizontalArrows: function(isAtLeft, isAtRight)  {
            var that = this;
            if (that.options.showArrows) {
                that.arrowLeft[isAtLeft ? 'addClass' : 'removeClass']('jspDisabled');
                that.arrowRight[isAtRight ? 'addClass' : 'removeClass']('jspDisabled');
            }
        },
        initMousewheel:function()  {
            var that = this;
            that.container.unbind(that.mwEvent).bind(
                that.mwEvent,
                function (event, delta, deltaX, deltaY) {
                    if (!that.horizontalDragPosition) that.horizontalDragPosition = 0;
                    var dX = that.horizontalDragPosition,  factor = event.deltaFactor || that.options.wheelSpeed;
                    that.scrollByX(deltaX * factor, false);
                    return dX == that.horizontalDragPosition ;
                }
            );
        },
        removeMousewheel: function() {
            var that = this;
            that.container.unbind(that.mwEvent);
        },
        scrollByX: function(deltaX, animate)  {
            var that = this;
            var positionX  =  -that.$pane.position().left;
            var destX =positionX + Math[deltaX<0 ? 'floor' : 'ceil'](deltaX),
                percentScrolled = destX / (that.contentWidth - that.paneWidth);
            /*必走*/
            this.positionDragX(percentScrolled * that.dragMaxX, animate);
        },
        initClickOnTrack: function() {
            var that = this;
            that.removeClickOnTrack();
            if (that.isScrollableH) {
                that.horizontalTrack.bind(
                    'mousedown',
                    function(e)
                    {
                        if (e.originalTarget === undefined || e.originalTarget == e.currentTarget) {
                            var clickedTrack = $(this),
                                offset = clickedTrack.offset(),
                                direction = e.pageX - offset.left - that.horizontalDragPosition,
                                scrollTimeout,
                                isFirst = true,
                                doScroll = function()
                                {
                                    var offset = clickedTrack.offset(),
                                        pos = e.pageX - offset.left - that.horizontalDragWidth / 2,
                                        contentDragX = that.paneWidth * that.options.scrollPagePercent,
                                        dragX = that.dragMaxX * contentDragX / (that.contentWidth - that.paneWidth);
                                    if (direction < 0) {
                                        if (that.horizontalDragPosition - dragX > pos) {
                                            that.scrollByX(-contentDragX);
                                        } else {
                                            that.positionDragX(pos);
                                        }
                                    } else if (direction > 0) {
                                        if (that.horizontalDragPosition + dragX < pos) {
                                            that.scrollByX(contentDragX);
                                        } else {
                                            that.positionDragX(pos);
                                        }
                                    } else {
                                        cancelClick();
                                        return;
                                    }
                                    scrollTimeout = setTimeout(doScroll, isFirst ? that.options.initialDelay : 70);
                                    isFirst = false;
                                },
                                cancelClick = function()
                                {
                                    scrollTimeout && clearTimeout(scrollTimeout);
                                    scrollTimeout = null;
                                    $(document).unbind('mouseup', cancelClick);
                                };
                            doScroll();
                            $(document).bind('mouseup', cancelClick);
                            return false;
                        }
                    }
                );
            }
        },
        removeClickOnTrack: function()  {
            var that = this;
            if (that.horizontalTrack) {
                that.horizontalTrack.unbind('mousedown');
            }
        },
        initialiseHorizontalScroll:function(){
            var that = this;
            if (that.isScrollableH) {
                that.container.append(
                    $('<div class="jspHorizontalBar" />').append(
                        $('<div class="jspCap jspCapLeft" />'),
                        $('<div class="jspTrack" />').append(
                            $('<div class="jspTrackLeft" />'),
                            $('<div class="jspTrackMiddle" />'),
                            $('<div class="jspTrackRight" />'),
                            $('<div class="jspDrag" />').append(
                                $('<div class="jspDragLeft" />'),
                                $('<div class="jspDragMiddle" />'),
                                $('<div class="jspDragRight" />')
                            )
                        ),
                        $('<div class="jspCap jspCapRight" />')
                    )
                );
                that.horizontalBar = that.container.find('>.jspHorizontalBar');
                that.horizontalTrack = that.horizontalBar.find('>.jspTrack');
                that.horizontalDrag = that.horizontalTrack.find('>.jspDrag');
                if (that.options.showArrows) {
                    that.arrowLeft = $('<a class="jspArrow jspArrowLeft" />').bind(
                        'mousedown', that.getArrowScroll(-1, 0)
                    ).bind('click', function(){return false});
                    that.arrowRight = $('<a class="jspArrow jspArrowRight" />').bind(
                        'mousedown', that.getArrowScroll(1, 0)
                    ).bind('click', function(){return false});
                    that.appendArrows(that.horizontalTrack, that.options.horizontalArrowPositions, that.arrowLeft, that.arrowRight);
                }
                that.horizontalDrag.bind(
                    'mousedown.jsp',
                    function(e)
                    {
                        $('html').bind('dragstart.jsp selectstart.jsp', function(){return false});
                        that.horizontalDrag.addClass('jspActive');
                        var startX = e.pageX - that.horizontalDrag.position().left;
                        $('html').bind(
                            'mousemove.jsp',
                            function(e)
                            {
                                that.positionDragX(e.pageX - startX, false);
                            }
                        ).bind('mouseup.jsp mouseleave.jsp', that.cancelDrag);
                        return false;
                    }
                );
                this.horizontalTrackWidth = that.container.innerWidth();
                this.sizeHorizontalScrollbar();
            }
        },
        sizeHorizontalScrollbar:function(){
            var that = this;
            that.container.find('>.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow').each(
                function()
                {
                    that.horizontalTrackWidth -= 37;
                }
            );
            that.horizontalTrack.width(that.horizontalTrackWidth + 'px');
            that.horizontalDragPosition = 0;
        },
        resizeScrollbars: function() {
            var that = this;
            if (that.isScrollableH) {
                var horizontalTrackHeight = that.horizontalTrack.outerHeight();
                $(that.horizontalBar).find('>.jspCap:visible,>.jspArrow').each(
                    function()
                    {
                        that.horizontalTrackWidth += 37;
                    }
                );
                that.paneWidth -= horizontalTrackHeight;
                that.horizontalTrack.parent().append(
                    $('<div class="jspCorner" />').css('width', horizontalTrackHeight + 'px')
                );
                that.sizeHorizontalScrollbar();
            }
            // reflow content
            if (that.isScrollableH) {
                that.$pane.width((that.container.outerWidth()) + 'px');
            }
            if (that.isScrollableH) {
                that.horizontalDragWidth = Math.ceil(1 / that.percentInViewH * that.horizontalTrackWidth);
                if (that.horizontalDragWidth > that.options.horizontalDragMaxWidth) {
                    that.horizontalDragWidth = that.options.horizontalDragMaxWidth;
                } else if (that.horizontalDragWidth < that.options.horizontalDragMinWidth) {
                    that.horizontalDragWidth = that.options.horizontalDragMinWidth;
                }
                that.horizontalDrag.width(that.horizontalDragWidth + 'px');
                $(".jspDragMiddle").width(that.horizontalDragWidth-16);
                that.dragMaxX = that.horizontalTrackWidth - that.horizontalDragWidth;
                this._positionDragX(that.horizontalDragPosition);
            }
        },
        cancelDrag: function()  {
            var that = this;
            $('html').unbind('dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp');

            if (that.horizontalDrag) {
                that.horizontalDrag.removeClass('jspActive');
            }
        },
        appendArrows:function (ele, p, a1, a2) {
            var p1 = "before", p2 = "after", aTemp;
            if (p == "os") {
                p = /Mac/.test(navigator.platform) ? "after" : "split";
            }
            if (p == p1) {
                p2 = p;
            } else if (p == p2) {
                p1 = p;
                aTemp = a1;
                a1 = a2;
                a2 = aTemp;
            }
            ele[p1](a1)[p2](a2);
        },
        getArrowScroll:function(dirX, dirY, ele) {
            var that = this;
            return function()
            {
                that.arrowScroll(dirX, dirY, this, ele);
                this.blur();
                return false;
            };
        },
        arrowScroll: function(dirX, dirY, arrow, ele)  {
            var that = this;
            arrow = $(arrow).addClass('jspActive');
            var eve,
                scrollTimeout,
                isFirst = true,
                doScroll = function()
                {
                    /*必走*/
                    if (dirX !== 0) {
                        that.scrollByX(dirX * that.options.speed);
                    }
                    scrollTimeout = setTimeout(doScroll, isFirst ? that.options.initialDelay : 50);
                    isFirst = false;
                };
            doScroll();
            eve = ele ? 'mouseout.jsp' : 'mouseup.jsp';
            ele = ele || $('html');
            ele.bind(
                eve,
                function()
                {
                    arrow.removeClass('jspActive');
                    scrollTimeout && clearTimeout(scrollTimeout);
                    scrollTimeout = null;
                    ele.unbind(eve);
                }
            );
        },
        /*处理滚动条偏离样式*/
        scrollbarOnLeft:function(originalSidePaddingTotal,$this){
            var p = originalSidePaddingTotal;
            var cssToApply = {
                'height':'auto',
                'width':this.paneWidth - this.options.scrollbarWidth - this.options.scrollbarMargin - p + 'px'
            };
            /*对偏离样式做处理（浮动情况下宽度不加滚动条的宽度）*/
            if(this.options.scrollbarOnLeftAdjust){
                cssToApply = {
                    'height':'auto',
                    'width':this.paneWidth + 'px'
                };
            }
            if(this.options.scrollbarOnLeft) {
                cssToApply.paddingLeft = this.options.scrollbarMargin + this.options.scrollbarWidth + 'px';
            } else {
                cssToApply.paddingRight = this.options.scrollbarMargin + 'px';
            }
            $this.css(cssToApply);
        },
        /*创建插入滚动条*/
        appendScrollBar:function($this){
            this.contentHeight = $this.outerHeight();
            this.percentInView = this.paneHeight / this.contentHeight;
            if (this.percentInView < 0.99) {
                var $container = $this.parent();
                $container.append(
                    $('<div></div>').attr({'class':'scrollBarTrack'}).css({'width':this.options.scrollbarWidth+'px'}).append(
                        $('<div></div>').attr({'class':'scrollBarDrag'}).css({'width':this.options.scrollbarWidth+'px'}).append(
                            $('<div></div>').attr({'class':'scrollBarDragTop'}).css({'width':this.options.scrollbarWidth+'px'}),
                            $('<div></div>').attr({'class':'scrollBarDragMiddle'}).css({'width':this.options.scrollbarWidth+'px'}),
                            $('<div></div>').attr({'class':'scrollBarDragBottom'}).css({'width':this.options.scrollbarWidth+'px'})
                        )
                    )
                );
                var $track = $container.find(".scrollBarTrack");
                /*用户自定义滚动条箭头*/
                this.showArrows($container,$track);
            }else{
                $this.css(
                    {
                        'height':this.paneHeight+'px',
                        'width':this.paneWidth-this.originalSidePaddingTotal+'px',
                        'padding':this.originalPadding
                    }
                );
            }
        },
        /*用户自定义滚动条箭头*/
        showArrows:function($container,$track){
            if (this.options.showArrows) {
                var _this = this;
                var currentArrowButton;
                var currentArrowDirection;
                var currentArrowInterval;
                var currentArrowInc;
                var whileArrowButtonDown = function()
                {
                    if (currentArrowInc > 4 || currentArrowInc%4==0) {
                        _this.positionDrag(_this.dragPosition + currentArrowDirection * _this.mouseWheelMultiplier);
                    }
                    currentArrowInc ++;
                };
                var onArrowMouseUp = function(event)
                {
                    $('html').unbind('mouseup', onArrowMouseUp);
                    currentArrowButton.removeClass('scrollActiveArrowButton');
                    clearInterval(currentArrowInterval);
                };
                var onArrowMouseDown = function() {
                    $('html').bind('mouseup', onArrowMouseUp);
                    currentArrowButton.addClass('scrollActiveArrowButton');
                    currentArrowInc = 0;
                    whileArrowButtonDown();
                    currentArrowInterval = setInterval(whileArrowButtonDown, 100);
                };
                /*插入箭头*/
                $container
                    .append(
                        $('<a></a>')
                            .attr({'href':'javascript:;', 'class':'scrollArrowUp'})
                            .css({'width':this.options.scrollbarWidth+'px'})
                            .html('Scroll up')
                            .bind('mousedown', function()
                            {
                                currentArrowButton = $(this);
                                currentArrowDirection = -1;
                                onArrowMouseDown();
                                this.blur();
                                return false;
                            })
                            .bind('click', function() { return false; }),
                        $('<a></a>')
                            .attr({'href':'javascript:;', 'class':'scrollArrowDown'})
                            .css({'width':this.options.scrollbarWidth+'px'})
                            .html('Scroll down')
                            .bind('mousedown', function()
                            {
                                currentArrowButton = $(this);
                                currentArrowDirection = 1;
                                onArrowMouseDown();
                                this.blur();
                                return false;
                            })
                            .bind('click', function() { return false; })
                    );
                var $upArrow =  $container.find(".scrollArrowUp");
                var $downArrow =  $container.find(".scrollArrowDown");
                /*计算核心滚动条整个的高度（高度 = 容器高度 - 上下箭头总高度）*/
                if (this.options.arrowSize) {
                    this.trackHeight = this.paneHeight - this.options.arrowHeight;
                    $track.css({'height': this.trackHeight+'px', top:this.options.arrowTop+'px'})
                } else {
                    var topArrowHeight = $upArrow.height();
                    this.options.arrowSize = topArrowHeight;
                    this.trackHeight = this.paneHeight - topArrowHeight - $downArrow.height();
                    $track.css({'height': this.trackHeight+'px', top:topArrowHeight+'px'})
                }
            }
            /*滚动条拖动事件*/
            this.scrollDrag();

            /*滚动条点击滚动事件*/
            this.scrollClick();

            /*鼠标滚轮事件*/
            this.scrollMousewheel();

        },
        /*获取坐标*/
        getPos:function (event, c) {
            var p = c == 'X' ? 'Left' : 'Top';
            return event['page' + c] || (event['client' + c] + (document.documentElement['scroll' + p] || document.body['scroll' + p])) || 0;
        },
        animateToPosition :function(){
            var diff = (this._animateToPosition - this.dragPosition) / this.options.animateStep;
            if (diff > 1 || diff < -1) {
                this.positionDrag(this.dragPosition + diff);
            } else {
                this.positionDrag(this._animateToPosition);
                this.ceaseAnimation();
            }
        },
        ceaseAnimation:function(){
            var _this = this;
            if (_this._animateToInterval) {
                clearInterval(_this._animateToInterval);
                delete _this._animateToPosition;
            }
        },
        /*滚动条拖动事件*/
        scrollDrag:function(){
            this.currentOffset = 0;
            this.dragPosition = 0;
            this.dragMiddle = this.percentInView*this.paneHeight/2;
            var $this = $(this.$element);
            var $pane = $this.css({'position':'absolute', 'overflow':'visible'});
            var $drag =  $this.parent().find(".scrollBarTrack").find(".scrollBarDrag");
            this._animateToInterval = undefined;
            this._animateToPosition = undefined;
            var _this = this;
            /*初始化拖动*/
            this.initDrag = function() {
                _this.ceaseAnimation();
                _this.currentOffset = $drag.offset();
                _this.currentOffset.top -= _this.dragPosition;
                _this.maxY = _this.trackHeight - $drag[0].offsetHeight;
                _this.mouseWheelMultiplier = 2 * _this.options.wheelSpeed * _this.maxY / _this.contentHeight;
            };
            /*开始拖动*/
            this.onStartDrag = function(event){
                _this.initDrag();
                _this.dragMiddle = _this.getPos(event, 'Y') - _this.dragPosition - _this.currentOffset.top;
                $('html').bind('mouseup', _this.onStopDrag).bind('mousemove', _this.updateScroll);
                /*IE bug 处理*/
                if ($.browser.msie) {
                    $('html').bind('dragstart', function() {return false; }).bind('selectstart', function() {	return false; });
                }
                return false;
            };
            /*停止拖动*/
            this.onStopDrag = function(){
                $('html').unbind('mouseup', _this.onStopDrag).unbind('mousemove', _this.updateScroll);
                _this.dragMiddle = _this.percentInView*_this.paneHeight/2;
                /*IE bug 处理*/
                if ($.browser.msie) {
                    $('html').unbind('dragstart', function() {	return false; }).unbind('selectstart', function() {	return false; });
                }
            };
            /*改变滚动条的位置*/
            this.updateScroll = function(e){
                _this.positionDrag(_this.getPos(e, 'Y') - _this.currentOffset.top - _this.dragMiddle);
            };

            /*计算滚动条核心高度（高度 = scrollBarDragTop+scrollBarDragMiddle+scrollBarDragBottom）*/
            var dragH = Math.max(Math.min(this.percentInView*(this.paneHeight- this.options.arrowSize*2), this.options.dragMaxHeight), this.options.dragMinHeight);
            $drag.css({'height':dragH+'px'}).bind('mousedown', _this.onStartDrag);
            /*给中间条jScrollPaneDragMiddle上高度*/
            $(".scrollBarDragMiddle").height(parseFloat(dragH-this.options.dragTopBottomHeight));

            /*初始化拖动*/
            _this.initDrag();


        },
        /*滚动条滚动及点击事件*/
        scrollClick:function(){
            var _this = this;
            var $this = $(this.$element);
            var $track = $this.parent().find(".scrollBarTrack");
            var trackScrollInterval;
            var trackScrollInc;
            var trackScrollMousePos;
            var doTrackScroll = function()
            {
                if (trackScrollInc > 8 || trackScrollInc%4==0) {
                    _this.positionDrag((_this.dragPosition - ((_this.dragPosition - trackScrollMousePos) / 2)));
                }
                trackScrollInc ++;
            };
            var onStopTrackClick = function()
            {
                clearInterval(trackScrollInterval);
                $('html').unbind('mouseup', onStopTrackClick).unbind('mousemove', onTrackMouseMove);
            };
            var onTrackMouseMove = function(event)
            {
                trackScrollMousePos = _this.getPos(event, 'Y') - _this.currentOffset.top - _this.dragMiddle;
            };
            var onTrackClick = function(event)
            {
                _this.initDrag();
                onTrackMouseMove(event);
                trackScrollInc = 0;
                $('html').bind('mouseup', onStopTrackClick).bind('mousemove', onTrackMouseMove);
                trackScrollInterval = setInterval(doTrackScroll, 100);
                doTrackScroll();
            };
            $track.bind('mousedown', onTrackClick);
        },
        /*鼠标滚动事件*/
        scrollMousewheel:function(){
            var _this = this;
            var $this = $(this.$element);
            var $track = $this.parent().find(".scrollBarTrack");
            var $pane = $this.css({'position':'absolute', 'overflow':'visible'});
            $this.parent().unbind('mousewheel');
            $this.parent().bind(
                'mousewheel',
                function (event, delta) {
                    _this.initDrag();
                    _this.ceaseAnimation();
                    var d = _this.dragPosition;
                    _this.positionDrag(_this.dragPosition - delta * _this.mouseWheelMultiplier);
                    var dragOccured = d != _this.dragPosition;
                    return !dragOccured;
                }
            );
            var scrollTo = function(pos, preventAni)
            {
                if (typeof pos == "string") {
                    $e = $(pos, $this);
                    if (!$e.length) return;
                    pos = $e.offset().top - $this.offset().top;
                }
                $this.parent().scrollTop(0);
                _this.ceaseAnimation();
                var destDragPosition = -pos/(_this.paneHeight-_this.contentHeight) * _this.maxY;
                if (preventAni || !this.options.animateTo) {
                    _this.positionDrag(destDragPosition);
                } else {
                    _this._animateToPosition = destDragPosition;
                    _this._animateToInterval = setInterval(_this.animateToPosition, this.options.animateInterval);
                }
            };
            $this[0].scrollTo = scrollTo;

            $this[0].scrollBy = function(delta)
            {
                var currentPos = -parseInt($pane.css('top')) || 0;
                scrollTo(currentPos + delta);
            };
            scrollTo(-_this.currentScrollPosition, true);

        },

        /*定位拖动*/
        positionDrag:function(destY){
            var $this = $(this.$element);
            var $pane = $this.css({'position':'absolute', 'overflow':'visible'});
            var $drag =  $this.parent().find(".scrollBarTrack .scrollBarDrag");
            destY = destY < 0 ? 0 : (destY > this.maxY ? this.maxY : destY);
            this.dragPosition = destY;
            $drag.css({'top':destY+'px'});
            var p = destY / this.maxY;
            $pane.css({'top':((this.paneHeight-this.contentHeight)*p) + 'px'});
            $this.trigger('scroll');
            if (this.options.showArrows) {
                $this.parent().find(".scrollArrowUp")[destY == 0 ? 'addClass' : 'removeClass']('disabled');
                $this.parent().find(".scrollArrowDown")[destY == this.maxY ? 'addClass' : 'removeClass']('disabled');
            }
        }
    };
    //在插件中使用scrollBar对象
    $.fn.scrollBar = function(options,callback) {
        //创建scrollBar的实体
        var scrollBar = new ScrollBar(this, options);
        //初始化
        return scrollBar.init(options,callback);
    };


})(jQuery, window, document);
/**
 * Created by shiwz on 17-1-3.
 */
