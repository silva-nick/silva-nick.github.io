// Point and shape classes
class Point {
  x: number;
  y: number;
  xv: number;
  yv: number;

  constructor(x: number, y: number, xv: number, yv: number) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
  }
}

class AccPoint extends Point {
  xa: number;
  ya: number;

  constructor(
    x: number,
    y: number,
    xv: number,
    yv: number,
    xa: number,
    ya: number
  ) {
    super(x, y, xv, yv);
    this.xa = xa;
    this.ya = ya;
  }
}

class Rect {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;

  constructor(xm: number, ym: number, xx: number, yx: number) {
    this.xmin = xm;
    this.ymin = ym;
    this.xmax = xx;
    this.ymax = yx;
  }
  contains(p: Point): boolean {
    return (
      this.xmin < p.x && this.xmax > p.x && this.ymin < p.y && this.ymax > p.y
    );
  }
}

class Circle {
  x: number;
  y: number;
  r: number;

  constructor(x: number, y: number, r: number) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  contains(p: Point): boolean {
    return hypot(this.x - p.x, this.y - p.y) <= this.r;
  }
}

class TreeNode {
  point: Point;
  lb: TreeNode | null;
  rb: TreeNode | null;

  constructor(p: Point, l: TreeNode | null, r: TreeNode | null) {
    this.point = p;
    this.lb = l;
    this.rb = r;
  }
}

// KD Tree Data Structure
class KdTree {
  root: TreeNode | null;
  n: number;

  constructor() {
    this.root = null;
    this.n = 0;
  }

  isEmpty() {
    return this.root == null;
  }

  size(): number {
    return this.n;
  }

  asList(): Array<Point> {
    let list: Point[] = [];
    if (this.isEmpty()) return list;
    list.push(this.root!.point);
    this.partialList(this.root!.rb, list);
    this.partialList(this.root!.lb, list);
    return list;
  }

  partialList(TreeNode: TreeNode | null, list: Array<Point>) {
    if (TreeNode == null) return;
    else {
      list.push(TreeNode.point);
      this.partialList(TreeNode.lb, list);
      this.partialList(TreeNode.rb, list);
    }
  }

  insert(p: Point) {
    if (p == null) throw new TypeError();
    if (this.root == null) {
      this.root = new TreeNode(p, null, null);
      this.n++;
      return;
    }
    let next = this.root;
    let hor = true;
    while (next != null) {
      if (next.point.x == p.x && next.point.y == p.y) return;
      if (hor) {
        hor = !hor;
        if (p.x < next.point.x) {
          if (next.lb != null) {
            next = next.lb;
          } else {
            next.lb = new TreeNode(p, null, null);
            this.n++;
            return;
          }
        } else {
          if (next.rb != null) {
            next = next.rb;
          } else {
            next.rb = new TreeNode(p, null, null);
            this.n++;
            return;
          }
        }
      } else {
        hor = !hor;
        if (p.y < next.point.y) {
          if (next.lb != null) {
            next = next.lb;
          } else {
            next.lb = new TreeNode(p, null, null);
            this.n++;
            return;
          }
        } else {
          if (next.rb != null) {
            next = next.rb;
          } else {
            next.rb = new TreeNode(p, null, null);
            this.n++;
            return;
          }
        }
      }
    }
  }

  contains(p: Point) {
    if (p == null) throw new TypeError();
    let next = this.root;
    let hor = true;
    while (next != null) {
      if (next.point.x == p.x && next.point.y == p.y) return true;
      if (hor) {
        hor = !hor;
        if (p.x < next.point.x) {
          next = next.lb;
        } else {
          next = next.rb;
        }
      } else {
        hor = !hor;
        if (p.y < next.point.y) {
          next = next.lb;
        } else {
          next = next.rb;
        }
      }
    }
    return false;
  }

