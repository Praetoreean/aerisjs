define(['aeris', 'aeris/promise', 'base/animation'], function(aeris) {

  /**
   * @fileoverview Implementation of the composite pattern for syncing multiple
   *               animations.
   */


  aeris.provide('aeris.maps.animations.AnimationSync');


  /**
   * Create a sync object to manage the animation syncing of multiple
   * animations.
   *
   * @param {Array.<aeris.maps.Layer>} layers An array of layers to animate.
   * @constructor
   * @extends {aeris.maps.Animation}
   */
  aeris.maps.animations.AnimationSync = function(layers) {


    /**
     * The layers being animated.
     *
     * @type {Array.<aeris.maps.Layer>}
     * @private
     */
    this.layers_ = layers;


    /**
     * The animation instances
     *
     * @type {Array.<aeris.maps.Animation}
     * @private
     */
    this.animations_ = [];


    /**
     * Promise that the sync will be initialized.
     *
     * @type {aeris.Promise}
     */
    this.initialized = new aeris.Promise();


    this.initialize_();

  };
  aeris.inherits(aeris.maps.animations.AnimationSync, aeris.maps.Animation);


  /**
   * Initialize the creation of the animations.
   *
   * @private
   */
  aeris.maps.animations.AnimationSync.prototype.initialize_ = function() {
    var length = this.layers_.length;
    for (var i = 0; i < length; i++) {
      var layer = this.layers_[i];
      var animation = layer.animate();
      this.animations_.push(animation);
    }
    this.whenReady_();
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.start = function() {
    var self = this;
    this.initialized.done(function() {
      var length = self.animations_.length;
      for (var i = 1; i < length; i++) {
        var anim = self.animations_[i];
        var bootStart = function() {
          anim.stop();
          anim.off('start', bootStart, self);
        };
        anim.on('start', bootStart, self);
        anim.start();
      }
      var syncAnim = self.getSyncToAnimation();
      syncAnim.on('change:time', self.goToTime, self);
      syncAnim.start();
    });
  };


  /**
   * @override
   */
  aeris.maps.animations.AnimationSync.prototype.goToTime = function(time) {
    var length = this.animations_.length;
    for (var i = 1; i < length; i++) {
      var anim = this.animations_[i];
      anim.goToTime(time);
    }
  };


  /**
   * Get the main layer to sync to.
   *
   * @return {aeris.maps.Layer}
   */
  aeris.maps.animations.AnimationSync.prototype.getSyncToLayer = function() {
    return this.layers_[0];
  };


  /**
   * Get the main animation to sync to.
   *
   * @return {aeris.maps.Animation}
   */
  aeris.maps.animations.AnimationSync.prototype.getSyncToAnimation =
      function() {
    return this.animations_[0];
  };


  /**
   * Determine when the layers have been initialized and the animation times
   * have been loaded.
   *
   * @return {aeris.Promise}
   * @private
   */
  aeris.maps.animations.AnimationSync.prototype.whenReady_ = function() {
    var init = this.initialized;
    var promises = [];
    var length = this.layers_.length;
    for (var i = 0; i < length; i++) {
      var anim = this.animations_[i];
      promises.push(anim.getTimes());
      var layer = this.layers_[i];
      promises.push(layer.initialized);
    }
    aeris.Promise.when(promises).done(function(responses) {
      init.resolve();
    });
  };


  return aeris.maps.animations.AnimationSync;

});