type Ratio = [number, number];

export function resize(canvas: HTMLCanvasElement, [widthRatio, heightRatio]: Ratio, maxWidthPx: number): void {
  const tmpSize = window.innerWidth;
  const width = maxWidthPx && tmpSize > maxWidthPx ? maxWidthPx : tmpSize;

  // eslint-disable-next-line no-param-reassign
  canvas.width = width;
  // eslint-disable-next-line no-param-reassign
  canvas.height = (width / widthRatio) * heightRatio;
}
