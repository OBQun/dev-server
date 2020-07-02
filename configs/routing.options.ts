import { RoutingControllersOptions } from 'routing-controllers'
import * as controllers from 'app/controllers'
import * as middlewares from './routing.middlewares'
import * as interceptors from './interceptors'
import { dictToArray } from './utils'
import { verify } from 'jsonwebtoken'
import Container from 'typedi'
import { AdminService } from 'app/services'
import { Admin } from 'app/entities'

export const routingConfigs: RoutingControllersOptions = {
  // token校验，返回根据token获取的adimn实体
  async currentUserChecker(action): Promise<Admin> {
    const token: string = action.request.header.authorization
    const decode: any = verify(token, 'flzx#qcysyhl9t')
    return await Container.get(AdminService).repository.findOne(decode.data)
  },

  controllers: dictToArray(controllers),

  middlewares: dictToArray(middlewares),

  interceptors: dictToArray(interceptors),

  // router prefix
  // e.g. api => http://hostname:port/{routePrefix}/{controller.method}
  routePrefix: '/apis',

  // auto validate entity item
  // learn more: https://github.com/typestack/class-validator
  validation: true,
}
