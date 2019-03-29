export function loadImages(urls: string[], crossOrigin: string = 'Anonymous'): Promise<HTMLImageElement>[] {
  return urls.map(
    url =>
      new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = crossOrigin;
        img.onload = () => resolve(img);
        img.src = url;
      }),
  );
}
