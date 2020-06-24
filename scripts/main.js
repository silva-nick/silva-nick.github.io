class Point {
  constructor(x, y, xv, yv) {
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
  }
}

class Rect {
  constructor(xm, ym, xx, yx) {
    this.xmin = xm;
    this.ymin = ym;
    this.xmax = xx;
    this.ymax = yx;
  }
  contains(p) {
    return (
      this.xmin < p.x && this.xmax > p.x && this.ymin < p.y && this.ymax > p.y
    );
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  contains(p) {
    return Math.hypot(this.x - p.x, this.y - p.y) <= this.r;
  }
}

class Node {
  constructor(p, l, r) {
    this.point = p;
    this.lb = l;
    this.rb = r;
  }
}

class KdTree {
  constructor() {
    this.root = null;
    this.n = 0;
  }

  isEmpty() {
    return this.root == null;
  }

  get size() {
    return this.size();
  }
  size() {
    return this.n;
  }

  asList() {
    let list = [];
    if (this.isEmpty()) return list;
    list.push(this.root.point);
    this.partialList(this.root.rb, list);
    this.partialList(this.root.lb, list);
    return list;
  }

  partialList(node, list) {
    if (node == null) return;
    else {
      list.push(node.point);
      this.partialList(node.lb, list);
      this.partialList(node.rb, list);
    }
  }

