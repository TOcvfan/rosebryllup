const handleTablePosts = (req, res, knex, jwt, dotenv) => {
	dotenv.config()
	var chef = null;
	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization.split(' ')[1],
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET_OR_KEY);
		} catch (e) {
			return res.status(401).send('unauthorized');
		}
		decoded.rolle === 'VIP' ? chef = false : chef = true;

	} else {
		return res.status(403).send('token mangler');
	}

	if (!chef) { return res.status(403).send('nix'); }
	const { name, liste } = req.body;
	knex(name)
		.insert(liste).then((e) => res.status(200).send(e))
		.catch(err => res.status(400).json(err))
}

module.exports = {
	handleTablePosts
};