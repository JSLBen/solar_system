## Solar System Visualized

# Execution guide
python -m http.server 8000
enter URL "localhost:8000" in web browser (tested with Python 3.6 and Chrome)


# Directory and files
Under root /:
    index.html: main web page

    CelestialBody.js: handles recursive rendering of each planet / satellite

    gui.js: ui objects and event handlers

    helper_util.js:

    materials.js:

    SolarSystem.js: creates and maintains data structure for objects in the scene.

    ./textures: includes image files that are used as textures

    ./lib: includes external libraries used in the project, such as three.js and TrackballControls.js

Under lib/:
    dat.gui.min.js
    Detector.js
    three_new_min.js
    TrackballControls.js
    underscore-min.js
