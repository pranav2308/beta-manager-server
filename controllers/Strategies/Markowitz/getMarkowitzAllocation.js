

const getMarkowitzAllocation = (spawn, database) => (req, res) => {


	const { tickerList : commaSepTickerList, windowLength, capital, email } = req.body;
	const spaceSepTickerList = commaSepTickerList.split(',').join(' ');

	const runIVS = new Promise(function(resolve, reject){
		const pyprog = spawn('python', ['./controllers/Strategies/Markowitz/Markowitz.py', spaceSepTickerList, windowLength, capital]);

		pyprog.stdout.on('data', function(data) {
        	resolve(data);
    	});

    	pyprog.stderr.on('data', (data) => {
        	reject(data);
    	});
	})

	runIVS.catch(error => res.status(406).json('Invalid inputs!'));

	runIVS.then(buffer => {
		
		let resultString = buffer.toString(); 
		const charsToRemove = ['}', '{', '\r', '\n', '\"', "\'", ' ']

		for(let charToRemove of charsToRemove){
			resultString = resultString.split(charToRemove).join('');
		}
		
		if(resultString === ''){
			res.status(406).json('Invalid inputs!');
		}
		else{

			const allocationStringArray = resultString.split(',');

			const allocationToReturn = allocationStringArray.map(allocationString => {
				
				const [ ticker, allocation ] = allocationString.split(':');
				return { ticker : ticker, allocation : (parseFloat(allocation) * 100) };
			});

			database.transaction(function(trx){
				return trx('markowitz').insert({ email : email, ticker_list: spaceSepTickerList, window_length: parseInt(windowLength), capital : parseInt(capital), allocation: allocationToReturn, submit_date: new Date()})
				.then(() => {
					return trx('users').where('email', '=', email).increment('n_markowitz', 1);
				})
			})
			.then(() => res.status(200).json(allocationToReturn))
			.catch(error => res.status(500).json(`Oops! Something went wrong. You have been struck with ${error}`))

		}
		
	})
	.catch(error => res.status(500).json(`Oops! Something went wrong. You have been struck with ${error}`));
}

module.exports = getMarkowitzAllocation;