  insert(p) {
    if (p == null) throw new TypeError();
    if (this.root == null) {
      this.root = new Node(p, null, null);
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
            next.lb = new Node(p, null, null);
            this.n++;
            return;
          }
        } else {
          if (next.rb != null) {
            next = next.rb;
          } else {
            next.rb = new Node(p, null, null);
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
            next.lb = new Node(p, null, null);
            this.n++;
            return;
          }
        } else {
          if (next.rb != null) {
            next = next.rb;
          } else {
            next.rb = new Node(p, null, null);
            this.n++;
            return;
          }
        }
      }
    }
  }

  contains(p) {
    if (p == null) throw new TypeError();
    let next = root;
    let hor = true;
    while (next != null) {
      if (next.point.x() == p.x() && next.point.y() == p.y()) return true;
      if (hor) {
        hor = !hor;
        if (p.x() < next.point.x()) {
          next = next.lb;
        } else {
          next = next.rb;
        }
      } else {
        hor = !hor;
        if (p.y() < next.point.y()) {
          next = next.lb;
        } else {
          next = next.rb;
        }
      }
    }
    return false;
  }

  range(rect) {
    if (rect == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let queue = [];
    this.hFindPoints(rect, this.root, queue);
    return queue;
  }
  hFindPoints(rect, n, queue) {
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
  vFindPoints(rect, n, queue) {
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

  circleRange(circle) {
    if (circle == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let queue = [];
    this.hRadiusPoints(circle, this.root, queue);
    return queue;
  }

  hRadiusPoints(circle, n, queue) {
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

  vRadiusPoints(circle, n, queue) {
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

  nearest(p) {
    if (p == null) throw new TypeError();
    if (this.isEmpty()) return null;
    let closest = this.root;
    return this.hCloser(closest, p);
  }

  hCloser(n, p) {
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
  vCloser(n, p) {
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

  static distance(p1, p2) {
    return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
  }
}

listShuffle = (list) => {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
};

var points = new KdTree();
const numBoids = 320;
const canvasSize = 800;

initialize = () => {
  for (let x = 0; x < numBoids; x++) {
    points.insert(
      new Point(
        Math.random() * canvasSize,
        Math.random() * canvasSize,
        (Math.random() < 0.5 ? -1 : 1) * Math.random() * 4,
        (Math.random() < 0.5 ? -1 : 1) * Math.random() * 4
      )
    );
  }

  let pointList = points.asList();
  let canvas = document.getElementById("map");
  let ctx = canvas.getContext("2d");
  for (let p of pointList) {
    drawBoid(ctx, p);
  }
  // ctx.fillStyle = "rgb(0, 0, 200, 0.5)";
  //p = points.nearest(new Point(0, 0));
  //ctx.fillRect(p.x, p.y, 10, 10);
};

draw = () => {
  let canvas = document.getElementById("map");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let pointList = points.asList();
  for (let p of pointList) {
    drawBoid(ctx, p);
  }
};

drawBoid = (ctx, p) => {
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.strokeStyle = "#182e59";
  ctx.moveTo(p.x, p.y);
  let l = Math.hypot(p.xv, p.yv) / 5;
  ctx.lineTo(p.x + p.xv / l, p.y + p.yv / l);
  ctx.stroke();
};

limit = (point) => {
  let hyp = Math.hypot(point.x, point.y);
  if (hyp > 1) {
    point.x = (1 * point.x) / hyp;
    point.y = (1 * point.y) / hyp;
  }
};

separation = (boid) => {
  let sep = new Point(0, 0, 0, 0);

  nearby = points.circleRange(new Circle(boid.x, boid.y, 25));
  let n = 0;
  for (let other of nearby) {
    if (other !== boid) {
      let dist =
        (other.x - boid.x) * (other.x - boid.x) +
        (other.y - boid.y) * (other.y - boid.y);
      sep.x = sep.x + (boid.x - other.x) / dist;
      sep.y = sep.y + (boid.y - other.y) / dist;
      n++;
    }
  }
  if (n > 0) {
    sep.x = sep.x / n;
    sep.y = sep.y / n;
    let hyp = Math.hypot(sep.x, sep.y);
    sep.x = (sep.x / hyp - boid.xv) / 10;
    sep.y = (sep.y / hyp - boid.yv) / 10;
    //limit(sep);
  }
  return sep;
};

alignment = (boid) => {
  let align = new Point(0, 0, 0, 0);
  nearby = points.circleRange(new Circle(boid.x, boid.y, 50));
  let n = 0;
  for (let other of nearby) {
    if (other !== boid) {
      n++;
      align.x += other.xv;
      align.y += other.yv;
    }
  }
  if (n > 0) {
    align.x = align.x / n / 8;
    align.y = align.y / n / 8;
    let hyp = Math.hypot(align.x, align.y);
    align.x = align.x / hyp - boid.xv;
    align.y = align.y / hyp - boid.yv;
  }
  return align;
};

cohesion = (boid) => {
  let coh = new Point(0, 0, 0, 0);
  nearby = points.circleRange(new Circle(boid.x, boid.y, 100));
  let n = 0;
  for (let other of nearby) {
    if (other !== boid) {
      coh.x += other.x;
      coh.y += other.y;
      n++;
    }
  }
  if (n > 0) {
    coh.x = coh.x / n - boid.x;
    coh.y = coh.y / n - boid.y;
    let hyp = Math.hypot(coh.x, coh.y);
    coh.x = (coh.x / hyp) * 4 - boid.xv;
    coh.y = (coh.y / hyp) * 4 - boid.yv;

    coh.x = coh.x / 100;
    coh.y = coh.y / 100;
  }
  return coh;
};

updateBoids = () => {
  let sep, align, coh;
  let pointList = points.asList();
  listShuffle(pointList);
  for (let boid of pointList) {
    align = alignment(boid);
    //align = new Point(0, 0, 0, 0);
    coh = cohesion(boid);
    //coh = new Point(0, 0, 0, 0);
    sep = separation(boid);
    //sep = new Point(0, 0, 0, 0);

    boid.xv = boid.xv + sep.x + align.x + coh.x;
    boid.yv = boid.yv + sep.y + align.y + coh.y;

    boid.x = boid.x + boid.xv * 4;
    boid.y = boid.y + boid.yv * 4;

    if (boid.x < 0) boid.x = canvasSize;
    if (boid.x > canvasSize) boid.x = 0;
    if (boid.y < 0) boid.y = canvasSize;
    if (boid.y > canvasSize) boid.y = 0;
  }

  points = new KdTree();
  for (let boid of pointList) {
    points.insert(boid);
  }
};

(function () {
  function main() {
    window.requestAnimationFrame(main);
    draw();
    updateBoids();
  }
  main();
})();
