/*
 * Aria Templates
 * Copyright Amadeus s.a.s.
 */
/**
 * Class to be extended to create a template test case using the Robot applet. The applet allows to execute user actions
 * (click, type, move, drag, ...) as if they were done by the user instead of simulating browser events.<br />
 * This test makes sure that the robot is loaded and initialized before starting the template test case
 */
Aria.classDefinition({
    $classpath : "aria.jsunit.RobotTestCase",
    $extends : "aria.jsunit.TemplateTestCase",
    $dependencies : ["aria.jsunit.SynEvents", "aria.jsunit.Robot"],
    $constructor : function () {
        this.$TemplateTestCase.constructor.call(this);

        /**
         * Events utility to simulate user actions
         * @type aria.jsunit.SynEvents
         */
        this.synEvent = aria.jsunit.SynEvents;
    },
    $destructor : function () {
        this.synEvent = null;
        this.$TemplateTestCase.$destructor.call(this);
    },
    $prototype : {
        /**
         * Main method that will run all the test methods attached to the object. This method checks whether the robot
         * is usable before calling the same method from the parent class.
         * @see aria.jsunit.Test
         * @override
         */
        run : function () {
            var robot = aria.jsunit.Robot;
            if (!this.skipTest && !robot.isUsable()) {
                this._startTest();
                this.raiseFailure('The robot is not usable');
                this._endTest();
            } else {
                this.$TemplateTestCase.run.call(this);
            }
        },

        /**
         * Helper function, loads the template into the div. Executes the parameter callback once the template has been
         * successfully rendered. This method initializes the robot before calling the same method from the parent
         * class.
         * @param {aria.core.CfgBeans:Callback} cb Callback
         * @protected
         * @override
         */
        _loadTestTemplate : function (cb) {
            var robot = aria.jsunit.Robot;
            robot.initRobot({
                fn : this.$TemplateTestCase._loadTestTemplate,
                scope : this,
                resIndex : -1,
                args : cb
            });
        },

        /**
         * Called when the iframe and its dependencies are loaded. This method initializes the robot before calling the
         * same method from the parent class.
         * @param {Object} args
         * @protected
         * @override
         */
        _iframeLoad : function (args) {
            var window = args.iframe.contentWindow;
            window.Aria.load({
                classes : ["aria.jsunit.SynEvents", "aria.jsunit.Robot"],
                oncomplete : {
                    scope : this,
                    fn : function () {
                        var robot = window.aria.jsunit.Robot;
                        robot.initRobot({
                            fn : this.$TemplateTestCase._iframeLoad,
                            scope : this,
                            resIndex : -1,
                            args : args
                        });
                    }
                }
            });
        },

        /**
         * Callback executed when the template/data/moduleCtrl is loaded. This method makes sure the synEvent shortcut
         * is using aria.jsunit.SynEvents from the correct frame, before calling the same method from the parent class.
         * @protected
         * @override
         */
        _templateLoadCB : function () {
            this.synEvent = this.testWindow.aria.jsunit.SynEvents;
            return this.$TemplateTestCase._templateLoadCB.apply(this, arguments);
        }
    }
});