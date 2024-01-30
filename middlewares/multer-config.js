import multer from "multer";
import { diskStorage } from "multer";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/png": "png",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/apng": "apng",
  "image/bmp": "bmp",
  "image/tiff": "tiff",
  "image/jfif": "jfif",
};

const storage = diskStorage({
  destination: (req, file, callback) => {
    const _dirname = dirname(fileURLToPath(import.meta.url));
    callback(null, join(_dirname, `../public`));
  },
  filename: (req, file, callback) => {
    callback(null, `${Date.now()}.${MIME_TYPES[file.mimetype]}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (MIME_TYPES[file.mimetype]) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});

export const uploadSingle = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
}).single("diplome");
