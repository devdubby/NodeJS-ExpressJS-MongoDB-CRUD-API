const disp = require('../models/disp');

module.exports = function (app, postMagazine) {
    app.post('/admin', ({body}, res) => {
        //promise 구현부(데이터 저장)
        const getPostMgzSeq = (code) => new Promise((resolve, reject) => {
            try {
                postMagazine[code].seq.findOneAndUpdate({}, {$inc: {seq: 1}}, {new: true}, (err, {seq}) => {
                    if(err) return reject(err);
                    return resolve(seq);
                });
            } catch(err) {
                return reject(err);
            }
        });

        const savePostMgz = (code) => new Promise((resolve, reject) => {
            try {
                (new postMagazine[code].data(body))
                .save((err, res) => {
                    if(err) return reject(err);
                    return resolve(res.postId);
                });
            } catch(err) {
                return reject(err);
            }
        });

        //promise 호출
        for (const code of disp.getKeys()) {
            if (code == body.post.dispAreaCd) {
                getPostMgzSeq(code)
                .then((seq) => {
                    body.postId = seq;
                    body._id = seq;
                    savePostMgz(code)
                    .then((postId) => res.json(postId))
                    .catch((err) =>  res.status(500).send(console.log(err), { error: 'database failure' }));
                })
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
    });
    //promise 구현부(공통모듈)
    const postMgz = (collection, methods, query) => new Promise((resolve, reject) => {
        try {
            collection[methods](query, (err, result) => {
                if(err) return reject(err);
                return resolve(result);
            });
        } catch(err) {
            return reject(err);
        }
    });

    app.get(['/admin/:dispAreaCd', '/admin'], ({params}, res) => {
        //promise 호출(전체 읽기)
        if (params && !params.dispAreaCd || '00' === params.dispAreaCd) {
            let total_result = [];
            let i = 0;
            for(const code of disp.getKeys()) {
                postMgz(postMagazine[code].data, 'find', {})
                .then((data) => {
                    total_result = total_result.concat(data);
                    if(++i === disp.getSize()) return res.send(total_result); // TODO 람다 활용하여 if문 걷어낸다
                })
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
        //promise 호출(영역별 읽기) 
        else {
            for(const code of disp.getKeys()) {
                if (code === params.dispAreaCd) {
                    postMgz(postMagazine[code].data, 'find', {})
                    .then((data) => res.send(data))
                    .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
                }
            }
        }
    });
    app.get('/admin/:postId/quick', ({params}, res) => {
        //promise 호출(postid로 읽기)
        let i = 0;
        for (const code of disp.getKeys()) {
            postMgz(postMagazine[code].data, 'find', { postId: params.postId })
            .then((data) => {
                if(data.length && data[0].postId) {
                    return res.send(data)
                } else if(++i === disp.getSize()) {
                    return res.send({ error: 'data not found' })
                }
            })
            .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
        }
    });
    //promise 호출(데이터 삭제)
    app.delete('/admin', ({body}, res) => { // 단일값, 다중값 삭제 테스트
        let i = 0;
        let cnt = 0;
        for (const code of disp.getKeys()) {
            const query = body.postIds && body.postIds.length ? {$in: body.postIds } : body.postIds;
            postMgz(postMagazine[code].data, 'remove', { postId: query })
            .then((data) => {
                cnt += data.n;
                if(++i === disp.getSize())
                    return res.send({"deleted": cnt});
            })
            .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
        } 
    });
}