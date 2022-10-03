const handleListeEmne = (req, res, db, jwt) => {
    const { id, name } = req.params;
    var rolle = null;
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized ' + e);
        }
        decoded.role === 'VIP' ? rolle = true : rolle = false;

    } else {
        return res.status(403).send('token mangler');
    }

    if (!rolle) { return res.status(403).send('ingen adgang'); }

    db(name).where({
        id
    }).select('*')
        .then(user => res.json(user))
        .catch(err => res.status(400).json('unable to get entries ' + err))
}

module.exports = {
    handleListeEmne
};