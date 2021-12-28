import Painting from 'src/controllers/collection/Painting';

export const paint = async (collection: any, paintingInfo: any, rawImage: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const painting = new Painting();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const result = await painting.paint(
    collection,
    paintingInfo,
    rawImage,
    (status: any) => {
      console.log(new Date(), { status });
    }
  );

  let encodedImage: string = '';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  result.getBase64('image/png', (err: any, res: any) => {
    console.log(err);
    encodedImage = res;
  });

  return encodedImage;
};