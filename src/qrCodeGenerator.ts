import QRCode from 'qrcode';
import * as os from 'os';

const outputFile = 'temp/qr.png';

// this code just assumes everyone has en0 as the network interface
// that has ne internal network IP. That is probably not a stable way
// to figure out which IP to use
const en0 = os.networkInterfaces()['en0'];
if (en0 === undefined) {
  throw new Error('no network interface en0 found');
}
const ipAddress = en0.filter((x) => x.family === 'IPv4')[0].address;

export const generateQR = async (port: number):Promise<string> => {
  const publicUrl = `http://${ipAddress}:${port}`;
  await QRCode.toFile(outputFile, publicUrl);
  return outputFile;
};
