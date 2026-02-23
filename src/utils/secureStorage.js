// src/utils/secureStorage.js
const ENC_ALGO = "AES-GCM";
const IV_LEN = 12;
const SECRET = import.meta.env.VITE_CACHE_SECRET;

let keyPromise;

function getKey() {
  if (!keyPromise) {
    keyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(SECRET),
      ENC_ALGO,
      false,
      ["encrypt", "decrypt"],
    );
  }
  return keyPromise;
}

export async function encrypt(obj) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LEN));
  const data = new TextEncoder().encode(JSON.stringify(obj));
  const key = await getKey();

  const cipher = await crypto.subtle.encrypt({ name: ENC_ALGO, iv }, key, data);
  return JSON.stringify({ iv: [...iv], data: [...new Uint8Array(cipher)] });
}

export async function decrypt(raw) {
  const { iv, data } = JSON.parse(raw);
  const key = await getKey();

  const plain = await crypto.subtle.decrypt(
    { name: ENC_ALGO, iv: new Uint8Array(iv) },
    key,
    new Uint8Array(data),
  );

  return JSON.parse(new TextDecoder().decode(plain));
}
