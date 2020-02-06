const {validateRegistrationCredentials} = require('../Utils/CredentialValidator.js');


const registerUser = (bcrypt, database) => (req, res) => {

	const { fullName, email, password, country } = req.body;

	if(validateRegistrationCredentials(fullName, email, password)){


		bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(password, salt, function(err, hash) {
		        database.transaction(function(trx){
		        	return trx('users').insert({full_name: fullName, email: email, country: country, join_date: new Date()})
		        	.then(() => {
		        		return trx('login').insert({email: email, hash: hash})
		        	})
		        })
		        .then(() => {
		        	return database('users').where({email : email}).select('*')
		        })
		        .then((userData) => {
		        	if(userData.length === 1){
		        		res.status(200).json(userData[0])
		        	}
		        	else{
		        		//This case should not happen as transaction was successful and given user should be one and only one. 
		        		res.status(500).json(`Oops! Something went wrong.`);
		        	}
		        })
		        .catch(error => {
		        	if(parseInt(error.code) === 23505){
		        		res.status(409).json('User with given Email aready exists!');
		        	}
		        	else{
		        		res.status(500).json(`Oops! Something went wrong. You have been struck with ${error}`);
		        	}
		        });
		    });
		});

	}
	else{
		res.status(406).json('Credentials not valid');	
	}
	

	
}

module.exports = registerUser;