const disp = require('../models/disp');
const upload = require('../modules/upload');

module.exports = function (app, postMagazine) {
    //데이터 저장 모듈 구현부
    const savePostMgz = (code, body) => new Promise((resolve, reject) => {
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
    //시퀀스 구현부(1씩 증가)
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
    //쿼리 공통 모듈 구현부-오버로딩(Arrow func(x))
    const postMgz = function (collection, methods, query, field, option) {
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
                    collection[methods](query ? query : {}, field ? field : {}, option ? option : {}, (err, result) => {
                        if(err) return reject(err);
                        return resolve(result);
                    });
                } catch(err) {
                    return reject(err);
                }
            });
        }
    }
    //어드민-데이터 생성 ,저장
    app.post('/admin', ({body}, res) => {
        //영역별로 데이터 생성, 저장
        for (const code of disp.getKeys()) {
            if (code == body.post.dispAreaCd) {
                getPostMgzSeq(code)
                .then((seq) => {
                    //1 증가한 시퀀스 postid, _id에 대입
                    body.postId = seq;
                    body._id = seq;
                    body.post.linkUrl = `/posts/${seq}/post`;
                    savePostMgz(code, body)
                    .then((postId) => res.json(postId))
                    .catch((err) =>  res.status(500).send(console.log(err), { error: 'database failure' }));
                })
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
    });
    //어드민-매거진 리스트 조회
    app.get('/admin/:dispAreaCd/:page/list', ({params}, res) => {
        //페이지별 매거진 리스트 조회
        for(const code of disp.getKeys()) {
            if (code === params.dispAreaCd) {
                postMgz(postMagazine[code].data, 'find',{}, {},
                    { sort: {_id: -1}, skip: (params.page ? params.page - 1 : 0)*10, limit: 10 })
                .then((data) => res.send(data))
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
    });
    //어드민-postId로 매거진 상세 조회
    app.get('/admin/:postId', ({params}, res) => {
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
    //어드민-postId로 메거진 삭제
    app.delete('/admin/:postId', ({params}, res) => { // 단일값, 다중값 삭제 테스트
        let i = 0;
        let cnt = 0;
        for (const code of disp.getKeys()) {
            postMgz(postMagazine[code].data, 'remove', { postId: params.postId })
            .then((data) => {
                cnt += data.n;
                if(++i === disp.getSize()) {
                    return res.send({"deleted": cnt})
                }
            })
            .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
        } 
    });
    //미들웨어가 req 객체에 file이라는 프로퍼티를 추가해준다
    //밑에 인자로 들어가는 test는 form에서 던진 태그의 name
    //파일 업로드
    app.post('/admin/upload', upload.single('test'), ({file}, res) => {
        if((file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/bmp') && file.size <= 1000000)
            res.send('/uploads/' + file.filename);
        else
            res.send("failed");
    });
    //프론트-영역별,postId로 매거진 상세 조회
    app.get('/:dispAreaCd/posts/:postId/post', ({params}, res) => {
        let i = 0;
        for(const code of disp.getKeys()) {
            if (code === params.dispAreaCd) {
                postMgz(postMagazine[code].data, 'find', {postId:params.postId})
                .then((data) => {
                    if(data == '')
                        return res.send({ error: 'data not found'})
                    else
                        return res.send(data)
                })
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
    });
    //프론트-영역별,카테고리별로 매거진 리스트 조회
    app.get('/:dispAreaCd/posts/:dispCtgCd/:page/list', ({params}, res) => {
        for(const code of disp.getKeys()) {
            if (code === params.dispAreaCd) {
                postMgz(postMagazine[code].data, 'find', {"post.dispCtgCd":params.dispCtgCd}, {},
                { sort: {_id: -1}, skip: (params.page ? params.page - 1 : 0)*10, limit: 10 })
                .then((data) => res.send(data))
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }   
    });
}