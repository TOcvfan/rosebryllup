const handleGuest = (req, res, db) => {
	const { id } = req.params;
	const table = 'guests'

	db(table).where({
		id
	}).select('navn', 'overnatning', 'reception', 'kirke', 'fest', 'antal_invi', 'svar')
		.then(user => res.json(user))
		.catch(err => res.status(400).json('unable to get entries ' + err))
}

module.exports = {
	handleGuest
};