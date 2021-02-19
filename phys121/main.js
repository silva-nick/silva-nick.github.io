window.addEventListener("load", init);

let onClick;

function init() {
  // module aliases
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Composites = Matter.Composites,
    Common = Matter.Common,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    World = Matter.World,
    Query = Matter.Query,
    Svg = Matter.Svg,
    Body = Matter.Body,
    Bodies = Matter.Bodies;

  // create an engine
  var engine = Engine.create(),
    world = engine.world;

  // create a renderer
  var render = Render.create({
    element: document.querySelector("body"),
    engine: engine,
    options: {
      width: 1000,
      height: 600,
      pixelRatio: 1,
      background: "#b5a28a",
      wireframes: false,
      showAngleIndicator: true,
    },
  });

  var select = function (root, selector) {
    return Array.prototype.slice.call(root.querySelectorAll(selector));
  };

  var loadSvg = function (url) {
    if (typeof fetch !== "undefined") {
      return fetch(url)
        .then(function (response) {
          return response.text();
        })
        .then(function (raw) {
          return new window.DOMParser().parseFromString(raw, "image/svg+xml");
        });
    } else {
      //import terrain from "terrain.js";
      terrain = require("./terrain.svg");
      let text = terrain.text();
      return new window.DOMParser().parseFromString(text, "image/svg+xml");
    }
  };

  loadSvg(
    "https://raw.githubusercontent.com/silva-nick/phys121-diylab/main/terrain/terrain-edit.svg"
  ).then(function (root) {
    var paths = select(root, "path");

    var vertexSets = paths.map(function (path) {
      return Svg.pathToVertices(path, 30);
    });

    var terrainOptions = {
      friction: 1,
      frictionStatic: 1,
      isStatic: true,
      render: {
        fillStyle: "#242424",
        strokeStyle: "#242424",
        lineWidth: 1,
        showAngleIndicator: false,
      },
    };

    var terrain = Bodies.fromVertices(
      430,
      480,
      vertexSets,
      terrainOptions,
      true
    );

    World.add(world, terrain);
  });

  var bodyOptions = {
    frictionAir: 0,
    friction: 1,
    frictionStatic: 1,
    restitution: 0.2,
    density: 1,
    render: {
      fillStyle: "#778de0",
      strokeStyle: "#0f2a91",
      lineWidth: 2,
    },
  };

  let rad = 20;
  var ball = Bodies.circle(60, 300, rad, bodyOptions);
  Matter.Sleeping.set(ball, true);

  // add all of the bodies to the world
  World.add(engine.world, ball);

  Matter.Events.on(ball, "sleepEnd", function (event) {
    var body = this;
    //console.log("body id", body.id, "sleeping:", body.isSleeping);
    antifriction(100000);
  });

  // create runner
  var runner = Runner.create();
  //Runner.run(runner, engine);

  // Create main animation loop
  function sign(x) {
    return (x > 0) - (x < 0);
  }
  function antifriction(n) {
    var cur_frame = 0;
    var last = 0;
    var on = false;
    function animate() {
      if (cur_frame < n) {
        Runner.tick(runner, engine, 50);
        cur_frame += 1;

        let current = ball.angularVelocity;
        let pos = Matter.Vector.add(ball.position, { x: 0, y: rad / 2 });
        Body.applyForce(ball, pos, { x: 0.95 * sign(current), y: 0 });

        if (ball.angularSpeed < 0.01 && last - cur_frame < -10) {
          last = cur_frame;
          on = true;
        } else if (ball.angularSpeed > 0.01) {
          on = false;
        }
        if (last - cur_frame <= -10 && on) {
          on = false;
          Matter.Sleeping.set(ball, true);
          cur_frame = n;
        }

        //console.log(ball.angularVelocity);

        setTimeout(animate, 50);
      } else {
      }
    }
    animate();
  }

  // run the engine
  Engine.run(engine);

  // run the renderer
  Render.run(render);

  // add mouse control
  var mouse = Mouse.create(render.canvas),
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.5,
        render: {
          visible: false,
        },
      },
    });

  World.add(world, mouseConstraint);

  onClick = function (e) {
    var bodyOptions = {
      frictionAir: 0,
      friction: 0,
      frictionStatic: 0,
      restitution: 0.2,
      density: 1,
      render: {
        fillStyle: "#778de0",
        strokeStyle: "#0f2a91",
        lineWidth: 2,
      },
    };

    var ball = Bodies.circle(60, 300, rad, bodyOptions);
    World.add(world, ball);
  };

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: 900, y: 600 },
  });
}
