/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Utility class that manages the change of url by only changing the hash
 */
Aria.classDefinition({
    $classpath : "aria.pageEngine.utils.HashManager",
    $extends : "aria.pageEngine.utils.BaseNavigationManager",
    $dependencies : ["aria.utils.HashManager", "aria.utils.Type"],
    /**
     * @param {aria.core.CfgBeans:Callback} cb Callback called on hash change. It corresponds to a navigate method
     * @param {aria.core.CfgBeans:Site.storage} options Options for local storage
     */
    $constructor : function (cb, options) {

        this.$BaseNavigationManager.constructor.apply(this, arguments);

        /**
         * Shortcut to the hash manager
         * @type aria.utils.HashManager
         * @private
         */
        this._hashManager = aria.utils.HashManager;

        /**
         * Listener of the hashchange
         * @type aria.core.CfgBeans:Callback
         * @private
         */
        this._onHashChangeCallback = {
            fn : this._onHashChange,
            scope : this
        };

        this._hashManager.addCallback(this._onHashChangeCallback);

    },
    $destructor : function () {
        this._hashManager.removeCallback(this._onHashChangeCallback);
        this._onHashChangeCallback = null;
        this._hashManager = null;
        this.$BaseNavigationManager.$destructor.call(this);
    },
    $prototype : {

        /**
         * Retrieves the pageId from the cache and navigates to it
         * @private
         */
        _onHashChange : function () {
            var url = this.getUrl();
            var pageId = this._cache[url] ? this._cache[url].id : null;
            if (pageId && this._navigate) {
                this.$callback(this._navigate, {
                    pageId : pageId,
                    url : url
                });
            }
        },

        /**
         * Updates the history according to the specified page parameters
         * @param {aria.pageEngine.CfgBeans:PageRequest} pageRequest
         */
        update : function (pageRequest) {
            var url = pageRequest.url, title = pageRequest.title, typeUtil = aria.utils.Type;
            if (typeUtil.isString(url)) {
                this._addInCache(url, pageRequest.pageId);
                if (this.getUrl() != url) {
                    this._hashManager.setHash(url);
                }
            }
            if (typeUtil.isString(title)) {
                Aria.$window.document.title = title;
            }

        },

        /**
         * @return {String} pathname or hash, according to the browser
         */
        getUrl : function () {
            return this._hashManager.getHashString();
        }
    }
});
