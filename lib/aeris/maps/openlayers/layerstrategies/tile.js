define(['aeris', 'base/layerstrategy', './mixins/default'], function(aeris) {

  /**
   * @fileoverview Layer manager strategy for support of Tile layer with
   *               OpenLayers.
   */


  aeris.provide('aeris.maps.openlayers.layerstrategies.Tile');


  /**
   * A strategy for support of Tile layer with OpenLayers.
   *
   * @constructor
   * @extends {aeris.maps.LayerStrategy}
   * @extends {aeris.maps.openlayers.layerstrategies.mixins.Default}
   */
  aeris.maps.openlayers.layerstrategies.Tile = function() {
    aeris.maps.LayerStrategy.call(this);
  }
  aeris.inherits(aeris.maps.openlayers.layerstrategies.Tile,
                 aeris.maps.LayerStrategy);
  aeris.extend(aeris.maps.openlayers.layerstrategies.Tile.prototype,
               aeris.maps.openlayers.layerstrategies.mixins.Default);


  /**
   * @param {Array.<string>} opt_urls An optional array of URLs.
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.createInstanceLayer =
      function(layer, opt_urls) {
    var urls = opt_urls || this.createUrls(layer);
    var instanceLayer = new OpenLayers.Layer.XYZ(
      layer.name, urls,
      {
        isBaseLayer: false,
        sphericalMercator: true,
        wrapDateLine: true,
        transitionEffect: 'resize'
      });
    return instanceLayer;
  };


  /**
   * Create the URLs for loading tiles.
   *
   * @param {aeris.maps.Layer} layer The Aeris Layer to gather information.
   * @return {Array.<string>} An array of URLs
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.createUrls =
      function(layer) {
    var urls = [];
    var length = layer.subdomains.length;
    for (var i = 0; i < length; i++) {
      var subdomain = layer.subdomains[i];
      var url = layer.url;
      url = url.replace(/\{d\}/, subdomain);
      url = url.replace(/\{z\}/, '${z}');
      url = url.replace(/\{x\}/, '${x}');
      url = url.replace(/\{y\}/, '${y}');
      urls.push(url);
    }
    return urls;
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.showLayer =
      function(instanceLayer) {
    instanceLayer.setVisibility(true);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.hideLayer =
      function(instanceLayer) {
    instanceLayer.setVisibility(false);
  };


  /**
   * @override
   */
  aeris.maps.openlayers.layerstrategies.Tile.prototype.setLayerOpacity =
      function(layer, opacity) {
    layer.setOpacity(opacity);
  };


  return aeris.maps.openlayers.layerstrategies.Tile;

});