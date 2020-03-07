module.exports = (orig, dest) => {

  let o = orig.split(','),
  d = dest.split(','),

  or1 = radians(Number(o[0])),
  or2 = radians(Number(o[1])),
  dr1 = radians(Number(d[0])),
  dr2 = radians(Number(d[1]));
  
  var do2 = dr2 - or2,
  dPhi = Math.log(Math.tan(dr1/2.0+Math.PI/4.0)/Math.tan(or1/2.0+Math.PI/4.0));

  if (Math.abs(do2) > Math.PI){
    if (do2 > 0.0)
      do2 = -(2.0 * Math.PI - do2);
    else
      do2 = (2.0 * Math.PI + do2);
  }

  return (degrees(Math.atan2(do2, dPhi)) + 360.0) % 360.0;
}

const radians = (n) => {
  return n * (Math.PI / 180);
}
const degrees = (n) => {
  return n * (180 / Math.PI);
}
