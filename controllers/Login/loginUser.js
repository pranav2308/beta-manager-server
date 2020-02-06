const { validateLoginCredentials } = require('../Utils/CredentialValidator.js');

const loginUser = (bcrypt, database) => (req, res) => {

	const { email, password } = req.body;

	if(validateLoginCredentials(email, password)){


		database('login').where({email : email}).select('hash')
		.then(data => {
			if(data.length === 1){
				bcrypt.compare(password, data[0].hash)
				.then((match) => {
				    if(match){
				    	database('users').where({email:email}).select('*')
				    	.then(userData => {
				    		if(userData.length === 1){
				    			res.status(200).json(userData[0]);
				    		}
				    		else{
				    			/*
				    			case 1: Either user data with given email does not exists in users table 
				    					which is not theoritically possible because of transactions.
				    			case 2: More than 1 users data exists with given email which is again theoritically not possible 
				    					as email is promary key.
				    			*/
				    			res.status(500).json(`Oops! Something went wrong.`);
				    		}
				    	})
				    	.catch(error => res.status(500).json(`Oops! Something went wrong. You have been struck with ${error}`));
				    }
				    else{	
						res.status(401).json("Invalid credentials");    	
				    }
				});
			}
			else if(data.length === 0){
				res.status(401).json("Invalid credentials");
			}
			else{
				//This case theoritcally should not happen.
				res.status(500).json(`Oops! Something went wrong.`);		
			}
		})
		.catch(error => res.status(500).json(`Oops! Something went wrong. You have been struck with ${error}`)); 

	}
	else{
		//Even if credentials are not in required format, we send 401 as requester cannot be trusted.
		res.status(401).json("Invalid credentials");
	}
	
}


module.exports = loginUser;