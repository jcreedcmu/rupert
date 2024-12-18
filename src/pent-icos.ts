import qh, { isPointInsideHull } from 'quickhull3d';

// Then Cartesian coordinates for the 38 vertices of a pentagonal icositetrahedron centered at the origin, are as follows:

//     the 12 even permutations of (±1, ±(2t+1), ±t²) with an even number of minus signs
//     the 12 odd permutations of (±1, ±(2t+1), ±t²) with an odd number of minus signs
//     the 6 points (±t³, 0, 0), (0, ±t³, 0) and (0, 0, ±t³)
//     the 8 points (±t², ±t², ±t²)

const t = 1.839286755214161132551;



type Vec3 = [number, number, number]
function oddPerms(x: Vec3): Vec3[] {
  const [a, b, c] = x;
  return [[b, a, c], [a, c, b], [c, b, a]];
}

function evenPerms(x: Vec3): Vec3[] {
  const [a, b, c] = x;
  return [[a, b, c], [c, a, b], [b, c, a]];
}

function evenFlips(x: Vec3): Vec3[] {
  const [a, b, c] = x;
  return [
    [a, b, c],
    [-a, -b, c],
    [a, -b, -c],
    [-a, b, -c],
  ]
}

function oddFlips(x: Vec3): Vec3[] {
  const [a, b, c] = x;
  return [
    [-a, b, c],
    [a, -b, c],
    [-a, -b, -c],
    [a, b, -c],
  ]
}
const verts: Vec3[] = [];
evenPerms([1, 2 * t + 1, t * t]).forEach(v => {
  evenFlips(v).forEach(x => {
    verts.push(x);
  });
});

oddPerms([1, 2 * t + 1, t * t]).forEach(v => {
  oddFlips(v).forEach(x => {
    verts.push(x);
  });
});

const t3 = t * t * t;
verts.push(
  [t3, 0, 0], [-t3, 0, 0],
  [0, t3, 0], [0, -t3, 0],
  [0, 0, t3], [0, 0, -t3]
);

const t2 = t * t;

verts.push(
  ...oddFlips([t2, t2, t2]),
  ...evenFlips([t2, t2, t2]),
);

const printStl = false;
const printObj = true;

if (printStl) {
  console.log('solid foo');

  qh(verts).forEach(face => {
    console.log('facet normal 0 0 0\nouter loop');
    face.forEach(ix => {
      console.log(`vertex ${verts[ix].map(x => x / 10).join(' ')}`);
    });
    console.log('endloop\nendfacet');
  });
  console.log('endsolid foo');
}

if (printObj) {
  verts.forEach(vert => {
    console.log(`v ${vert.map(x => x / 10).join(' ')}`);
  });
  qh(verts).forEach(face => {
    console.log(`f ${face.map(x => x + 1).join(' ')}`);
  });
}
