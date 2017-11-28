Materials = {}

var PLANET_NAMES = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune"
]

var MOON_NAMES = [
  "moon",
  "moon1",
  "moon2",
  "moon3",
  "moon4"
]


var AST_NAMES = [
  "asteroid2",
  "asteroid",
  "asteroid4",
  "ast"
]

var PLANETS_REFLECTIVE_PARAMS = [
  [0.6, 0.12],
  [0.9, 0.5],
  [0.6, 0.2],
  [0.8, 0.1],
  [0.9, 0],
  [1, 0],
  [0.6, 0.2],
  [0.7, 0.29],
]


Materials.loadPlanetMat = function(planet_id) {
  return new THREE.MeshStandardMaterial({
    color: 0xF3FFE2,
    roughness: PLANETS_REFLECTIVE_PARAMS[planet_id][0],
    metalness: PLANETS_REFLECTIVE_PARAMS[planet_id][1],
    emissive: 0xffffff,
    emissiveIntensity: 0.0,
    map: new THREE.TextureLoader().load("textures/"+PLANET_NAMES[planet_id]+"map.jpg"),
    opacity:1,
    transparent:true,
    wireframe:false
  });
}

Materials.loadSatelliteMat = function(satellite_name) {
  var rough = 0.7
  var metal = 0.4
  texture_file = satellite_name;
  if (MOON_NAMES.indexOf(satellite_name)==-1) {
    texture_file = AST_NAMES[parseInt(Math.random()*AST_NAMES.length)];
    rough = 0.3
    metal = 1
  }

  return new THREE.MeshStandardMaterial({
    color: 0xF3FFE2,
    roughness: 0.8,
    metalness: 0.3,
    map: new THREE.TextureLoader().load("textures/"+texture_file+"map.jpg"),
    opacity:1,
    transparent:true,
    wireframe:false
  });
}

Materials.loadSphereMat = function(texture_file, diffuse, specular, opacity) {
  return new THREE.MeshStandardMaterial({
    color: 0xF3FFE2,
    roughness: diffuse,
    metalness: specular,
    emissive: 0xffffff,
    emissiveIntensity: 0.0,
    map: new THREE.TextureLoader().load("textures/"+texture_file),
    opacity:opacity,
    transparent:true,
    wireframe:false
  });
}
