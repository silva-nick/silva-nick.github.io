window.addEventListener("load", initialize);

function initialize() {
  // Initialize scene
  const scene = new THREE.Scene();

  // Initialize camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // Initialize renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("cnv"),
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Initialize light and grid
  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  //scene.add(gridHelper);

  // Function to add sine wave to the scene
  const numPoints = 51;
  function addSine(position, numWaves) {
    let x = Array(numPoints);
    x = x.fill(-10).map((val, index) => val + 0.4 * index);

    let y = x.map(
      (val) => 2 * Math.sin(val + (position * 2 * Math.PI) / numWaves)
    );
    let xy = x.map((val, index) => new THREE.Vector2(val, y[index]));

    const curve = new THREE.SplineCurve(xy);
    const points = curve.getPoints(50);

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const sineWave = new THREE.Line(geometry, material);
    sineWave.position.z = -10 * (position - 1);

    scene.add(sineWave);
    return sineWave;
  }

  // Add sine waves
  let numWaves = 28;
  let waves = Array(numWaves);
  waves = waves
    .fill(1)
    .map((val, index) => val + index)
    .map((val) => addSine(val, numWaves));
  console.log(waves);

  // Draw edge sine wave
  let createEdgeWaves = (waves) => {
    // Generate left curve
    let xyz = waves
      .map(
        (wave) =>
          new THREE.Vector3(
            wave.geometry.attributes.position.array[0],
            wave.geometry.attributes.position.array[1],
            wave.position.z
          )
      )
      .sort((a, b) => a.z - b.z);

    const leftCurve = new THREE.CatmullRomCurve3(xyz);
    const leftPoints = leftCurve.getPoints(50);

    const leftGeometry = new THREE.BufferGeometry().setFromPoints(leftPoints);
    const material = new THREE.LineBasicMaterial({ color: 0xffffff });

    const leftWave = new THREE.Line(leftGeometry, material);
    leftWave.name = "left";
    scene.add(leftWave);

    // Generate right curve
    xyz = waves
      .map(
        (wave) =>
          new THREE.Vector3(
            wave.geometry.attributes.position.array[numPoints * 3 - 3],
            wave.geometry.attributes.position.array[numPoints * 3 - 2],
            wave.position.z
          )
      )
      .sort((a, b) => a.z - b.z);

    const rightCurve = new THREE.CatmullRomCurve3(xyz);
    const rightPoints = rightCurve.getPoints(50);

    const rightGeometry = new THREE.BufferGeometry().setFromPoints(rightPoints);
    const rightMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

    const rightWave = new THREE.Line(rightGeometry, rightMaterial);
    rightWave.name = "right";
    scene.add(rightWave);
  };
  createEdgeWaves(waves);

  let updateShapes = () => {
    let firstZ = waves[0].position.z;
    waves.forEach((wave, index) => {
      wave.position.z =
        index < numWaves - 1 ? waves[index + 1].position.z : firstZ;
      //wave.visible = false;
    });

    let oldEdge = scene.getObjectByName("left");
    scene.remove(oldEdge);
    oldEdge = scene.getObjectByName("right");
    scene.remove(oldEdge);
    createEdgeWaves(waves);

    /*waves.forEach((wave) => {
      wave.rotation.y += 0.01;
    });*/
  };

  renderer.render(scene, camera);

  camera.position.x = -20;
  camera.position.y = 10;
  camera.position.z = 20;

  camera.rotation.x = -0.4;
  camera.rotation.y = -0.6;
  camera.rotation.z = -0.2;

  (function () {
    function animate() {
      window.requestAnimationFrame(animate);
      updateShapes();
      renderer.render(scene, camera);
    }
    animate();
  })();
}
