'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with tasks
 */

 const Database = use('Database')
 const Task = use('App/Models/Task');
 const Team = use('App/Models/Team');
 const { validate } = use('Validator')
 const Mail = use('Mail')

class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */   

  async index ({ request, response, view }) {
    const tasks = await Task.all()
    await Mail.send('emails.welcome', tasks.toJSON(), (message) => {
      message
        .to("angelrodriguez@ucol.mx")
        .from('<from-email>')
        .subject('Welcome to yardstick')
    })
    response.json({data:tasks},200)
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, auth, response }) {    

    const rules = {
      title: 'required',
      description: 'required',
      schedule: 'required',
    }

    const validation = await validate(request.all(), rules)

    // show error messages upon validation fail
    if (validation.fails()) {
      return response.json({errors: validation.messages()}, 200)
    }

    // persist to database
    const team = await Team.findBy('id', auth.user.team_id);

    const task = new Task()
    task.title = request.input('title')
    task.team_id = auth.user.team_id
    task.user_id = auth.user.id
    task.description = request.input('description')
    task.schedule = request.input('schedule')
    await task.save()

    return response.json({message:"Task saved", data: task}, 200)
  }

  /**
   * Display a single task.
   * GET tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const tasks = await Task.findBy('id', params.id)
    response.json({data:tasks},200)
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, auth, request, response }) {

    const rules = {
      title: 'required',
      description: 'required',
      schedule: 'required',
    }

    const validation = await validate(request.all(), rules)

    // show error messages upon validation fail
    if (validation.fails()) {
      return response.json({errors: validation.messages()}, 200)
    }

    // persist to database
    const team = await Team.find('id', auth.user.team_id);

    const task = await Task.query().where('id', params.id).update({
       title: request.input('title'),
       description: request.input('description'),
       schedule: request.input('schedule')
    })

    return response.json({message:"Task updated", data: task}, 200)
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    const task = await Task.find(params.id)
    await task.delete()

    return response.json({message:"Task deleted"}, 200)
  }
}

module.exports = TaskController
