const handleSignin = (req, res, knexDb, bcrypt, jwt, dotenv) => {
	dotenv.config();
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json('incorrect form submission');
	}
	//
	const table = 'bruger'

	const loadUser = () => {
		return knexDb.select('id', 'navn', 'email', 'role').from(table)
			.where('email', '=', email)
			.then(user => {
				const id = user[0].id;
				const navn = user[0].navn;
				const email = user[0].email;
				const role = user[0].role;
				const token = jwt.sign({ role: role, id: id }, process.env.SECRET_OR_KEY);
				const payload = { role: role, auth: true, token: token, id: id, navn: navn, email: email };
				res.status(200).send(payload);
			})
			.catch(err => res.status(400).json('unable to get user ' + err))
	}

	knexDb.select('email', 'password_digest').from(table)
		.where('email', '=', email)
		.then(data => {
			data[0] === undefined ? res.status(400).send('email') : (
				bcrypt.compareSync(password, data[0].password_digest) === true ?
					loadUser() : res.status(400).send('password'))
		})
		.catch(err => res.status(400).json(err));
}


module.exports = {
	handleSignin
};