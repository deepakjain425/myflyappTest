/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * A simple frame is a span with a configurable border width and color.
 * @class aria.widgets.frames.SimpleFrame
 */
Aria.classDefinition({
    $classpath : 'aria.widgets.frames.SimpleFrame',
    $extends : 'aria.widgets.frames.Frame',
    $dependencies : ['aria.utils.Dom'],
    $constructor : function (cfg) {
        this.$Frame.constructor.call(this, cfg);
        this._computeSize();
    },
    $prototype : {
        /**
         * Compute the size of the frame (fill the innerWidth and innerHeight properties).
         * @protected
         */
        _computeSize : function () {
            var cfg = this._cfg, state = cfg.stateObject;
            var border = (state.borderSize > 0) ? state.borderSize : 0;

            if (cfg.width > -1) {
                var w = cfg.width - state.paddingLeft - state.paddingRight - state.marginLeft - state.marginRight;
                if (this._hasBorder(state.skipLeftBorder, cfg.iconsLeft)) {
                    w -= state.borderLeft >= 0 ? state.borderLeft : border;
                }
                if (this._hasBorder(state.skipRightBorder, cfg.iconsRight)) {
                    w -= state.borderRight >= 0 ? state.borderRight : border;
                }
                this.innerWidth = w > 0 ? w : 0;
            } else {
                this.innerWidth = -1;
            }
            if (cfg.height > -1) {
                var h = (state.frameHeight || cfg.height) - state.paddingTop - state.paddingBottom - state.marginTop
                        - state.marginBottom;
                h -= state.borderTop >= 0 ? state.borderTop : border;
                h -= state.borderBottom >= 0 ? state.borderBottom : border;
                this.innerHeight = h > 0 ? h : 0;
            } else {
                this.innerHeight = -1;
            }
        },

        /**
         * Generate the begining of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupBegin : function (out) {
            var cfg = this._cfg;
            var state = cfg.stateObject;
            var sizeInfo = {
                style : cfg.block ? 'display:block;' : '',
                className : "xSimpleFrame " + this._cssPrefix + "frame " + cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            if (!this._hasBorder(state.skipLeftBorder, cfg.iconsLeft)) {
                sizeInfo.style = sizeInfo.style
                        + 'border-left:0px;border-top-left-radius:0px;border-bottom-left-radius:0px;';
            }
            if (!this._hasBorder(state.skipRightBorder, cfg.iconsRight)) {
                sizeInfo.style = sizeInfo.style
                        + 'border-right:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;';
            }
            out.write('<span ' + (sizeInfo.style ? 'style="' + sizeInfo.style + '"' : '') + 'class="'
                    + sizeInfo.className + '">');
        },

        /**
         * Generate the end of the markup for this frame.
         * @param {aria.templates.MarkupWriter} out
         */
        writeMarkupEnd : function (out) {
            out.write('</span>');
        },

        /**
         * Link this frame to a DOM element after the markup has been inserted in the DOM.
         * @param {HTMLElement} domElt The DOM element which corresponds to the first item inserted by the
         * writeMarkupBegin method.
         */
        linkToDom : function (domElt) {
            this.$Frame.linkToDom.call(this, domElt);
            this._childRootElt = domElt;
        },

        /**
         * Change the state of the frame. Must not be called before linkToDom has been called.
         * @param {String} stateName name of the state
         */
        changeState : function (stateName) {
            this.$Frame.changeState.call(this, stateName);
            this._computeSize();
            var domElt = this._domElt;
            var sizeInfo = {
                className : "xSimpleFrame " + this._cssPrefix + "frame " + this._cfg.cssClass
            };
            this._appendInnerWidthInfo(sizeInfo);
            this._appendInnerHeightInfo(sizeInfo);
            domElt.style.width = sizeInfo.width;
            domElt.style.height = sizeInfo.height;
            domElt.className = sizeInfo.className;
        },

        /**
         * Resize the frame to new dimensions.
         * @param {Number} width New width, or -1 to fit the content width
         * @param {Number} height New height, or -1 to fit the content height
         */
        resize : function (width, height) {
            this.$Frame.resize.call(this, width, height);
            this.changeState(this.getStateName());
        },
        /**
         * Checks for any border in left or right.
         * @protected
         * @param {String} border
         * @param {Array} Icons
         * @return {Boolean}
         */
        _hasBorder : function (skipBorder, icons) {
            var hasBorder = (skipBorder === false);
            if (skipBorder == "dependsOnIcon") {
                hasBorder = (icons.length === 0);
            }
            return hasBorder;
        }
    }
});
