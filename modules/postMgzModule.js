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
const getPostMgz = function (collection, methods, query, field, option) {
    if(arguments.length == 3) {
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
    else if(arguments.length == 5) {
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
    getPostMgz
};