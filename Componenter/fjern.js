const handleFjern = (req, res, jwt, knexDb) => {
    const { id } = req.params;
    const { name } = req.body;
    var rolle = null;
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized ' + e);
        }
        if (decoded.role === 'VIP') {
            rolle = true;
        } else {
            const user_id = decoded.id === id ? rolle = true : rolle = false;
            name === 'bruger' ? user_id : rolle = false
        }
    } else {
        return res.status(403).send('token mangler');
    }

    if (!rolle) { return res.status(403).send('ingen adgang'); }

    knexDb(name)
        .where('id', id).then(t => {
            if (t.length === 0) {
                res.json('no such user')
            } else {
                knexDb(name)
                    .where('id', id)
                    .del().then(s => {
                        res.sendStatus(200);
                    })
                    .catch((err) => res.json('error ' + err)//.sendStatus(501)
                    );
            }
        })

}

module.exports = {
    handleFjern
};