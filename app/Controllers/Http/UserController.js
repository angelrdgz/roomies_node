'use strict'

class UserController {

	index({request, response}){
		return {message: "Hola"}
	}
}

module.exports = UserController
