/**
 * @fileoverview Define the MoveWaypointCommand
*/
define([
  'aeris',
  'gmaps/route/commands/abstractroutecommand',
  'aeris/emptypromise'
], function(aeris, AbstractRouteCommand, EmptyPromise) {
  aeris.provide('aeris.maps.gmaps.route.commands.MoveWaypointCommand');

  aeris.maps.gmaps.route.commands.MoveWaypointCommand = function(route, waypoint, latLon) {
    AbstractRouteCommand.call(this, route);


    /**
     * The waypoint we're moving.
     *
     * @type {aeris.maps.gmaps.route.Waypoint}
     * @private
     */
    this.waypoint_ = waypoint;


    /**
     * The latLon to move to.
     *
     * @type {Array.<Array>}
     * @private
     */
    this.newLatLon_ = latLon;


    /**
     * The original latLon of the waypoint,
     * for purposes of undoing.
     *
     * @type {Array.<Array>}
     * @private;
     */
    this.originalLatLon_;

    /**
     * The original geocoded latLon of the waypoint,
     * for purposes of undoing.
     *
     * @type {Array.<Array>}
     * @private;
     */
    this.originalGeocodedLatLon_;
  };
  aeris.inherits(
    aeris.maps.gmaps.route.commands.MoveWaypointCommand,
    AbstractRouteCommand
  );


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.MoveWaypointCommand.prototype.execute_ = function() {
    this.originalLatLon_ = this.waypoint_.latLon.slice(0);
    this.originalGeocodedLatLon_ = this.waypoint_.geocodedLatLon ? this.waypoint_.geocodedLatLon.slice(0) : null;

    this.waypoint_.set({
      latLon: this.newLatLon_,
      geocodedLatLon: null
    });

    return new EmptyPromise();
  };


  /**
   * @override
   */
  aeris.maps.gmaps.route.commands.MoveWaypointCommand.prototype.undo_ = function() {
    this.waypoint_.set({
      latLon: this.originalLatLon_,
      geocodedLatLon: this.originalGeocodedLatLon_
    });

    return new EmptyPromise();
  };


  return aeris.maps.gmaps.route.commands.MoveWaypointCommand;
});