import fs from "fs";
import path from "path";
import multer, { diskStorage } from "multer";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    const safeOriginal = (file.originalname || "file").replace(/[^\w.\-()]/g, "_");
    cb(null, `${Date.now()}-${safeOriginal}`);
  },
});

const upload = multer({ storage });
export default upload;