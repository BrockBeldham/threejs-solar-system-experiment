(function () {
    var global = this;
    
    var THREE = global.THREE,
        requestAnimationFrame = global.requestAnimationFrame;

    var renderer, scene, camera, controls, light, material;
    var mouse = new THREE.Vector2();
    
    var theMilkyWay, theSun, mercury, venus, earth, mars, asteroidBelt, jupiter, saturn, saturnRing, uranus, neptune;

    // planet/sun Size = 100,000km : 50 units (sun is ~696342km r = sunSize = 348.15)
    // AU = 150 mil km : 50 units
    // planet Orbit Radius = 1AU : 1AU (marcury is 0.4AU from sun = sunSize + (AU * 0.4))
    // planet Orbit Speed = 1km : 0.02 units
    
    var AU = 50;

    var milkyWaySize = 15000;

    var sunSize = 348.15;

    var mercurySize = 1.2,
        mercuryOrbitRadius = sunSize + (AU * 0.4),
        mercuryOrbitAngle = getRandomArbitrary(0, 360),
        mercuryOrbitSpeed = 0.8,
        mercuryRotateSpeed = 0.05;
    
    var venusSize = 3,
        venusOrbitRadius = sunSize + (AU * 0.7),
        venusOrbitAngle = getRandomArbitrary(0, 360),
        venusOrbitSpeed = 0.7,
        venusRotateSpeed = 0.05;
    
    var earthSize = 3,
        earthOrbitRadius = sunSize + AU,
        earthOrbitAngle = getRandomArbitrary(0, 360),
        earthOrbitSpeed = 0.6,
        earthRotateSpeed = 0.05;
    
    var marsSize = 1.6,
        marsOrbitRadius = sunSize + (AU * 1.5),
        marsOrbitAngle = getRandomArbitrary(0, 360),
        marsOrbitSpeed = 0.48,
        marsRotateSpeed = 0.05;

    var asteroidOrbitStart = sunSize + (AU * 2.3),
        asteroidOrbitEnd = sunSize + (AU * 3.3);
    
    var jupiterSize = 34.99,
        jupiterOrbitRadius = sunSize + (AU * 5.2),
        jupiterOrbitAngle = getRandomArbitrary(0, 360),
        jupiterOrbitSpeed = 0.26,
        jupiterRotateSpeed = 0.05;
    
    var saturnSize = 29.1,
        saturnOrbitRadius = sunSize + (AU * 9.5),
        saturnOrbitAngle = getRandomArbitrary(0, 360),
        saturnOrbitSpeed = 0.18,
        saturnRotateSpeed = 0.05;

    var saturnRingStart = saturnSize + 3.3,
        saturnRingEnd = saturnSize + 60;
    
    var uranusSize = 12.7,
        uranusOrbitRadius = sunSize + (AU * 19.2),
        uranusRotateSpeed = 0.05;

    var uranusRingStart = uranusSize + 3,
        uranusRingEnd = uranusSize + 40;
    
    var neptuneSize = 12.3,
        neptuneOrbitRadius = sunSize + (AU * 30.1),
        neptuneOrbitAngle = getRandomArbitrary(0, 360),
        neptuneOrbitSpeed = 0.1,
        neptuneRotateSpeed = 0.05;
    
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;


    init();
    animate();

    function init() {
        scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.00008);

        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 100000);
        camera.position.z = 2000;

        controls = new THREE.TrackballControls(camera);
        controls.rotateSpeed = 1.0;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 0.8;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        renderer = new THREE.WebGLRenderer();
        renderer.setSize(WIDTH, HEIGHT);
        document.body.appendChild(renderer.domElement);
    
        //ambient light
        //scene.add(new THREE.AmbientLight(0xaaaaaa));
        scene.add(new THREE.AmbientLight(0x222222));

        //sunlight?
        light = new THREE.PointLight(0xffffff, 1, 0);
        light.position.set(0, 0, 0);
        scene.add(light);
    
    
        //the Milky Way
        material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/milky-way.jpg'),
            side: THREE.DoubleSide
        });
        milkyWay = new THREE.Mesh(new THREE.SphereGeometry(milkyWaySize, 35, 35 ), material);
        scene.add(milkyWay);
    
    
        //the sun
        //SphereGeometry(size of sphere, higher the numeber the smoother the sphere and more processing)
        material = new THREE.MeshBasicMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/sun.jpg'),
            side: THREE.DoubleSide
        });
        theSun = new THREE.Mesh(new THREE.SphereGeometry(sunSize, 35, 35 ), material);
        scene.add(theSun);
    
    
        //mercury
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/mercury.jpg'),
            shading: THREE.SmoothShading
        });
        mercury = new THREE.Mesh(new THREE.SphereGeometry(mercurySize, 15, 15), material);
        scene.add(mercury);
    
    
        //venus
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/venus.jpg'),
            shading: THREE.SmoothShading
        });
        venus = new THREE.Mesh(new THREE.SphereGeometry(venusSize, 15, 15), material);
        scene.add(venus);
    
    
        //earth
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/earth.jpg'),
            shading: THREE.SmoothShading
        });
        earth = new THREE.Mesh(new THREE.SphereGeometry(earthSize, 15, 15), material);
        scene.add(earth);
    
    
        //mars
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/mars.jpg'),
            shading: THREE.SmoothShading
        });
        mars = new THREE.Mesh( new THREE.SphereGeometry(marsSize, 15, 15), material);
        scene.add(mars);


        //asteroid belt?
        asteroidBelt = new THREE.Object3D();
        scene.add(asteroidBelt);

        for(var x=0; x<3000; x++) {
            var asteroidSize = getRandomArbitrary(0.005, 0.5),
                asteroidShape1 = getRandomArbitrary(4, 10),
                asteroidShape2 = getRandomArbitrary(4, 10),
                asteroidOrbit = getRandomArbitrary(asteroidOrbitStart, asteroidOrbitEnd),
                asteroidPositionY = getRandomArbitrary(-2, 2);

            var asteroid = new THREE.Mesh( new THREE.SphereGeometry(asteroidSize, asteroidShape1, asteroidShape2),   new THREE.MeshLambertMaterial({color:0xeeeeee}));

            asteroid.position.y = asteroidPositionY;
            var radians = getRandomArbitrary(0, 360) * Math.PI / 180;
            asteroid.position.x = Math.cos(radians) * asteroidOrbit;
            asteroid.position.z = Math.sin(radians) * asteroidOrbit;

            asteroidBelt.add(asteroid);
        }
    
    
        //jupiter
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/jupiter.jpg'),
            shading: THREE.SmoothShading
        });
        jupiter = new THREE.Mesh( new THREE.SphereGeometry(jupiterSize, 25, 25), material);
        scene.add(jupiter);
    
    
        //saturn
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/saturn.jpg'),
            shading: THREE.SmoothShading
        });
        saturn = new THREE.Mesh( new THREE.SphereGeometry(saturnSize, 25, 25), material);
        scene.add(saturn);
        //saturns rings
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/saturn-ring.jpg'),
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide
        });
        saturnRing = new THREE.Mesh( new THREE.RingGeometry(saturnRingStart, saturnRingEnd, 30), material);
        saturn.add(saturnRing);
        saturnRing.rotation.x = 90 * Math.PI / 180;

    
    
        //uranus
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/uranus.jpg'),
            shading: THREE.SmoothShading
        });
        uranus = new THREE.Mesh( new THREE.SphereGeometry(uranusSize, 20, 20), material);
        theSun.add(uranus);
        //saturns rings
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/uranus-ring.png'),
            shading: THREE.SmoothShading,
            side: THREE.DoubleSide,
            transparent: true
        });
        uranusRing = new THREE.Mesh( new THREE.RingGeometry(uranusRingStart, uranusRingEnd, 30), material);
        uranus.add(uranusRing);
        //uranus' wierd positioning
        var radians = 0 * Math.PI / 180;
        uranus.position.x = Math.cos(radians) * uranusOrbitRadius;
        uranus.position.z = Math.sin(radians) * uranusOrbitRadius;
        uranusRing.rotation.x = 90 * Math.PI / 180;
        uranus.rotation.z = 90 * Math.PI / 180;
    
    
        //neptune
        material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture('static/img/neptune.jpg'),
            shading: THREE.SmoothShading
        });
        neptune = new THREE.Mesh( new THREE.SphereGeometry(neptuneSize, 20, 20), material);
        scene.add(neptune);


        window.addEventListener('resize', onWindowResize, false);

        renderer.domElement.addEventListener('mousemove', onMouseMove);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerWidth;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerWidth );
    }

    function onMouseMove(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }

    function animate() {
        requestAnimationFrame(animate);

        render();
    }

    
    function render() {
        controls.update();
        
        theSun.rotation.y += 0.001;
        asteroidBelt.rotation.y += 0.0001;

        uranus.rotation.x -= uranusRotateSpeed;
        
        
        //run mercury's orbit around the Sun
        mercuryOrbitAngle -= mercuryOrbitSpeed;
        var radians = mercuryOrbitAngle * Math.PI / 180;
        mercury.position.x = Math.cos(radians) * mercuryOrbitRadius;
        mercury.position.z = Math.sin(radians) * mercuryOrbitRadius;
        mercury.rotation.y += mercuryRotateSpeed;
        
        
        //run venus's orbit around the Sun
        venusOrbitAngle -= venusOrbitSpeed;
        var radians = venusOrbitAngle * Math.PI / 180;
        venus.position.x = Math.cos(radians) * venusOrbitRadius;
        venus.position.z = Math.sin(radians) * venusOrbitRadius;
        venus.rotation.y -= venusRotateSpeed;
        
        
        //run earth's orbit around the Sun
        earthOrbitAngle -= earthOrbitSpeed;
        var radians = earthOrbitAngle * Math.PI / 180;
        earth.position.x = Math.cos(radians) * earthOrbitRadius;
        earth.position.z = Math.sin(radians) * earthOrbitRadius;
        earth.rotation.y += earthRotateSpeed;
        
        
        //run mars's orbit around the Sun
        marsOrbitAngle -= marsOrbitSpeed;
        var radians = marsOrbitAngle * Math.PI / 180;
        mars.position.x = Math.cos(radians) * marsOrbitRadius;
        mars.position.z = Math.sin(radians) * marsOrbitRadius;
        mars.rotation.y += marsRotateSpeed;
        
        
        //run jupiter's orbit around the Sun
        jupiterOrbitAngle -= jupiterOrbitSpeed;
        var radians = jupiterOrbitAngle * Math.PI / 180;
        jupiter.position.x = Math.cos(radians) * jupiterOrbitRadius;
        jupiter.position.z = Math.sin(radians) * jupiterOrbitRadius;
        jupiter.rotation.y += jupiterRotateSpeed;
        
        
        //run saturn's orbit around the Sun
        saturnOrbitAngle -= saturnOrbitSpeed;
        var radians = saturnOrbitAngle * Math.PI / 180;
        saturn.position.x = Math.cos(radians) * saturnOrbitRadius;
        saturn.position.z = Math.sin(radians) * saturnOrbitRadius;
        saturn.rotation.y += saturnRotateSpeed;
        
        
        //run neptune's orbit around the Sun
        neptuneOrbitAngle -= neptuneOrbitSpeed;
        var radians = neptuneOrbitAngle * Math.PI / 180;
        neptune.position.x = Math.cos(radians) * neptuneOrbitRadius;
        neptune.position.z = Math.sin(radians) * neptuneOrbitRadius;
        neptune.rotation.y += neptuneRotateSpeed;
        
        renderer.render( scene, camera );
    }

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }
    
}).call(this);