import axios from "axios";
import crypto from "crypto";
// @ts-ignore
// import File from 'file-class';
// import FormData from "form-data";

export async function uploadImage(dataURL: string): Promise<string> {
  console.log(`uploading ${dataURL.slice(0, 100)}...`);
  const onlyBuffer = dataURL.split(",")[1];
  const { data } = await axios
    ({
      method: 'post',
      url: `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}&expiration=${process.env.IMGBB_EXPIRE}&name=${crypto
        .randomBytes(16)
        .toString("hex")}`,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `image=${encodeURIComponent(onlyBuffer)}`
    })
    .catch((err) => {
      return { data: { error: true } };
    });

  console.log(data);

  if (data.error) return Promise.reject("Error uploading image");
  return data.data.url;
}

export function dataURLtoFile(dataurl: string, filename: string) {
  const arr = dataurl.split(",");
  const [mime] = arr[0].match(/:(.*?);/) ?? [];
  const bstr = atob(arr[arr.length - 1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
