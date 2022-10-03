const handleGuests = (req, res, jwt, dotenv, knex) => {
    dotenv.config()
    const { id } = req.params;
    var bruger = null;
    const table = 'guests'

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized ' + e);
        }

        if (decoded.rolle === 'VIP') {
            bruger = 'vip';
        }

    } else {
        return bruger = 'bruger';;
    }


    const { brugerliste, vipliste } = req.body;

    const adgang = () => {
        switch (bruger) {
            case 'bruger':
                knex(table).where({ id: id }).update(brugerliste)
                    .then(z => {
                        res.json('success ' + z);
                    })
                    .then(knex.commit)
                    .catch(knex.rollback)

                    .catch(err => res.status(400).json('det var ikke muligt at gemme dine ændringer ' + err))
                break;
            case 'vip':
                knex(table).where({ id: id }).update(vipliste)
                    .then(z => {
                        res.json('success ' + z);
                    })
                    .then(knex.commit)
                    .catch(knex.rollback)

                    .catch(err => res.status(400).json('det var ikke muligt at redigere brugeren ' + err))
                break
            default: res.status(403).send('ingen adgang')
        }
    }
    adgang();

}

module.exports = {
    handleGuests
};