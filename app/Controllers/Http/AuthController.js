'use strict'

const User = use('App/Models/User');

class AuthController {

	async login({request, auth, response}) {
	        const email = request.input("email")
	        const password = request.input("password");
	        try {
	          if (await auth.attempt(email, password)) {
	            let user = await User.findBy('email', email)
	            let accessToken = await auth.generate(user)
	            return response.json({"user":user, "access_token": accessToken})
	          }

	        }
	        catch (e) {
	          return response.json({message: 'You first need to register!'})
	        }
	}

	async logout({request, auth, resposne}){
		await auth.logout()
		return response.json({message: 'You are out'})
	}
}

module.exports = AuthController
