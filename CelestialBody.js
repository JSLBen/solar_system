function CelestialBody(body_info_obj) {
    var self = this;

    self.name = body_info_obj.name;
    self.radius = body_info_obj.radius;
    self.rot_time = body_info_obj.rot_time || 1;
    self.rev_time = body_info_obj.rev_time || 0;
    self.satellites_info = body_info_obj.satellites || [];
    self.scene = body_info_obj.scene || null;
    self.is_satellite = body_info_obj.is_satellite || false;
    self.type = body_info_obj.type || "";

    self.parallel_to_orbit = new THREE.Object3D();
    self.parallel_to_orbit.rotation.x = (Math.PI/180) * (body_info_obj.rotation || 0);

    self.pos = (body_info_obj.pos ? body_info_obj.pos : [0, 0, 0]);

    self.body_obj = new THREE.Object3D();
    self.body_obj.position.set(self.pos[0], 0, self.pos[2]);

    self.center_of_rev = new THREE.Object3D();

    if (body_info_obj.parent && self.is_satellite == false)
        body_info_obj.parent.add(self.body_obj);
    else if (body_info_obj.parent && self.is_satellite) {
        self.parallel_to_orbit.add(self.center_of_rev);
        self.center_of_rev.add(self.body_obj);
        body_info_obj.parent.add(self.parallel_to_orbit);
    }

    self.draw();
    self.draw_satellites();
    self.animations();

    return self;
}

CelestialBody.prototype.draw = function() {
    var self = this;
    var material;

    if (self.name == undefined) self.asteroid_info = [];

    // draw a ring if it is a saturn
    if (self.name == "saturn") {
      // draw n circles
      var rad = self.radius;
      var start_rad = self.radius * 1.5;
      var end_rad = start_rad + rad;
      var n = 17;
      for (var i = 0; i < n; i++) {
        var color;
        if (i < 4) {
          color = 0x3a2a04;
        } else if (i < 11) {
          color = 0xad9764;
        } else if (i < 13) {
          color = 0x111111
        } else {
          color = 0xdfbe9b
        }
        var circle_rad = start_rad + i * (end_rad - start_rad) / n;

        var circle = new THREE.Shape();
        circle.moveTo(self.pos[0] + circle_rad, 0);
        circle.absarc(0, 0, circle_rad, 0, Math.PI * 2, false);
        var points = circle.createPointsGeometry(100);

        var v_circle_mat = new THREE.LineBasicMaterial({
          color: color,
          opacity: 0.1,
          linewidth: 2
        });
        v_circle = new THREE.Line(points, v_circle_mat);

        v_circle.rotation.set(Math.PI / 180 * 110, 0, 0);

        // add circles to self.body_obj
        self.body_obj.add(v_circle);
        var gl_obj = {body_mesh:v_circle, body_material:v_circle_mat};
        gl_objects.push(gl_obj);
      }
    }

    // sun
    if (!self.name) {
      material = new THREE.MeshBasicMaterial({
        color: 0xFFFFFF,
        map: new THREE.TextureLoader().load("textures/sunmap.jpg"),
        wireframe: false,
        transparent: true,
        opacity: 1.0,
        visible:true
      });
    }
    // planets
    else if (PLANET_NAMES.indexOf(self.name)!=-1) {
      material = Materials.loadPlanetMat(PLANET_NAMES.indexOf(self.name));
    }
    // clouds and stuff as satellites
    else if (self.name.startsWith("OVERLAY")) {
      info = self.name.substr(8);
      material = Materials.loadSphereMat(info, 0.8, 0.1, 0.3);
    }
    // satellites or unspecified
    else {
      material = Materials.loadSatelliteMat(self.name);
    }

    var size = 16;
    if (self.type == 'asteroid')
      size = 4;
    var geometry = new THREE.SphereBufferGeometry(self.radius, size, size);

    var mesh_tmp = self.body_mesh = new THREE.Mesh(geometry, material);
    //self.body_mesh.rotation.z = (Math.PI/180) * (23);
    self.body_material = material;
    self.body_obj.add(self.body_mesh);

    if (self.type == 'asteroid') {
      self.body_mesh.position.set(0,0,0);
      //scene.add(self.body_mesh);
    }

    // add to datastructure
    gl_objects.push(self);
    /*THE_SUN.star.satellites.forEach(function(element){
      if (element.name == self.name) {
        element.body_mesh = self.body_mesh;
        element.body_material = material;
      }
    });*/

}

CelestialBody.prototype.draw_asteroids = function() {
    var self = this;
    var draw_asteroid = function(sat_info1) {
        sat_info1.is_satellite = true;
        sat_info1.scene = scene;
        sat_info1.parent = self.body_obj;
        new CelestialBody(sat_info1);
    };

    self.asteroid_info = self.asteroid_info.concat(self.new_asteroid_info);

    for (var i = 0; i < self.new_asteroid_info.length; i++) {
        draw_asteroid(self.new_asteroid_info[i]);
    }
}

CelestialBody.prototype.draw_satellites = function() {
    var self = this;
    var draw_satellite = function(sat_info1) {
        sat_info1.is_satellite = true;
        sat_info1.scene = scene;
        sat_info1.parent = self.body_obj;
        new CelestialBody(sat_info1);
    };

    for (var i = 0; i < self.satellites_info.length; i++) {
        draw_satellite(self.satellites_info[i]);
    }
}

// add animations
CelestialBody.prototype.animations = function() {
    var self = this;

    self.animation_func_arr = [];

    // rotation
    self.animation_func_arr.push(function(speed) {
        self.body_mesh.rotation.y += speed / self.rot_time;
    });

    // revolution
    if (self.center_of_rev) {
        self.animation_func_arr.push(function(speed) {
            self.center_of_rev.rotation.y += speed / self.rev_time;
        });
    }

    self.body_obj.animate = function(speed) {
        self.animation_func_arr.forEach(function(animation_func) {
            animation_func(speed);
        });
    };
}
