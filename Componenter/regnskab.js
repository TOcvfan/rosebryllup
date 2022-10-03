const handleRegnskab = (req, res, knex, jwt, dotenv) => {
	const { id } = req.params;
	const { beloeb } = req.body;
	dotenv.config()
	const table = 'regnskab'
	var user = false;
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
		} catch (e) {
			return res.status(401).send('unauthorized');
		}
		decoded.role === 'VIP' ? user = true : user = false

	} else {
		return res.status(403).send('token mangler');
	}

	switch (user) {
		case true:
			return knex(table)
				.where({ id: id })
				.update({ beloeb: beloeb })
				.then(() => res.sendStatus(200));
		case false:
			return res.status(403).send('ingen adgang');
	}
}

module.exports = {
	handleRegnskab
};