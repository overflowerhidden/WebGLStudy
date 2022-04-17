var scene, camera, renderer, curCabinet;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, document.body.clientWidth / document.body.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(document.body.clientWidth, document.body.clientHeight);
    document.getElementById("container").appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    loadGLTF();

    crtTexture("cabinet-hover.jpg");
    document.body.addEventListener("click", function (event) {
        event.preventDefault();

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(cabinets);
        let intersectObj = intersects ? intersects[0].object : null;

        if (curCabinet && curCabinet !== intersectObj) {
            const material = curCabinet.material;
            material.setValues({
                map: maps.get("cabinet.jpg"),
            });
        }
        if (intersectObj) {
            if (intersectObj !== curCabinet) {
              curCabinet = intersectObj;
              const material = intersectObj.material;
              material.setValues({
                map: maps.get("cabinet-hover.jpg"),
              });
            }
          } else if (curCabinet) {
            curCabinet = null;
          }
    });

    var ambientLight = new THREE.AmbientLight(0xd5d5d5);
    ambientLight.intensity = 1.2;
    scene.add(ambientLight);

    loop();
}

// 加载GLTF模型
var cabinets = [];
var maps = new Map();
function loadGLTF() {
    const gltfLoader = new THREE.GLTFLoader();
    gltfLoader.load(`models/machineRoom.gltf`, ({ scene: { children } }) => {
        children.forEach((obj) => {
            const { map, color } = obj.material;
            changeMat(obj, map, color);
            if (obj.name.includes("cabinet")) {
                cabinets.push(obj);
            }
        })
        scene.add(...children);
    });
};

// 修改材质
function changeMat(obj, map, color) {
    if (map) {
        obj.material = new THREE.MeshBasicMaterial({
            map: crtTexture(map.name),
        });
    } else {
        obj.material = new THREE.MeshBasicMaterial({ color });
    }
}

// 建立纹理对象
function crtTexture(imgName) {
    let curTexture = maps.get(imgName);
    if (!curTexture) {
        curTexture = new THREE.TextureLoader().load('./models/' + imgName);
        curTexture.flipY = false;
        curTexture.wrapS = 1000;
        curTexture.wrapT = 1000;
        maps.set(imgName, curTexture);
    }
    return curTexture;
}

function loop() {
    requestAnimationFrame(loop);
    renderer.render(scene, camera);
}

window.onload = init;