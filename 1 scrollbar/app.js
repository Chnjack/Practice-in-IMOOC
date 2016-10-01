/**
 * Created by dell on 2016/8/25.
 */
var ScrollBar = {};
(function(win,doc,$){
    function CusScrollBar(options){
        this._init(options);
    }
    $.extend(CusScrollBar.prototype,{
        _init : function (options){
            var self = this;
            self.options = {
                contSelector:"",
                barSelector:"",
                sliderSelector:"",
                tabItemSelector:"",
                tabActiveClass:"",
                anchorSelector:"",
                wheelStep:15
            };
            $.extend(true,self.options,options||{});
            self._initDomEvent();
            self._initSliderDragEvent();
            self._bandContScroll();
            self._bandMouseWheel();
            self._initTabEvent();
        },
        _initDomEvent:function(){
            var opts = this.options;
            this.$cont = $(opts.contSelector);
            this.$slider = $(opts.sliderSelector);
            this.$bar = opts.barSelector ? $(opts.barSelector) : this.$slider.parent();
            this.$doc = $(doc);
            this.$tabItem = $(opts.tabItemSelector);
            this.$anchor = $(opts.anchorSelector);
        },
        _initSliderDragEvent:function(){
            var self = this;
            var slider = self.$slider;
            var cont = self.$cont;
            var doc = self.$doc,
                dragStartMousePosition,
                dragStartContPosition,
                dragContBarRate;
            slider.on("mousedown",function(e){
                e.preventDefault();
                dragStartMousePosition = e.pageY;
                dragStartContPosition = cont[0].scrollTop;
                dragContBarRate = self.getMaxScrollPosition()/self.getMaxSliderPosition();
                doc.on("mousemove.scroll",function(e){
                    e.preventDefault();
                    mouseMoveHandler(e);
                }).on("mouseup.scroll",function(e){
                    e.preventDefault();
                    doc.off(".scroll");
                })
            });
            function mouseMoveHandler(e){
                if (dragStartMousePosition==null){
                    return;
                }
                self.scrollContTo(dragStartContPosition+(e.pageY-dragStartMousePosition)*dragContBarRate);
            }
        },
        _bandContScroll:function(){
            var self = this;
            self.$cont.on("scroll",function(e){
                e.preventDefault();
                self.$slider.css('top',self.getSliderPosition()+'px');
            })
        },
        _bandMouseWheel:function(){
            var self = this;
            self.$cont.on("mousewheel DOMMouseScroll",function(e){
                e.preventDefault();
                var oEv = e.originalEvent;
                var wheelRange = oEv.wheelDelta? -oEv.wheelDelta/120:(oEv.detail||0)/3;
                self.scrollContTo(self.$cont[0].scrollTop+wheelRange*self.options.wheelStep);
            });
        },
        _initTabEvent:function(){
            var self=this;
            self.$tabItem.on("click",function(e){
                e.preventDefault();
                var index = $(this).index();
                //self.changeTabSelect(index);
                self.scrollContTo(self.$cont[0].scrollTop+self.getAnchorPosition(index));
            })
        },
        scrollContTo:function(positionVal){
            var self = this;
            var arr = self.getAllAnchorPosition();
            function getIndex(positionVal){
                for(var i = arr.length-1;i>=0;i--){
                    if(positionVal>=arr[i]){
                        return i;
                    }
                }
            }
            if(self.$tabItem.length==arr.length){
                self.changeTabSelect(getIndex(positionVal));
            }
            self.$cont.scrollTop(positionVal);
        },
        //why return?
        changeTabSelect:function(index){
            var self = this;
            var active=self.options.tabActiveClass;
            self.$tabItem.eq(index).addClass(active).siblings().removeClass(active);

        },
        getSliderPosition:function(){
            var self = this;
            return self.$cont[0].scrollTop/(self.getMaxScrollPosition()/self.getMaxSliderPosition());
        },
        getMaxScrollPosition:function(){
            var self = this;
            return Math.max(self.$cont[0].scrollHeight,self.$cont.height())-self.$cont.height();

        },
        getMaxSliderPosition:function(){
            var self = this;
            return self.$bar.height()-self.$slider.height();
        },
        getAnchorPosition:function(index){
            var self = this;
            return self.$anchor.eq(index).position().top;
        },
        getAllAnchorPosition:function(){
            var self = this;
            var allAnchor = [];
            for(var i=0;i<self.$anchor.length;i++){
                allAnchor.push(self.getAnchorPosition(i)+self.$cont[0].scrollTop);
            }
            return allAnchor;
        }
    });
    ScrollBar.CusScrollBar = CusScrollBar;
})(window,document,jQuery);

var scroll_1 = new ScrollBar.CusScrollBar({
    contSelector:".scroll-cont",
    barSelector:".scroll-bar",
    sliderSelector:".scroll-slider",
    tabItemSelector:".tab-item",
    tabActiveClass:"tab-active",
    anchorSelector:".anchor"
});
