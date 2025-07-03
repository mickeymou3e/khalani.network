import nacl from "tweetnacl";
import tools from "tweetnacl-util";

const toHex = (bytes: Uint8Array) =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), "");

export const initializeKeyValues = () => {
  const kp = nacl.sign.keyPair();
  const publicKey = toHex(kp.publicKey);
  const privateKey = toHex(kp.secretKey);

  const createSignature = (name: string) => {
    const signatureBody = publicKey + name;

    const signature = nacl.sign.detached(
      tools.decodeUTF8(signatureBody),
      kp.secretKey
    );
    return toHex(signature);
  };

  return {
    publicKey,
    privateKey,
    createSignature,
  };
};
