const handleProtected = (req, res, jwt) => {
    const { id } = req.params;
    var decoded_rolle = null;
    var id_decoded = null;

    if (req.headers && req.headers.authorization) {
        var authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
            id_decoded = decoded.id;
            decoded_rolle = decoded.rolle;
        } catch (e) {
            return res.status(401).send('unauthorized ' + e);
        }
        const id_authorization = (decoded_id, role) => {
            if (decoded_id === id) {
                return res.status(200).send('success ' + role)
            } else return res.status(403).send('ingen adgang');
        }

        switch (decoded_rolle) {
            case 'VIP':
                id_authorization(id_decoded, 'VIP')
                break;
            case 'ADMIN':
                id_authorization(id_decoded, 'ADMIN')
                break;
            case 'USER':
                id_authorization(id_decoded, 'USER')
                break;
            default: return res.status(403).send('ingen adgang');
        }
    } else {
        return res.status(403).send('token mangler');
    }

}

module.exports = {
    handleProtected
};