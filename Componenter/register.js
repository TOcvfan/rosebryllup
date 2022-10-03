const handleRegister = async (req, res, User, jwt, dotenv, knexDb) => {
	dotenv.config();
	const { email, navn, password, role } = req.body;
	if (!email || !navn || !password) {
		return res.status(401).send('no fields');
	}

	const table = 'bruger'

	const newUser = async () => {
		const user = new User({
			navn: navn,
			email: email,
			password: password,
			role: role
		});
		return await user.save().then((newUser) => {
			const userid = { id: newUser.id };
			const role = { role: newUser.role }
			const load = { role, userid }
			const token = jwt.sign(load, process.env.SECRET_OR_KEY);
			const payload = { token: token, id: newUser.id };
			res.status(200).json(payload);
		});
	}

	const m = 'email';
	const jsont = (t) => JSON.stringify(t[0].email);
	const where = (first, second) => knexDb(table).where(first, '=', second);
	const response = (reply, user) => res.status(409).send(reply + user);

	where(m, email).then((bruger) => {
		if (bruger.length != 0) {
			return response('mail ', jsont(bruger))
		} else {
			try {
				newUser()
			} catch (e) {
				if (e.errno == 1062) {
					return res.status(409).json('duplicate entry');
				} else {
					return res.send('an error accurred');
				}
			}
		}
	}).catch((e) => response(e, 'error'));
}

module.exports = {
	handleRegister
};
