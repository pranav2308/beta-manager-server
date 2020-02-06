function isNameValid(name){
	return (Boolean(name.length));
} 

function isEmailValid(email){
	let re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  	return re.test(email);
}

function isPasswordValid(password){
	let re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
	return re.test(password);
}

function validateRegistrationCredentials(name, email, password){

	if(isNameValid(name) && isEmailValid(email) && isPasswordValid(password)){
		return true;
	}
	return false;
}

function validateLoginCredentials(email, password){
	if(isEmailValid(email) && isPasswordValid(password)){
		return true;
	}
	return false;
}

module.exports = {
	validateRegistrationCredentials,
	validateLoginCredentials };