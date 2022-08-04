import { Router } from 'express'
import GuildController from './controllers/guild'
import UserController from './controllers/user'

const routes = Router()

routes.post('/user/create', UserController.create)
routes.post('/guild/create', GuildController.create)
routes.post('/guild/health_check', GuildController.healthCheck)

export default routes
