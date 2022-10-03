const handleTable = (req, res, db, jwt) => {
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

	const { name } = req.params;
	db.select('*').from(name).then(user => {
		user.length ? res.json(user) : res.status(400).json('Not found')
	}
	)
		.catch(err => res.status(403).json('unable to get entries ' + err))
}

module.exports = {
	handleTable
};