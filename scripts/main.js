var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// Point and shape classes
var Point = /** @class */ (function () {
    function Point(x, y, xv, yv) {
        this.x = x;
        this.y = y;
        this.xv = xv;
        this.yv = yv;
    }
    return Point;
}());
var AccPoint = /** @class */ (function (_super) {
    __extends(AccPoint, _super);
    function AccPoint(x, y, xv, yv, xa, ya) {
        var _this = _super.call(this, x, y, xv, yv) || this;
        _this.xa = xa;
        _this.ya = ya;
        return _this;
    }
    return AccPoint;
}(Point));
var Rect = /** @class */ (function () {
    function Rect(xm, ym, xx, yx) {
        this.xmin = xm;
        this.ymin = ym;
        this.xmax = xx;
        this.ymax = yx;
    }
    Rect.prototype.contains = function (p) {
        return (this.xmin < p.x && this.xmax > p.x && this.ymin < p.y && this.ymax > p.y);
    };
    return Rect;
}());
var Circle = /** @class */ (function () {
    function Circle(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }
    Circle.prototype.contains = function (p) {
        return hypot(this.x - p.x, this.y - p.y) <= this.r;
    };
    return Circle;
}());
var Node = /** @class */ (function () {
    function Node(p, l, r) {
        this.point = p;
        this.lb = l;
        this.rb = r;
    }
    return Node;
}());
// KD Tree Data Structure
var KdTree = /** @class */ (function () {
    function KdTree() {
        this.root = null;
        this.n = 0;
    }
    KdTree.prototype.isEmpty = function () {
        return this.root == null;
    };
    KdTree.prototype.size = function () {
        return this.n;
    };
    KdTree.prototype.asList = function () {
        var list = [];
        if (this.isEmpty())
            return list;
        list.push(this.root.point);
        this.partialList(this.root.rb, list);
        this.partialList(this.root.lb, list);
        return list;
    };
    KdTree.prototype.partialList = function (node, list) {
        if (node == null)
            return;
        else {
            list.push(node.point);
            this.partialList(node.lb, list);
            this.partialList(node.rb, list);
        }
    };
    KdTree.prototype.insert = function (p) {
        if (p == null)
            throw new TypeError();
        if (this.root == null) {
            this.root = new Node(p, null, null);
            this.n++;
            return;
        }
        var next = this.root;
        var hor = true;
        while (next != null) {
            if (next.point.x == p.x && next.point.y == p.y)
                return;
            if (hor) {
                hor = !hor;
                if (p.x < next.point.x) {
                    if (next.lb != null) {
                        next = next.lb;
                    }
                    else {
                        next.lb = new Node(p, null, null);
                        this.n++;
                        return;
                    }
                }
                else {
                    if (next.rb != null) {
                        next = next.rb;
                    }
                    else {
                        next.rb = new Node(p, null, null);
                        this.n++;
                        return;
                    }
                }
            }
            else {
                hor = !hor;
                if (p.y < next.point.y) {
                    if (next.lb != null) {
                        next = next.lb;
                    }
                    else {
                        next.lb = new Node(p, null, null);
                        this.n++;
                        return;
                    }
                }
                else {
                    if (next.rb != null) {
                        next = next.rb;
                    }
                    else {
                        next.rb = new Node(p, null, null);
                        this.n++;
                        return;
                    }
                }
            }
        }
    };
    KdTree.prototype.contains = function (p) {
        if (p == null)
            throw new TypeError();
        var next = this.root;
        var hor = true;
        while (next != null) {
            if (next.point.x == p.x && next.point.y == p.y)
                return true;
            if (hor) {
                hor = !hor;
                if (p.x < next.point.x) {
                    next = next.lb;
                }
                else {
                    next = next.rb;
                }
            }
            else {
                hor = !hor;
                if (p.y < next.point.y) {
                    next = next.lb;
                }
                else {
                    next = next.rb;
                }
            }
        }
        return false;
    };
    KdTree.prototype.range = function (rect) {
        if (rect == null)
            throw new TypeError();
        if (this.isEmpty())
            return null;
        var queue = [];
        this.hFindPoints(rect, this.root, queue);
        return queue;
    };
    KdTree.prototype.hFindPoints = function (rect, n, queue) {
        if (rect.contains(n.point)) {
            queue.push(n.point);
        }
        if (n.lb != null && rect.xmin <= n.point.x) {
            this.vFindPoints(rect, n.lb, queue);
        }
        if (n.rb != null && rect.xmax >= n.point.x) {
            this.vFindPoints(rect, n.rb, queue);
        }
    };
    KdTree.prototype.vFindPoints = function (rect, n, queue) {
        if (rect.contains(n.point)) {
            queue.push(n.point);
        }
        if (n.lb != null && rect.ymin <= n.point.y) {
            this.hFindPoints(rect, n.lb, queue);
        }
        if (n.rb != null && rect.ymax >= n.point.y) {
            this.hFindPoints(rect, n.rb, queue);
        }
    };
    KdTree.prototype.circleRange = function (circle) {
        if (circle == null)
            throw new TypeError();
        if (this.isEmpty())
            return null;
        var queue = [];
        this.hRadiusPoints(circle, this.root, queue);
        return queue;
    };
    KdTree.prototype.hRadiusPoints = function (circle, n, queue) {
        if (circle.contains(n.point)) {
            queue.push(n.point);
        }
        if (n.lb != null && circle.x - circle.r <= n.point.x) {
            this.vRadiusPoints(circle, n.lb, queue);
        }
        if (n.rb != null && circle.x + circle.r >= n.point.x) {
            this.vRadiusPoints(circle, n.rb, queue);
        }
    };
    KdTree.prototype.vRadiusPoints = function (circle, n, queue) {
        if (circle.contains(n.point)) {
            queue.push(n.point);
        }
        if (n.lb != null && circle.y - circle.r <= n.point.y) {
            this.hRadiusPoints(circle, n.lb, queue);
        }
        if (n.rb != null && circle.y + circle.r >= n.point.y) {
            this.hRadiusPoints(circle, n.rb, queue);
        }
    };
    KdTree.prototype.nearest = function (p) {
        if (p == null)
            throw new TypeError();
        if (this.isEmpty())
            return null;
        var closest = this.root;
        return this.hCloser(closest, p);
    };
    KdTree.prototype.hCloser = function (n, p) {
        var dist = KdTree.distance(n.point, p);
        var temp = n.point;
        var min = n.point;
        if (p.x <= n.point.x) {
            if (n.lb != null) {
                temp = this.vCloser(n.lb, p);
                min = dist < KdTree.distance(temp, p) ? min : temp;
                if (min == temp)
                    dist = KdTree.distance(min, p);
            }
            if (n.rb === null)
                return min;
            else if (KdTree.distance(p, new Point(n.point.x, p.y, 0, 0)) < dist) {
                temp = this.vCloser(n.rb, p);
            }
            return dist < KdTree.distance(temp, p) ? min : temp;
        }
        else {
            if (n.rb != null) {
                temp = this.vCloser(n.rb, p);
                min = dist < KdTree.distance(temp, p) ? min : temp;
                if (min === temp)
                    dist = KdTree.distance(min, p);
            }
            if (n.lb === null)
                return min;
            else if (KdTree.distance(p, new Point(n.point.x, p.y, 0, 0)) < dist) {
                temp = this.vCloser(n.lb, p);
            }
            return dist < KdTree.distance(temp, p) ? min : temp;
        }
    };
    KdTree.prototype.vCloser = function (n, p) {
        var dist = KdTree.distance(n.point, p);
        var temp = n.point;
        var min = n.point;
        if (p.y <= n.point.y) {
            if (n.lb != null) {
                temp = this.hCloser(n.lb, p);
                min = dist < KdTree.distance(temp, p) ? min : temp;
                if (min === temp)
                    dist = KdTree.distance(min, p);
            }
            if (n.rb === null)
                return min;
            else if (KdTree.distance(p, new Point(p.x, n.point.y, 0, 0)) < dist) {
                temp = this.hCloser(n.rb, p);
            }
            return dist < KdTree.distance(temp, p) ? min : temp;
        }
        else {
            if (n.rb != null) {
                temp = this.hCloser(n.rb, p);
                min = dist < KdTree.distance(temp, p) ? min : temp;
                if (min === temp) {
                    dist = KdTree.distance(min, p);
                }
            }
            if (n.lb === null)
                return min;
            else if (KdTree.distance(p, new Point(p.x, n.point.y, 0, 0)) < dist) {
                temp = this.hCloser(n.lb, p);
            }
            return dist < KdTree.distance(temp, p) ? min : temp;
        }
    };
    KdTree.distance = function (p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    };
    return KdTree;
}());
// Helper functions
var listShuffle = function (list) {
    var _a;
    for (var i = list.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [list[j], list[i]], list[i] = _a[0], list[j] = _a[1];
    }
};
var hypot = function () {
    var nums = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nums[_i] = arguments[_i];
    }
    var output = 0;
    for (var _a = 0, nums_1 = nums; _a < nums_1.length; _a++) {
        var num = nums_1[_a];
        output += num * num;
    }
    return Math.sqrt(output);
};
var numBoids = 180;
var canvasSize = 500;
var frameCount = 0;
var points = new KdTree();
var shark;
var bubbles = [];
var initialize = function () {
    for (var x = 0; x < numBoids; x++) {
        points.insert(new Point(Math.random() * canvasSize * 2, Math.random() * canvasSize, (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2, (Math.random() < 0.5 ? -1 : 1) * Math.random() * 2));
    }
    shark = new AccPoint(Math.random() * canvasSize * 2, Math.random() * canvasSize, (Math.random() < 0.5 ? -1 : 1) * Math.random() * 3, (Math.random() < 0.5 ? -1 : 1) * Math.random() * 3, 0, 0);
    for (var x = 0; x < 50; x++) {
        bubbles.push(new Point(Math.random() * canvasSize * 2, canvasSize, 0, -1 * Math.random() * 2));
    }
    draw();
    // ctx.fillStyle = "rgb(0, 0, 200, 0.5)";
    //p = points.nearest(new Point(0, 0));
    //ctx.fillRect(p.x, p.y, 10, 10);
};
var draw = function () {
    var canvas = document.getElementById("map");
    if (!canvas)
        return;
    var ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pointList = points.asList();
    for (var _i = 0, pointList_1 = pointList; _i < pointList_1.length; _i++) {
        var p = pointList_1[_i];
        drawBoid(ctx, p);
    }
    drawShark(ctx, shark);
    for (var _a = 0, bubbles_1 = bubbles; _a < bubbles_1.length; _a++) {
        var b = bubbles_1[_a];
        drawBubble(ctx, b);
    }
};
var drawBoid = function (ctx, p) {
    // Draw body
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = "#ffa845";
    var l = hypot(p.xv, p.yv);
    var uxv = p.xv / l;
    var uyv = p.yv / l;
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
    var a = 1;
    var b = (-1 * p.xv) / p.yv;
    l = hypot(a, b) / 5;
    ctx.moveTo(p.x - a / l, p.y - b / l);
    ctx.lineTo(p.x + a / l, p.y + b / l);
    ctx.stroke();
};
var drawShark = function (ctx, p) {
    // Draw body
    ctx.beginPath();
    ctx.lineWidth = 12;
    ctx.strokeStyle = "#6a6d9c";
    var l = hypot(p.xv, p.yv);
    var uxv = p.xv / l;
    var uyv = p.yv / l;
    ctx.moveTo(p.x + 8 * uxv, p.y + 8 * uyv);
    ctx.lineTo(p.x + uxv * 32, p.y + uyv * 32);
    ctx.stroke();
    // Calculate vperp
    var a = 1;
    var b = (-1 * p.xv) / p.yv;
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
var drawBubble = function (ctx, b) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, 2 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
};
var separation = function (boid) {
    var sep = new Point(0, 0, 0, 0);
    var circ = new Circle(boid.x, boid.y, 25);
    var nearby = points.circleRange(circ);
    if (nearby) {
        for (var _i = 0, nearby_1 = nearby; _i < nearby_1.length; _i++) {
            var other = nearby_1[_i];
            if (other !== boid) {
                var dist = (other.x - boid.x) * (other.x - boid.x) +
                    (other.y - boid.y) * (other.y - boid.y);
                sep.x = sep.x + (boid.x - other.x) / dist;
                sep.y = sep.y + (boid.y - other.y) / dist;
            }
        }
        if (nearby.length - 1 > 0) {
            sep.x = sep.x / (nearby.length - 1);
            sep.y = sep.y / (nearby.length - 1);
            var hyp = hypot(sep.x, sep.y);
            sep.x = sep.x / hyp - boid.xv;
            sep.y = sep.y / hyp - boid.yv;
        }
    }
    circ = new Circle(boid.x, boid.y, 100);
    if (circ.contains(shark)) {
        var dist = (shark.x - boid.x) * (shark.x - boid.x) +
            (shark.y - boid.y) * (shark.y - boid.y);
        sep.x = sep.x + (40 * (boid.x - shark.x)) / dist;
        sep.y = sep.y + (40 * (boid.y - shark.y)) / dist;
    }
    return sep;
};
var alignment = function (boid) {
    var align = new Point(0, 0, 0, 0);
    var nearby = points.circleRange(new Circle(boid.x, boid.y, 40));
    if (nearby) {
        for (var _i = 0, nearby_2 = nearby; _i < nearby_2.length; _i++) {
            var other = nearby_2[_i];
            if (other !== boid) {
                align.x += other.xv;
                align.y += other.yv;
            }
        }
        if (nearby.length - 1 > 0) {
            align.x = align.x / (nearby.length - 1);
            align.y = align.y / (nearby.length - 1);
            var hyp = hypot(align.x, align.y);
            align.x = align.x / hyp - boid.xv;
            align.y = align.y / hyp - boid.yv;
        }
    }
    return align;
};
var cohesion = function (boid) {
    var coh = new Point(0, 0, 0, 0);
    var nearby = points.circleRange(new Circle(boid.x, boid.y, 100));
    var n = 0;
    if (nearby) {
        for (var _i = 0, nearby_3 = nearby; _i < nearby_3.length; _i++) {
            var other = nearby_3[_i];
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
        var hyp = hypot(coh.x, coh.y);
        coh.x = coh.x / hyp - boid.xv;
        coh.y = coh.y / hyp - boid.yv;
    }
    return coh;
};
var update = function () {
    updateBoids();
    updateShark();
    updateBubbles();
};
var updateBoids = function () {
    var sep, align, coh;
    var pointList = points.asList();
    for (var _i = 0, pointList_2 = pointList; _i < pointList_2.length; _i++) {
        var boid = pointList_2[_i];
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
        if (boid.x < 0)
            boid.xv += 0.1;
        if (boid.x > canvasSize * 2)
            boid.xv -= 0.1;
        if (boid.y < 0)
            boid.yv += 0.1;
        if (boid.y > canvasSize)
            boid.yv -= 0.1;
    }
    if (frameCount % 2 === 0) {
        listShuffle(pointList);
        points = new KdTree();
        for (var _a = 0, pointList_3 = pointList; _a < pointList_3.length; _a++) {
            var boid = pointList_3[_a];
            points.insert(boid);
        }
    }
    frameCount++;
};
var updateShark = function () {
    if (!shark)
        return;
    shark.x = shark.x + shark.xv;
    shark.y = shark.y + shark.yv;
    if (shark.xv < -2.5)
        shark.xa += 0.005;
    if (shark.xv > 2.5)
        shark.xa -= 0.005;
    if (shark.yv < -2.5)
        shark.ya += 0.005;
    if (shark.yv > 2.5)
        shark.ya -= 0.005;
    if (shark.x < 0)
        shark.xa = 0.055;
    if (shark.x > canvasSize * 2)
        shark.xa = -0.055;
    if (shark.y < 0)
        shark.ya = 0.055;
    if (shark.y > canvasSize)
        shark.ya = -0.055;
    shark.xv += shark.xa / 5;
    shark.yv += shark.ya / 5;
    if (frameCount % 10 == 0) {
        shark.xa += ((Math.random() < 0.5 ? -1 : 1) * Math.random()) / 100;
        shark.ya += ((Math.random() < 0.5 ? -1 : 1) * Math.random()) / 100;
    }
};
var updateBubbles = function () {
    for (var _i = 0, bubbles_2 = bubbles; _i < bubbles_2.length; _i++) {
        var bubble = bubbles_2[_i];
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
