import CryptoJS from "crypto";

const publicKey =
  "-----BEGIN PUBLIC KEY-----MIICITANBgkqhkiG9w0BAQEFAAOCAg4AMIICCQKCAgBd+cTblFj92AaZJpTUAnlgZRN/Ng6WyqnNL1PgrihZHTo5yCrLWdp/P7wvKZZbUeI3U+rfrEqLhJ3FCjt1ofgAxc4l4RTTV8eenFsG6+aN5FmfhgSt08yRCwVj2SwGIFX+CL1la/JOyw9bzPx70xLKFrjskVLI96rSfAcStNhVGy1PaJrt5vHnYs+7Fc2QHgctyH5E3jzqRpNyfwEG3cBCdTEmBMSoqIkcXAvQpKL8GsttECZBKPjA9rqYu87Ph5ivmjQWLNmdht7/AyQVDlLdZ7JWKVzIZXuYgcT839ktN27cyOXyfAI/qT72mdgMLu2KEbnkKoguzKkQ0iaYE811lrm/n6jVp7QvAQ2Gnf1qOO6fq0RA9GmwjKR+cDKdkfRbKjCOLpEpPiJtg5jLD6jPgQwQlnbNON58ocSp8pvyR1nlD68RrfdzgjNi9QtPjVvOGQxmGuVya/MAb2v3CabQ5EB39PN9BjdkdZDOnBgawR+aTNCf1ytrhDp9pVineoP5x9zzh8cq1xz5V4uoSidr220cpglZ+d7tyZc5yF6syEl6h+2lB6PljGx1gZOct+zWbbZSePwnVOTaiZpbAHps5srrY6LdHlQOLPBvGSutg9yAivynUtBtz0a4c2+pxWCGrOVdYy9QLFh8diKnpI2kOhfz/J7CoyZna3kxn/n9nwIDAQAB-----END PUBLIC KEY-----";

export const encryptStringWithRsaPublicKey = (toEncrypt: string) => {
  const buffer = Buffer.from(toEncrypt, "utf16le");
  const encrypted = CryptoJS.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};
