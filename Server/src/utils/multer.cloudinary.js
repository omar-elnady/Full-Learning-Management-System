import multer from "multer";

export const fileVaildation = {
  image: ["image/jpeg", "image/png", "image/gif"],
  files: ["application/pdf", "application/msword"],
  video: [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
  ],
};

export function fileUplode(vaildationFile) {
  const storage = multer.diskStorage({});
  function fileFilter(req, file, cb) {
    if (vaildationFile.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("in-valid format"));
    }
  }
  const upload = multer({ dest: "uploads", fileFilter, storage });
  return upload;
}
