const handleNyListe = (req, res, db, jwt) => {
	const { liste, name, id } = req.body;
	if (!name || !liste) {
		return res.status(400).json('incorrect form submission');
	}
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

	db.schema.createTable(name, function (table) {
		table.increments('id').primary();
		liste.map((y) => {
			console.log(y)
			switch (y.type) {
				case 'tal':
					return table.integer(y.navn, y.length)
				case 'check':
					return table.boolean(y.navn);
				default: return table.string(y.navn, y.length)
			}
		})
	})
		.then(() => res.status(200).json('success'))
		.catch(err => res.status(503).json('kunne ikke oprette listen3 ' + err))

}

module.exports = {
	handleNyListe
};