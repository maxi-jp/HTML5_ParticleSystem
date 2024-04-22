
const PI2 = Math.PI * 2;
const PIH = Math.PI / 2;
const degToRad = Math.PI / 180;

function RandomBetweenInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandomBetweenFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function GetRandomColor() {
    const r = 255 * Math.random() | 0,
          g = 255 * Math.random() | 0,
          b = 255 * Math.random() | 0;
    return `rgb(${r},${g},${b})`;
}

function CheckCollisionCircle(point, circlePosition, radius2) {
    // d^2 = (p.x - c.x)^2 + (p.y - c.y)^2
    const difX = point.x - circlePosition.x;
    const difY = point.y - circlePosition.y;
    let pointToCircleDistance2 = difX * difX + difY * difY;

    return pointToCircleDistance2 < radius2;
}

function CheckCollisionRect (point, rectangle) {
    return point.x >= (rectangle.position.x) &&
           point.x <= (rectangle.position.x + rectangle.width) &&
           point.y >= (rectangle.position.y) &&
           point.y <= (rectangle.position.y + rectangle.height);
}

function CheckCollisionPolygon(point, polygon) {
    var count = polygon.length;

    for (let i = 0; i < polygon.length; i++) {
        const d = DistancePointToSegmentSign(polygon[i], polygon[(i + 1) % polygon.length], point);
        if (d < 0)
            count--;
    }

    return (count == 0) || (count == polygon.length);
}

function DistancePointToSegment(A, B, p) {
    const difXAB = A.x - B.x;
    const difYAB = A.y - B.y;
    return (((B.x - A.x) * (A.y - p.y)) - ((A.x - p.x) * (B.y - A.y))) / (Math.sqrt(difXAB * difXAB) + (difYAB * difYAB));
}

function DistancePointToSegmentSign(A, B, p) {
    return ((B.x - A.x) * (A.y - p.y)) - ((A.x - p.x) * (B.y - A.y));
}

function RotatePointAroundPoint(point, origin, angle) {
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    return {
        x: (Math.cos(angle) * dx) - (Math.sin(angle) * dy) + origin.x,
        y: (Math.sin(angle) * dx) + (Math.cos(angle) * dy) + origin.y
    }
}

function IntersectionBetweenLines(l1p1, l1p2, l2p1, l2p2) {
    let result = {
        det: 0,
        x: -1,
        y: -1,
        t: -1,
        u: -1
    }

    // simp
    /*const A1 = l1p2.y - l1p1.y;
    const B1 = l1p1.x - l1p2.x;
    const C1 = A1 * l1p1.x + B1 * l1p1.y;

    const A2 = l2p2.y - l2p1.y;
    const B2 = l2p1.x - l2p2.x;
    const C2 = A2 * l2p1.x + B2 * l2p1.y;

    result.det = A1 * B2 - A2 * B1;
    if (result.det !== 0) {
        result.x = (B2 * C1 - B1 * C2) / result.det;
        result.y = (A1 * C2 - A2 * C1) / result.det;
    }*/

    // http://jsfiddle.net/justin_c_rounds/Gd2S2/light/
    const den = (l1p1.x - l1p2.x) * (l2p1.y - l2p2.y) - (l1p1.y - l1p2.y) * (l2p1.x - l2p2.x);
    if (den != 0)
    {
        const t = ((l1p1.x - l2p1.x) * (l2p1.y - l2p2.y) - (l1p1.y - l2p1.y) * (l2p1.x - l2p2.x)) / den;
        const u = -((l1p1.x - l1p2.x) * (l1p1.y - l2p1.y) - (l1p1.y - l1p2.y) * (l1p1.x - l2p1.x)) / den;

        if (t > 0 && t < 1 && u > 0 && u < 1)
        {
            result.x = l1p1.x + t * (l1p2.x - l1p1.x);
            result.y = l1p1.y + t * (l1p2.y - l1p1.y);
            result.det = den;
            result.t = t;
            result.u = u;
        }
    }
    return result;
}

class Vector2
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }

    static Zero()
    {
        return new Vector2(0, 0);
    }

    static Copy(vector)
    {
        return new Vector2(vector.x, vector.y);
    }

    Set(x, y)
    {
        this.x = x;
        this.y = y;
    }

    Length()
    {
        return Math.sqrt(this.SqrLength());
    }

    SqrLength()
    {
        const x2 = this.x * this.x;
        const y2 = this.y * this.y;
        return x2 + y2;
    }

    static Magnitude(v1, v2) {
        return Math.sqrt(SqrMagnitude(v1, v2));
    }

    static SqrMagnitude(v1, v2) {
        const difX = v2.x - v1.x;
        const difY = v2.y - v1.y;
        const x2 = difX * difX;
        const y2 = difY * difY;
        return x2 + y2;
    }

    Normalize()
    {
        const length = this.Length();

        if (length > 0)
        {
            this.x = this.x / length;
            this.y = this.y / length;
        }
    }

    Add(otherVector)
    {
        this.x += otherVector.x;
        this.y += otherVector.y;
    }

    Sub(otherVector)
    {
        this.x -= otherVector.x;
        this.y -= otherVector.y;
    }

    DotProduct(otherVector)
    {
        return this.x * otherVector.x + this.y * otherVector.y;
    }

    MultiplyScalar(scalar)
    {
        this.x *= scalar;
        this.y *= scalar;
    }

    AngleBetween(otherVector)
    {
        // vec1 and vec2 should be normalized

        // a · b = |a| × |b| × cos(θ)
        // cos(θ) = (a · b) / |a| × |b|
        // θ = arccos[(a · b) / |a| × |b|]
        // si a y b son unitarios: θ = arccos(a · b)
        const dotProduct = this.DotProduct(otherVector);
        return Math.acos(dotProduct);
    }

    Random()
    {
        this.x = (Math.random() * 2) - 1;
        this.y = (Math.random() * 2) - 1;
    }

    RandomNormalized()
    {
        this.Random();
        this.Normalize();
    }

    static Lerp(v1, v2, speed)
    {
        const v1Angle = Math.atan2(v2.y, v2.x);
        const desiredDir = new Vector2(v2.x, v2.y).Sub(v1).Normalize();
        const currentDir = new Vector2(v2.x, v2.y).Normalize();
        currentDir += (desiredDir - currentDir) * speed;
    }
}