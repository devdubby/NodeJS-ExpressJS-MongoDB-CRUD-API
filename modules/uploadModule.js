//multipart request 구현부
var multer = require('multer');
var fs = require('fs'); // 파일시스템 모듈 임포트
var maxSize = 1024 * 1024;

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './uploads/');
    },
    filename(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname);
        
    }
});
const upload = multer({ 
    storage: storage, 
    limits : { fileSize : maxSize },
    fileFilter : function (req, file, callback) {
        if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/bmp') {
            req.fileValidationError = 'wrong mimetype';
            return callback(null, false, new Error('wrong mimetype'));
        }
        callback(null, true);
    }
}).single('test')
module.exports = upload;