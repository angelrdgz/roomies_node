'use strict'

class UserController {

	index({request, response}){
		return {message: "Hola"}
	}

	async login ({ auth, request }) {
	    const { email, password } = request.all()
	    await auth.attempt(email, password)

	    return 'Logged in successfully'
	  }
}

module.exports = UserController
