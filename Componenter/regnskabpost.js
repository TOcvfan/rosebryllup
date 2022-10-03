const handleRegnskabGuestPost = (req, res, knex, jwt, dotenv, tabel) => {
    const { id, beloeb, navn, overnatning, antal_inviv, kommer, tilhors_id, title, subtotal } = req.body;
    dotenv.config()
    var user = true;
    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        if (decoded.role === 'VIP') {
            user = true;
        } else {
            user = false;
        }
    } else {
        return res.status(403).send('token mangler');
    }

    const checkId = () => {
        knex(tabel).where('id', id)
            .select('id')
            .then(t => t[0] === undefined ? tableSwitch() : res.status(509).send('findes allerede'))
    }

    const tableSwitch = () => {
        switch (tabel) {
            case 'regnskab':
                return knex(tabel)
                    .insert({ id, navn, beloeb, tilhors_id, title, subtotal }).then((e) => res.status(200).send('success ' + id))
            case 'guests':
                return knex(tabel)
                    .insert({ id, navn, overnatning, antal_inviv, kommer }).then((e) => res.status(200).send(id))
        }
    }

    user ? checkId() : res.status(403).send('ingen adgang');


}

module.exports = {
    handleRegnskabGuestPost
};