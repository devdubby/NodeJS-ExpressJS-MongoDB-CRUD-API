//multipart request 구현부
var multer = require('multer');
var fs = require('fs'); // 파일시스템 모듈 임포트
const storage = multer.diskStorage({
    destination(req, file, callback) {
        // 파일의 속성을 보고 디렉토리 분기가능
        callback(null, './uploads/');
    },
    filename(req, file, callback) {
        // 파일의 속성을 보고 파일명 조건 분기가능
        callback(null, Date.now() + '-' + file.originalname);
        // file.uploadedFile = {
        //     name: req.params.filename,
        //     ext: file.mimetype.split('/')[1]
        // };
        // callback(null, Date.now() + '-' + file.uploadedFile.name + '.' + file.uploadedFile.ext);
    }
});
const upload = multer({storage: storage});
module.exports = upload;