import Koa from 'koa'
import logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import koaStatic from 'koa-static'
import Environment from './environments'
import { join } from 'path'

export const useMiddlewares = <T extends Koa>(app: T): T => {
  Environment.identity !== 'test' && app.use(logger())

  app.use(bodyParser())
  app.use(koaStatic(join(__dirname, '../static')))

  return app
}
