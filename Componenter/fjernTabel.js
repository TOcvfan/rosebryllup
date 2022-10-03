const handleFjernTabel = (req, res, jwt, knexDb) => {
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
        if (decoded.rolle === 'VIP') {
            rolle = true;
        } else {
            rolle = false;
        }
    } else {
        return res.status(403).send('token mangler');
    }

    if (!rolle) { return res.status(403).send('ingen adgang'); }

    knexDb
        .schema.dropTableIfExists(name).then(slettet => {
            res.status(200).send(slettet);
        })
        .catch((err) => res.status(501).send(err));
}

module.exports = {
    handleFjernTabel
};