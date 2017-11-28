
if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
}

var renderer, camera, scene, div, controller;
var aspect = window.innerWidth / window.innerHeight;
var clock = new THREE.Clock();

var option_play = true;
var option_playback_speed = 1;
var option_camera_focus;
var option_camera_pos;

var init_camera_pos = [60000, 12000, 0];

SYSTEM = {}

SYSTEM.init = function() {
    var self = this;
    camera = new THREE.PerspectiveCamera(30, aspect, 100, 600000);

    // Camera position
    camera.position.set(init_camera_pos[0], init_camera_pos[1], init_camera_pos[2]);
    camera.lookAt(0,0,0);

    // Create a scene
    scene = new THREE.Scene();

    // Create a renderer
    renderer = new THREE.WebGLRenderer({
    	antialias: true
    });

    // renderer settings
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    div = document.getElementById('main_display');
    div.appendChild(renderer.domElement);
    window.addEventListener('resize', self.on_window_resize, false );
    controller = new THREE.TrackballControls(camera, renderer.domElement);
    // add misc objects
    Utils.addBackgroundStars(scene,120000);
    // LIGHT
    var light = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(light);
    var light1 = new THREE.PointLight(0xffffff, 2, 100000);
    light1.position.set(0, 0, 0);
    scene.add(light1);
    Utils.addSun(scene, 500,0,0,0);


    self.animate();
    self.create_solar_sys();

    // create GUI
    displayGUI();
}

// define on_window_resize listener
SYSTEM.on_window_resize = function() {
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controller.handleResize();
}

// global var solar_sys to store the solar system instance
var solar_sys;
var gl_objects=[];

SYSTEM.create_solar_sys = function() {
    // create star from solar_system_info
    var mul = 2;
    var scl = 1.5;
    var star = {
      radius : 2400,
      rot_time : 350,
      satellites : [
        {
          name : 'mercury',
          radius : 150*scl,
          rotation : 0,
          pos : [1800*mul, 0, 0],
          rev_time : 70,
          rot_time : 10,
          satellites : [{
            name : 'moon1',
            radius : 12*scl,
            rotation:40,
            pos : [200*scl, 0, 0],
            rev_time : 20,
            rot_time : 3
          }]
        }, {
          name : 'venus',
          radius : 260*scl,
          rotation : 0,
          pos : [2800*mul, 0, 0],
          rev_time : 140,
          rot_time : 30
        }, {
          name : 'earth',
          radius : 300*scl,
          rotation : 0,
          pos : [4000*mul, 0, 0],
          rev_time : 200,
          rot_time : 30,
          satellites : [{
            name : 'OVERLAY:earth_clouds_map.jpg',
            radius : 320*scl,
            pos : [0, 0, 0],
            rev_time : 1000,
            rot_time : 23,
          },{
            name : 'moon',
            radius : 60*scl,
            pos : [540*scl, 0, 0],
            rev_time : 45,
            rot_time : 3
          }]
        }, {
          name : 'mars',
          radius : 200*scl,
          pos : [5200*mul, 0, 0],
          rev_time : 350,
          rot_time : 30,
          satellites : [{
            name : 'moon2',
            radius : 20*scl,
            pos : [300*scl, 0, 0],
            rev_time : 15,
            rotation : 0,
            rot_time : 3
          }, {
            name : 'moon3',
            radius : 10*scl,
            pos : [240*scl, 0, 0],
            rev_time : 20,
            rot_time : 3,
            rotation : -20
          }]
        }, {
          name : 'jupiter',
          radius : 1000*scl,
          rotation : 0,
          pos : [10000*mul, 0, 0],
          rev_time : 700,
          rot_time : 100,
          satellites : [{
            name : 'moon1',
            radius : 80*scl,
            rotation : 50,
            pos : [1050*scl, 0, 0],
            rev_time : 200,
            rot_time : 3
          }, {
            name : 'moon3',
            radius : 50*scl,
            rotation : 10,
            pos : [1150*scl, 100, 0],
            rev_time : 100,
            rot_time : 3
          }]
        },{
          name : 'saturn',
          radius : 900*scl,
          rotation : 0,
          pos : [14000*mul, 0, 0],
          rev_time : 1100,
          rot_time : 40,
          satellites : [{
            name : 'moon2',
            radius : 100*scl,
            rotation : 50,
            pos : [1000*scl, 0, 0],
            rev_time : 200,
            rot_time : 3
          }]
        }, {
          name : 'uranus',
          radius : 700*scl,
          rotation : 0,
          pos : [17000*mul, 0, 0],
          rev_time : 2500,
          rot_time : 180
        }, {
          name : 'neptune',
          radius : 750*scl,
          rotation : 0,
          pos : [-22000*mul, 0, 0],
          rev_time : 3500,
          rot_time : 100,
          satellites : [{
            name : 'moon4',
            radius : 30*scl,
            pos : [700*scl, 0, 0],
            rev_time : 15,
            rotation : 40,
            rot_time : 8
          }, {
            name : 'moon3',
            radius : 60*scl,
            pos : [780*scl, 0, 0],
            rev_time : 20,
            rot_time : 6,
            rotation : -200
          }, {
            name : 'moon2',
            radius : 50*scl,
            pos : [800*scl, 0, 0],
            rev_time : 30,
            rot_time : 12,
            rotation : -80
          }]
        }
      ]
    }

    solar_sys = new SolarSystem({
    	name : 'Galaxy',
    	radius : 45000,
    	scene : scene,
	    show_grids : false,
	    star: star
    });
}

// camera look-at and look-from controls
function camera_control() {

  if (option_camera_focus==1){
  } else if (option_camera_focus) {
    scene.updateMatrixWorld();
    var vector = new THREE.Vector3();
    vector.setFromMatrixPosition(option_camera_focus.matrixWorld);
    controller.target = vector;
  } else {
    controller.target = new THREE.Vector3(0,0,0);
  }

  if (option_camera_pos==1) {
    var vector = new THREE.Vector3();
    var radius = solar_sys.star.radius;
    camera.position.set(0,0,0);
    var view_vector = new THREE.Vector3();
    camera.getWorldDirection(view_vector);
    vector.x = view_vector.x * radius;
    vector.y = view_vector.y * radius;
    vector.z = view_vector.z * radius;
    camera.position.set(vector.x, vector.y, vector.z);
  } else if (option_camera_pos) {
    scene.updateMatrixWorld();
    var vector = new THREE.Vector3();
    var radius = option_camera_pos.radius;

    var view_vector = new THREE.Vector3();

    camera.getWorldDirection(view_vector);

    vector.setFromMatrixPosition(option_camera_pos.body_mesh.matrixWorld);
    vector.x += view_vector.x * radius;
    vector.y += view_vector.y * radius;
    vector.z += view_vector.z * radius;
    camera.position.set(vector.x, vector.y, vector.z);
  }

}

SYSTEM.animate = function() {
  var delta = clock.getDelta();
  requestAnimationFrame(SYSTEM.animate);

  if (solar_sys && option_play) {
      solar_sys.parent.traverse(function(child) {
          if (child.animate)
            child.animate(option_playback_speed*delta*60);
      });
  }

  // camera focus
  camera_control();

  controller.update();
  renderer.render(scene, camera);
}

SYSTEM.init();
