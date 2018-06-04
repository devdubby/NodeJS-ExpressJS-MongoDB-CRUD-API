module.exports = function (app, postMagazine) {

    app.post('/admin', function (req, res) {
        var mypost = new postMagazine(req.body);
        mypost.save(function (err) {
            if (err) {
                console.error(err);
                res.json({
                    result: 0
                });
                return;
            }
            res.json({
                result: 1
            });
        });
    });
    app.get('/admin', function (req, res) {
        postMagazine.find(function (err, postmagazines) {
            if (err) return res.status(500).send({
                error: 'database failure'
            });
            res.json(postmagazines);
        })
    });
    app.delete('/admin', function (req, res) {
        postMagazine.remove({ postId: req.body.postId }, function (err, output) {
            if (err) return res.status(500).json({
                error: "database failure"
            });
            res.status(204).end();
        })
    });
}