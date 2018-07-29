//데이터 저장 모듈 구현부
const savePostMgz = (collection, body) => new Promise((resolve, reject) => {
    try {
        (new collection(body))
        .save((err, res) => {
            if(err) return reject(err);
            return resolve(res.postId);
        });
    } catch(err) {
        return reject(err);
    }
});
const postMgz = function (collection, methods, query, field, option) {
    //postid로 find, postid로 remove, 프론트postid로 find
    if(arguments.length == 3) {
        console.log(arguments.length);
        return new Promise((resolve, reject) => {
            try {
                collection[methods](query, (err, result) => {
                    if(err) return reject(err);
                    return resolve(result);
                });
            } catch(err) {
                return reject(err);
            }
        });
    }
    //영역별 페이징 리스트 find, 프론트 페이징리스트 find
    else if(arguments.length == 5) {
        console.log(arguments.length);
        return new Promise((resolve, reject) => {
            try {
                collection[methods](query, field, option, (err, result) => {
                    if(err) return reject(err);
                    return resolve(result);
                });
            } catch(err) {
                return reject(err);
            }
        })
    }
}
//시퀀스 구현부(1씩 증가)
// const getPostMgzSeq = (collection, methods, query, field, option) => new Promise((resolve, reject) => {
//     console.log(arguments.length);
//     try {
//         collection[methods](query, field, option, (err, result) => {
//             if(err) return reject(err);
//             return resolve(result);
//         });
//     } catch(err) {
//         return reject(err);
//     }
// });
//쿼리 공통 모듈 구현부
module.exports = {
    savePostMgz,
    postMgz
};