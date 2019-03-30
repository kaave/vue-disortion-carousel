export type Degree = number & { __degree: never };
export type Radian = number & { __radian: never };

const piDiv180 = Math.PI / 180;

export function toRadian(degree: Degree): Radian {
  return (degree * piDiv180) as Radian;
}

export function toDegree(radian: Radian): Degree {
  return (radian / piDiv180) as Degree;
}
