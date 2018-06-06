var disp = require('../models/disp');

module.exports = function (app, postMagazine) {

    app.post('/admin', function (req, res) {
        for (const code of disp.getKeys()) {
            if (code == req.body.post.dispAreaCd) {
                postMagazine[code].seq.findOneAndUpdate({}, {$inc: {seq: 1}}, {new: true}, (err, result) => {
                    if(err) return res.status(500).send({
                        error: 'database failure'
                    });
                    req.body.postId = result.seq;
                    req.body._id = result.seq;
                    var mypost = new postMagazine[code].data(req.body);
                    callback(mypost);
                });
            }
        }
        
        function callback(mypost) {
            mypost.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.json({
                        result: 0
                    });
                    return;
                }
                return res.json({
                    result: 1
                });
            });
        }
    });
    app.get(['/admin/:dispAreaCd', '/admin'], ({params}, res) => {
        
        // disp.getKeys().forEach((code) => console.log(disp.getDispArea(code)) )
		// console.log(disp.getKeys())
        // console.log(disp.getSize())
        // res.send('disp')
        
        if (params && !params.dispAreaCd || '00' === params.dispAreaCd) {
            let total_result = [];
            let i = 0;
            for(const code of disp.getKeys()) {
                postMagazine[code].data.find((err, result) => {
                    if(err) return res.status(500).send({
                        error: 'database failure'
                    });
                    total_result = total_result.concat(result);
                    if(++i === disp.getSize())
                        return res.send(total_result);
                });
            }
        } else {
            for(const code of disp.getKeys()) {
                if (code === params.dispAreaCd) {
                    return test(postMagazine[code].data, 'find', {})
                    // postMagazine[code].data['find']((err, result) => {
                    //     if (err) return res.status(500).send({
                    //         error: 'database failure'
                    //     });
                    //     return res.send(result);
                    // })
                }
            }
        }
        function test(collection, methods, query) {
            collection[methods](query, (err, result) => {
                 if (err) return res.status(500).send({
                     error: 'database failure'
                 });
                 return res.send(result);
             })
        }
        
        // if (params && !params.dispAreaCd || '00' === params.dispAreaCd) {
        //     let total_result = [];
        //     let i = 0;
        //     for(const area in disp.dispArea) {
        //         postMagazine[area].find((err, result) => {
        //             if(err) return res.status(500).send({
        //                 error: 'database failure'
        //             });
        //             total_result = total_result.concat(result);
        //             if(++i === Object.keys(disp.dispArea).length)
        //                 return res.send(total_result);
        //         });
        //     }
        // } else {
        //     for(const area in disp.dispArea) {
        //         if (area === params.dispAreaCd) {
        //             console.log(area);
        //             postMagazine[area].find((err, result) => {
        //                 if (err) return res.status(500).send({
        //                     error: 'database failure'
        //                 });
        //                 return res.send(result);
        //             })
        //         }
        //     }
        // }

        // else if (00 == req.params.dispAreaCd || "" == req.params.dispAreaCd) {
        //     postMagazine[area].find(function (err, result) {
        //         if (err) return res.status(500).send({
        //             error: 'database failure'
        //         });
        //         total_result = total_result + result;
        //     })
        // }
        // res.send(total_result);
        // Promise.all(test).then(function (total_result) {
        //     res.send(total_result);
        // });
    });
    app.get('/admin/:postId/quick', function ({params}, res) {
        for (const area in disp.dispArea) {
            postMagazine[area].find({ postId: params.postId }, (err, result) => {
                if (err) return res.status(500).send({
                    error: 'database failure'
                });
                return res.send(result);
            })
        }
    });
    app.delete('/admin', ({body}, res) => { // 단일값, 다중값 삭제 테스트
        for (const area in disp.dispArea) {
            const query = body.postIds && 0 < body.postIds.length ? {$in: body.postIds } : body.postIds;
            postMagazine[area].remove({ postId: query }, (err, output) => {
                if (err) return res.status(500).json({
                    error: "database failure"
                });
                return res.send(output);
            })
        }
    });
}