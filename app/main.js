require.config({
    paths: {
        text: '../node_modules/text/text',
        jQuery: '../bower_components/jquery/dist/jquery.min',
        ThreeCore: '../bower_components/three.js/three',
        OrbitControls: 'orbit-controls'
    },
    shim: {
        jQuery: {
            exports: "$"
        },
        ThreeCore: {
            exports: "THREE"
        },
        OrbitControls: ["ThreeCore"]
    },
    priority: []
});

window.name = 'NG_DEFER_BOOTSTRAP!';

require(['jQuery', 
        'ThreeCore', 
        "text!shaders/fragmentShader.glsl", 
        "text!shaders/vertexShader.glsl",
        "text!shaders/renderingFragment.glsl",
        "text!shaders/renderingVertex.glsl",
        "text!shaders/simplex-noise-3d.glsl",
        "text!shaders/simplex-noise-4d.glsl",
        'OrbitControls'
        ], function (jQuery, THREE, FragmentShader, VertexShader, renderingFragment, renderingVertex, noiseA, noiseB) {
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;

    var noise = noiseA;

    // set some camera attributes
    var VIEW_ANGLE = 45,
        ASPECT = WIDTH / HEIGHT,
        NEAR = 0.1,
        FAR = 10000;
    // get the DOM element to attach to
    // - assume we've got jQuery to hand
    var element = jQuery('#container');

    // create a WebGL renderer, camera
    // and a scene
    var renderer = new THREE.WebGLRenderer();
    var camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);

    var scene = new THREE.Scene();

    var glassScene = new THREE.Scene();

    var renderingScene = new THREE.Scene();

    var renderTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT,{
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    });

    var glassTarget = new THREE.WebGLRenderTarget(WIDTH, HEIGHT,{
        minFilter: THREE.LinearFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBFormat
    }); 

    // add the camera to the scene
    scene.add(camera);

    var controls = new THREE.OrbitControls(camera);

    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 300;

    // start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // attach the render-supplied DOM element
    element.append(renderer.domElement);

    // set up the sphere vars
    var radius = 50,
        segments = 16,
        rings = 16;

    var sphereMaterial =
        new THREE.MeshLambertMaterial({
            color: 0xCC0000
        });

    var groundMaterial = 
        new THREE.MeshLambertMaterial({
            color: 0x00CCCC
        });

    var glassMaterial =
        new THREE.ShaderMaterial({
            uniforms: {
                scene: {type: "t", value: renderTarget}
            },
            vertexShader: noise + VertexShader,
            fragmentShader: noise + FragmentShader,
            transparent: true
        });

    var renderingMaterial = 
        new THREE.ShaderMaterial({
            uniforms: {
                scene: {type: "t", value: renderTarget},
                glassScene: {type: "t", value: glassTarget}
            },
            vertexShader: renderingVertex,
            fragmentShader: renderingFragment,
            transparent: true
        });

    // create a new mesh with
    // sphere geometry - we will cover
    // the sphereMaterial next!
    var sphere = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings), 
            sphereMaterial
    );

    var ground = new THREE.Mesh(
        new THREE.PlaneGeometry(
            1000,
            1000),
            groundMaterial
    );
    ground.material.side = THREE.DoubleSide;

    var glass = new THREE.Mesh(
        new THREE.PlaneGeometry(
            90,
            90), 
            glassMaterial
    );
    
    var renderingMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(
            WIDTH,
            HEIGHT),
            renderingMaterial
    );
    renderingMesh.position.z = 2;
    renderingScene.add(renderingMesh);

    glass.position.z = 50;
    ground.position.y = -50;
    ground.rotation.x = Math.PI/2;
    scene.add(sphere);
    scene.add(ground);
    
    glassScene.add(glass);

    var pointLight = new THREE.PointLight(0xFFFFFF);



    // set its position
    pointLight.position.x = 5;
    pointLight.position.y = 100;
    pointLight.position.z = 65;


    // add to the scene
    scene.add(pointLight);
    sphere.position.z = -100;

    (function render(time){
        requestAnimationFrame(render);

        sphere.position.x = 100*Math.sin(time/3000);
        //sphere.position.y = 50*Math.cos(time/30);

        //Render the background scene
        renderer.render(scene, camera, renderTarget, true);

        //Render the glass part
        renderer.render(glassScene, camera, glassTarget, true);

        renderer.render(renderingScene, camera);
        controls.update();
    })();
    'use strict'; 
});