  range(rect: Rect) {
    if (rect == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let queue: Array<Point> = [];
    this.hFindPoints(rect, this.root!, queue);
    return queue;
  }

  hFindPoints(rect: Rect, n: TreeNode, queue: Array<Point>) {
    if (rect.contains(n.point)) {
      queue.push(n.point);
    }
    if (n.lb != null && rect.xmin <= n.point.x) {
      this.vFindPoints(rect, n.lb, queue);
    }
    if (n.rb != null && rect.xmax >= n.point.x) {
      this.vFindPoints(rect, n.rb, queue);
    }
  }

  vFindPoints(rect: Rect, n: TreeNode, queue: Array<Point>) {
    if (rect.contains(n.point)) {
      queue.push(n.point);
    }
    if (n.lb != null && rect.ymin <= n.point.y) {
      this.hFindPoints(rect, n.lb, queue);
    }
    if (n.rb != null && rect.ymax >= n.point.y) {
      this.hFindPoints(rect, n.rb, queue);
    }
  }

  circleRange(circle: Circle) {
    if (circle == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let queue: Array<Point> = [];
    this.hRadiusPoints(circle, this.root!, queue);
    return queue;
  }

  hRadiusPoints(circle: Circle, n: TreeNode, queue: Array<Point>) {
    if (circle.contains(n.point)) {
      queue.push(n.point);
    }
    if (n.lb != null && circle.x - circle.r <= n.point.x) {
      this.vRadiusPoints(circle, n.lb, queue);
    }
    if (n.rb != null && circle.x + circle.r >= n.point.x) {
      this.vRadiusPoints(circle, n.rb, queue);
    }
  }

  vRadiusPoints(circle: Circle, n: TreeNode, queue: Array<Point>) {
    if (circle.contains(n.point)) {
      queue.push(n.point);
    }
    if (n.lb != null && circle.y - circle.r <= n.point.y) {
      this.hRadiusPoints(circle, n.lb, queue);
    }
    if (n.rb != null && circle.y + circle.r >= n.point.y) {
      this.hRadiusPoints(circle, n.rb, queue);
    }
  }

  nearest(p: Point) {
    if (p == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let closest = this.root!;
    return this.hCloser(closest, p);
  }

  hCloser(n: TreeNode, p: Point) {
    let dist = KdTree.distance(n.point, p);
    let temp = n.point;
    let min = n.point;
    if (p.x <= n.point.x) {
      if (n.lb != null) {
        temp = this.vCloser(n.lb, p);
        min = dist < KdTree.distance(temp, p) ? min : temp;
        if (min == temp) dist = KdTree.distance(min, p);
      }
      if (n.rb === null) return min;
      else if (KdTree.distance(p, new Point(n.point.x, p.y, 0, 0)) < dist) {
        temp = this.vCloser(n.rb, p);
      }
      return dist < KdTree.distance(temp, p) ? min : temp;
    } else {
      if (n.rb != null) {
        temp = this.vCloser(n.rb, p);
        min = dist < KdTree.distance(temp, p) ? min : temp;
        if (min === temp) dist = KdTree.distance(min, p);
      }
      if (n.lb === null) return min;
      else if (KdTree.distance(p, new Point(n.point.x, p.y, 0, 0)) < dist) {
        temp = this.vCloser(n.lb, p);
      }
      return dist < KdTree.distance(temp, p) ? min : temp;
    }
  }
  vCloser(n: TreeNode, p: Point) {
    let dist = KdTree.distance(n.point, p);
    let temp = n.point;
    let min = n.point;
    if (p.y <= n.point.y) {
      if (n.lb != null) {
        temp = this.hCloser(n.lb, p);
        min = dist < KdTree.distance(temp, p) ? min : temp;
        if (min === temp) dist = KdTree.distance(min, p);
      }
      if (n.rb === null) return min;
      else if (KdTree.distance(p, new Point(p.x, n.point.y, 0, 0)) < dist) {
        temp = this.hCloser(n.rb, p);
      }
      return dist < KdTree.distance(temp, p) ? min : temp;
    } else {
      if (n.rb != null) {
        temp = this.hCloser(n.rb, p);
        min = dist < KdTree.distance(temp, p) ? min : temp;
        if (min === temp) {
          dist = KdTree.distance(min, p);
        }
      }
      if (n.lb === null) return min;
      else if (KdTree.distance(p, new Point(p.x, n.point.y, 0, 0)) < dist) {
        temp = this.hCloser(n.lb, p);
      }
      return dist < KdTree.distance(temp, p) ? min : temp;
    }
  }

  static distance(p1: Point, p2: Point) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
}

// Helper functions
let listShuffle = (list: Array<any>) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
};

let hypot = (...nums: number[]): number => {
  let output = 0;
  for (let num of nums) output += num * num;
  return Math.sqrt(output);
};

const numBoids = 180;
const canvasSize = 500;
var frameCount = 0;

var points = new KdTree();
var shark: AccPoint;
var bubbles: Point[] = [];

let initialize = () => {
  for (let x = 0; x < numBoids; x++) {
    points.insert(
      new Point(
        Math.random() * canvasSize * 2,
        Math.random() * canvasSize,
        (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2,
        (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2
      )
    );
  }

  shark = new AccPoint(
    Math.random() * canvasSize * 2,
    Math.random() * canvasSize,
    (Math.random() < 0.5 ? -1 : 1) * Math.random() * 3,
    (Math.random() < 0.5 ? -1 : 1) * Math.random() * 3,
    0,
    0
  );

  for (let x = 0; x < 50; x++) {
    bubbles.push(
      new Point(
        Math.random() * canvasSize * 2,
        canvasSize,
        0,
        -1 * Math.random() * 2
      )
    );
  }

  draw();

  // ctx.fillStyle = "rgb(0, 0, 200, 0.5)";
  //p = points.nearest(new Point(0, 0));
  //ctx.fillRect(p.x, p.y, 10, 10);
};

let draw = () => {
  let canvas = document.getElementById("map") as HTMLCanvasElement;
  if (!canvas) return;
  let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let pointList = points.asList();
  for (let p of pointList) {
    drawBoid(ctx, p);
  }

  drawShark(ctx, shark);

  for (let b of bubbles) {
    drawBubble(ctx, b);
  }
};

let drawBoid = (ctx: CanvasRenderingContext2D, p: Point) => {
  // Draw body
  ctx.beginPath();
  ctx.lineWidth = 8;
  ctx.strokeStyle = "#ffa845";
  let l = hypot(p.xv, p.yv);
  let uxv = p.xv / l;
  let uyv = p.yv / l;
  ctx.moveTo(p.x + 6 * uxv, p.y + 6 * uyv);
  ctx.lineTo(p.x + uxv * 16, p.y + uyv * 16);
  ctx.stroke();

  // Draw tail
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + uxv * 6, p.y + uyv * 6);
  ctx.stroke();

  // Draw flipper
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#1a1a1a";
  let a = 1;
  let b = (-1 * p.xv) / p.yv;
  l = hypot(a, b) / 5;
  ctx.moveTo(p.x - a / l, p.y - b / l);
  ctx.lineTo(p.x + a / l, p.y + b / l);
  ctx.stroke();
};

let drawShark = (ctx: CanvasRenderingContext2D, p: Point) => {
  // Draw body
  ctx.beginPath();
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#6a6d9c";
  let l = hypot(p.xv, p.yv);
  let uxv = p.xv / l;
  let uyv = p.yv / l;
  ctx.moveTo(p.x + 8 * uxv, p.y + 8 * uyv);
  ctx.lineTo(p.x + uxv * 32, p.y + uyv * 32);
  ctx.stroke();

  // Calculate vperp
  let a = 1;
  let b = (-1 * p.xv) / p.yv;
  l = hypot(a, b) / 6;

  // Draw head
  ctx.beginPath();
  ctx.lineWidth = 16;
  ctx.moveTo(p.x + 31 * uxv, p.y + 31 * uyv);
  ctx.lineTo(p.x + uxv * 36, p.y + uyv * 36);
  ctx.stroke();

  // Draw Fins
  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(p.x + 24 * uxv, p.y + 24 * uyv);
  ctx.lineTo(p.x + 20 * uxv + (2 * a) / l, p.y + 20 * uyv + (2 * b) / l);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = 4;
  ctx.moveTo(p.x + 24 * uxv, p.y + 24 * uyv);
  ctx.lineTo(p.x + 20 * uxv - (2 * a) / l, p.y + 20 * uyv - (2 * b) / l);
  ctx.stroke();

  // Draw tail
  ctx.beginPath();
  //ctx.lineWidth = "4";
  ctx.moveTo(p.x, p.y);
  ctx.lineTo(p.x + uxv * 8, p.y + uyv * 8);
  ctx.stroke();

  // Draw flipper
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#1e1f26";
  ctx.moveTo(p.x - a / l, p.y - b / l);
  ctx.lineTo(p.x + a / l, p.y + b / l);
  ctx.stroke();
};

let drawBubble = (ctx: CanvasRenderingContext2D, b: Point) => {
  ctx.beginPath();
  ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI, false);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();
};

let separation = (boid: Point) => {
  let sep = new Point(0, 0, 0, 0);
  let circ = new Circle(boid.x, boid.y, 25);
  let nearby = points.circleRange(circ);
  if (nearby) {
    for (let other of nearby) {
      if (other !== boid) {
        let dist =
          (other.x - boid.x) * (other.x - boid.x) +
          (other.y - boid.y) * (other.y - boid.y);
        sep.x = sep.x + (boid.x - other.x) / dist;
        sep.y = sep.y + (boid.y - other.y) / dist;
      }
    }
    if (nearby.length - 1 > 0) {
      sep.x = sep.x / (nearby.length - 1);
      sep.y = sep.y / (nearby.length - 1);
      let hyp = hypot(sep.x, sep.y);
      sep.x = sep.x / hyp - boid.xv;
      sep.y = sep.y / hyp - boid.yv;
    }
  }
  circ = new Circle(boid.x, boid.y, 100);
  if (circ.contains(shark)) {
    let dist =
      (shark.x - boid.x) * (shark.x - boid.x) +
      (shark.y - boid.y) * (shark.y - boid.y);
    sep.x = sep.x + (40 * (boid.x - shark.x)) / dist;
    sep.y = sep.y + (40 * (boid.y - shark.y)) / dist;
  }

  return sep;
};

let alignment = (boid: Point) => {
  let align = new Point(0, 0, 0, 0);
  let nearby = points.circleRange(new Circle(boid.x, boid.y, 40));
  if (nearby) {
    for (let other of nearby) {
      if (other !== boid) {
        align.x += other.xv;
        align.y += other.yv;
      }
    }
    if (nearby.length - 1 > 0) {
      align.x = align.x / (nearby.length - 1);
      align.y = align.y / (nearby.length - 1);
      let hyp = hypot(align.x, align.y);
      align.x = align.x / hyp - boid.xv;
      align.y = align.y / hyp - boid.yv;
    }
  }
  return align;
};

let cohesion = (boid: Point) => {
  let coh = new Point(0, 0, 0, 0);
  let nearby = points.circleRange(new Circle(boid.x, boid.y, 100));
  let n = 0;
  if (nearby) {
    for (let other of nearby) {
      if (other !== boid) {
        coh.x += other.x;
        coh.y += other.y;
        n++;
      }
    }
  }
  if (n > 0) {
    coh.x = coh.x / n - boid.x;
    coh.y = coh.y / n - boid.y;
    let hyp = hypot(coh.x, coh.y);
    coh.x = coh.x / hyp - boid.xv;
    coh.y = coh.y / hyp - boid.yv;
  }
  return coh;
};

let update = () => {
  updateBoids();
  updateShark();
  updateBubbles();
};

let updateBoids = () => {
  let sep, align, coh;
  let pointList = points.asList();
  for (let boid of pointList) {
    align = alignment(boid);
    //align = new Point(0, 0, 0, 0);
    coh = cohesion(boid);
    //coh = new Point(0, 0, 0, 0);
    sep = separation(boid);
    //sep = new Point(0, 0, 0, 0);

    boid.xv = boid.xv + sep.x / 18 + align.x / 24 + coh.x / 240;
    boid.yv = boid.yv + sep.y / 18 + align.y / 24 + coh.y / 240;

    boid.x = boid.x + boid.xv * 3;
    boid.y = boid.y + boid.yv * 3;

    if (boid.x < 0) boid.xv += 0.1;
    if (boid.x > canvasSize * 2) boid.xv -= 0.1;
    if (boid.y < 0) boid.yv += 0.1;
    if (boid.y > canvasSize) boid.yv -= 0.1;
  }

  if (frameCount % 2 === 0) {
    listShuffle(pointList);
    points = new KdTree();
    for (let boid of pointList) {
      points.insert(boid);
    }
  }

  frameCount++;
};

let updateShark = () => {
  if (!shark) return;
  shark.x = shark.x + shark.xv;
  shark.y = shark.y + shark.yv;

  if (shark.xv < -2.5) shark.xa += 0.005;
  if (shark.xv > 2.5) shark.xa -= 0.005;
  if (shark.yv < -2.5) shark.ya += 0.005;
  if (shark.yv > 2.5) shark.ya -= 0.005;

  if (shark.x < 0) shark.xa = 0.055;
  if (shark.x > canvasSize * 2) shark.xa = -0.055;
  if (shark.y < 0) shark.ya = 0.055;
  if (shark.y > canvasSize) shark.ya = -0.055;

  shark.xv += shark.xa / 5;
  shark.yv += shark.ya / 5;

  if (frameCount % 10 == 0) {
    shark.xa += ((Math.random() < 0.5 ? -1 : 1) * Math.random()) / 100;
    shark.ya += ((Math.random() < 0.5 ? -1 : 1) * Math.random()) / 100;
  }
};

let updateBubbles = () => {
  for (let bubble of bubbles) {
    bubble.y += bubble.yv;
    bubble.yv -= 0.005;
    if (bubble.y > canvasSize) {
      bubbles.shift();
    }
  }
};

// Main animation loop
(function () {
  function main() {
    window.requestAnimationFrame(main);
    update();
    draw();
  }
  main();
})();
