function getPlanetNames() {
  var names = ["sun"];
  solar_sys.star.satellites.forEach(function(element){
    names.push(element.name);
  });
  return names;
}
function getPlanetNames2() {
  var names = ["free cam","sun"];
  solar_sys.star.satellites.forEach(function(element){
    names.push(element.name);
  });
  return names;
}

var ASTEROIDS_NUM = 20;
var camera_focus;
var camera_from;
var asteroid_button;
var asteroids_count = 0;
function displayGUI() {
  var gui = new dat.GUI();
  var jar;
  var gui_step = 0.1;


  parameters = {
    a: "cube",
    b: "Cube",
    c: true,
    d: "#0000ff",
    e: "",
    f: "",
    g:1,h:1,i:1,
    camera_focus:"sun",
    camera_from:"free cam",
    play:true,
    playback_speed:1,
    show_wireframe:false,
    show_grids:false,
    show_background:true
  }

  var playback_folder = gui.addFolder('playback');
  var play = playback_folder.add(parameters, 'play').name('play');
  play.onChange(onChangePlay);
  var playback_speed = playback_folder.add(parameters, 'playback_speed').min(0).max(10).step(gui_step).name('speed');
  playback_speed.onChange(onChangePlaybackSpeed);
  playback_folder.open();

  var camera_folder = gui.addFolder('camera control');
  camera_focus = camera_folder.add(parameters, 'camera_focus', getPlanetNames2()).name('look at');
  camera_from = camera_folder.add(parameters, 'camera_from', getPlanetNames2()).name('look from');
  camera_folder.add({ Reset:onResetCameraPos},'Reset').name('reset camera');
  camera_folder.add({ ResetC:onResetCameraPosCeil},'ResetC').name('ceiling view');
  camera_focus.onChange(onChangeCameraFocus);
  camera_from.onChange(onChangeCameraPos);
  camera_folder.open();

  var graphics_folder = gui.addFolder('graphics');
  var show_wireframe = graphics_folder.add(parameters, 'show_wireframe').name('show wireframe');
  show_wireframe.onChange(onChangeWireframeDisplay);
  var show_grids = graphics_folder.add(parameters, 'show_grids').name('show grids');
  show_grids.onChange(onChangeGridDisplay);
  var show_background = graphics_folder.add(parameters, 'show_background').name('show stars');
  show_background.onChange(onChangeBackgroundDisplay);
  graphics_folder.open();

  var misc_folder = gui.addFolder('misc');
  asteroid_button = misc_folder.add({ Add:onAddAsteroids},'Add').name('+ asteroids (0)');
  misc_folder.open();

/*
  var folder1 = gui.addFolder('folder1');
  var folder2 = gui.addFolder('position');
  var folder3 = gui.addFolder('layers');


  folder1.add(parameters, 'a').name('Name');
  folder1.add(parameters, 'b', ["Cube", "Sphere", "Prism"]).name('Planets');
  folder1.add(parameters, 'c').name('Show Wireframe');
  folder1.addColor(parameters, 'd').name('Color');


  folder2.add(parameters, 'g').min(1).max(20).step(gui_step).name('x-axis');
  folder2.add(parameters, 'h').min(1).max(20).step(gui_step).name('y-axis');
  folder2.add(parameters, 'i').min(1).max(20).step(gui_step).name('z-axis');

  folder3.add(parameters, 'e', [1,2,3,4,5]).name('layer');
*/

  gui.open();


}

function onChangePlay(param) {
  option_play = param;
}

function onChangePlaybackSpeed(param) {
  option_playback_speed = param;
}

function onChangeCameraFocus(param) {
  option_camera_focus = null;
  gl_objects.forEach(function(element){
    if (element.name==param) {
      option_camera_focus = element.body_mesh;
    }
  });
  if (param=='free cam') {
    option_camera_focus = 1;
  }
}

function onChangeCameraPos(param) {
  option_camera_pos = null;
  gl_objects.forEach(function(element){
    if (element.name==param) {
      option_camera_pos = element;
    }
  });
  if (param=='sun') {
    option_camera_pos = 1;
  }
}

function onChangeWireframeDisplay(param) {
  gl_objects.forEach(function(element){
    if (!element.previous_material) {
      element.previous_material = element.body_material;
    }
    if (param) {
      element.body_mesh.material = new THREE.MeshBasicMaterial({
        color: 0xB9F442,
        wireframe: true,
        transparent: true,
        opacity: 1.0,
        visible:true
      });
    }
    else {
      element.body_mesh.material = element.previous_material;
    }
  });
}

function onChangeGridDisplay(param){
  solar_sys.grid_arr.forEach(function(element){
    if (element.material) {
      element.material.visible=param;
    }
  });
}

function onChangeBackgroundDisplay(param) {
  stars_material.visible=param;
  stars_material2.visible=param;
  stars_material3.visible=param;
}

function onResetCameraPos() {
  camera.position.set(init_camera_pos[0], init_camera_pos[1], init_camera_pos[2]);
  camera.up.set(0,1,0);
  controller.target = new THREE.Vector3(0,0,0);
  option_camera_focus = null;
  option_camera_pos = null;
  camera_focus.setValue('sun');
  camera_from.setValue('free cam');
}

function onResetCameraPosCeil() {
  camera.up.set(0,1,0);
  camera.position.set(1000, init_camera_pos[0]*1.5, init_camera_pos[2]);
  controller.target = new THREE.Vector3(0,0,0);
  option_camera_focus = null;
  option_camera_pos = null;
  camera_focus.setValue('sun');
  camera_from.setValue('free cam');
}

function onAddAsteroids() {
  Utils.addAsteroids(ASTEROIDS_NUM);
  asteroids_count+=ASTEROIDS_NUM;
  asteroid_button.name('+ asteroids ('+asteroids_count+')');
}
