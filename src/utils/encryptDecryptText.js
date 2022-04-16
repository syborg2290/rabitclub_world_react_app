import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.APP_SECRET_ENCRYPT);

export const encrypt = (str) => {
  const encryptedString = cryptr.encrypt(str);
  return encryptedString;
};

export const decrypt = (encryptedStr) => {
  const decryptedString = cryptr.decrypt(encryptedStr);
  return decryptedString;
};
