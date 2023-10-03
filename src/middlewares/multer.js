import multer from "multer";
import fs from "fs";
import { __dirname } from "../path.js";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = getFileType(file.mimetype);
    const userId = req.params.uid

    const userFolder = path.join(__dirname, 'public/files/', `${fileType}`, userId);
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }  
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}`);
  },
  
});

function getFileType(mimetype) {
  if (mimetype.startsWith('image/')) {
    return 'profiles/';
  } else if (mimetype.startsWith('application/pdf')) {
    return 'documents/';
  } else {
    return 'products/';
  }
}

const fileFilter = function(req, file, cb) {
  const validDocumentNames = [
      "Identificacion",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta"
  ]
  const validExtensions = [".jpg", ".jpeg", ".png", ".pdf"]

  const uploadType = req.body.uploadType
  if (uploadType === "document") {
      const fileName = file.originalname.split(".")
      const fileBaseName = fileName.slice(0, -1).join(".")
      const fileExtension = `.${fileName.pop()}`

      if (
          validDocumentNames.includes(fileBaseName) &&
          validExtensions.includes(fileExtension)
      ) {
          cb(null, true)
      } else {
          cb(new Error("Nombre de archivo o extensión no válidos para la carga de documentos"), false);
      }
  } else {
      cb(null, true)
  }
};

export const uploader = multer({
  storage,
  fileFilter,
  onError: function(err, next){
      console.log(err)
      next()
  }
});



