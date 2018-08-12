const disp = require('../models/dispAreaModel');
const upload = require('../modules/uploadModule');
const { savePostMgz, getPostMgz } = require('../modules/postMgzModule')

module.exports = function (app, postMagazine) {
    //어드민-데이터 생성 ,저장
    app.post('/admin', ({body}, res) => {
        //영역별로 데이터 생성, 저장
        for (const code of disp.getKeys()) {
            if (code == body.post.dispAreaCd) {
                getPostMgz(postMagazine[code].seq, 'findOneAndUpdate', {}, {$inc: {seq: 1}}, {new: true})
                .then((data) => {
                    //1 증가한 시퀀스 postid, _id에 대입
                    body.postId = data.seq;
                    body._id = data.seq;
                    body.post.linkUrl = `/posts/${data.seq}/post`;
                    savePostMgz(postMagazine[code].data, body)
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
                getPostMgz(postMagazine[code].data, 'find', null, null,
                    { sort: {_id: -1}, skip: (params.page ? params.page - 1 : 0)*10, limit: 10 })
                .then((data) => res.send(data))
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }
    });
    //어드민-postId로 매거진 상세 조회
    app.get('/admin/:postId', ({params}, res) => {
        let i = 0;
        for (const code of disp.getKeys()) {
            getPostMgz(postMagazine[code].data, 'find', { postId: params.postId })
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
    app.delete('/admin/:postId', ({params}, res) => {
        let i = 0;
        let cnt = 0;
        for (const code of disp.getKeys()) {
            getPostMgz(postMagazine[code].data, 'remove', { postId: params.postId })
            .then((data) => {
                cnt += data.n;
                if(++i === disp.getSize()) {
                    return res.send({"deleted": cnt})
                }
            })
            .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
        } 
    });
    //파일 업로드
    app.post('/admin/upload', upload, (req, res) => {
        upload(req, res, () => {
            if(req.fileValidationError)
                return res.send(req.fileValidationError);
            else
                return res.send('/uploads/' + req.file.filename);
        })
    });
    //프론트-영역별,postId로 매거진 상세 조회
    app.get('/:dispAreaCd/posts/:postId/post', ({params}, res) => {
        let i = 0;
        for(const code of disp.getKeys()) {
            if (code === params.dispAreaCd) {
                getPostMgz(postMagazine[code].data, 'find', {postId:params.postId})
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
                getPostMgz(postMagazine[code].data, 'find', {"post.dispCtgCd":params.dispCtgCd}, {},
                { sort: {_id: -1}, skip: (params.page ? params.page - 1 : 0)*10, limit: 10 })
                .then((data) => res.send(data))
                .catch((err) => res.status(500).send(console.log(err), { error: 'database failure' }));
            }
        }   
    });
}