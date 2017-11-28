function SolarSystem(solar_sys_info_obj) {
    var self_solar_sys = this;

    self_solar_sys.name = solar_sys_info_obj.name;
    self_solar_sys.radius = solar_sys_info_obj.radius;
    self_solar_sys.star = solar_sys_info_obj.star;
    self_solar_sys.show_grids = solar_sys_info_obj.show_grids;

    // define parent that contains everything
    // add it back to the scene
    self_solar_sys.parent = new THREE.Object3D();
    solar_sys_info_obj.scene.add(self_solar_sys.parent);

    // now add all
    self_solar_sys.add_all();

    // show grid or not
    self_solar_sys.grid_arr = [];

    self_solar_sys.grids();

    return self_solar_sys;
}

SolarSystem.prototype.add_all = function() {
    var self = this;

    THE_SUN = new CelestialBody({
        radius : self.star.radius,
        rot_time : self.star.rot_time,
        parent : self.parent,
        satellites : self.star.satellites
    });
}

SolarSystem.prototype.grids = function() {
    var self = this;

    var grid_material = new THREE.LineBasicMaterial({
      color: 0x329ca4,
      transparent:true,
	    opacity : 1,
      visible : false
    });

    var geometry = new THREE.Geometry();

    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(self.radius, 0, 0));

    // number of half-lines to have
    var AXIS = 36;

    for (var i = 0; i < AXIS; i++) {
    	var line = new THREE.Line(geometry, grid_material);
    	line.rotation.set(0, (i * Math.PI) / (AXIS / 2), 0);
    	self.parent.add(line);
      self.grid_arr.push(line);
    }

    // defines the extent of gaps between grid circles
    var ROUND = 19;
    var circle_distance = self.radius / ROUND;

    for (var i = 0; i < ROUND + 1; i++) {
        //circles
        var circle = new THREE.Shape();
        circle.moveTo(circle_distance * i, 0 );
        circle.absarc( 0, 0, i * circle_distance, 0, Math.PI*2, false );

        var points = circle.createPointsGeometry(100);
        v_circle = new THREE.Line(points, new THREE.LineBasicMaterial({color : 0x329ca4, transparent:true, visible : false, linewidth: 1}));

        v_circle.rotation.set(Math.PI/2, 0, 0);
        self.parent.add(v_circle);
        self.grid_arr.push(v_circle);
    }
}
