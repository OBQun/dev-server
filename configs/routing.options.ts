import {
  RoutingControllersOptions,
  Action,
  NotFoundError,
  UnauthorizedError,
} from 'routing-controllers'
import * as controllers from 'app/controllers'
import * as middlewares from './routing.middlewares'
import * as interceptors from './interceptors'
import { dictToArray } from './utils'
import { verify } from 'jsonwebtoken'
import Container from 'typedi'
import { AdminService, ArticleService } from 'app/services'
import { Admin } from 'app/entities'

export const routingConfigs: RoutingControllersOptions = {
  // token校验，返回根据token获取的adimn实体
  async currentUserChecker({
    request: {
      header: { authorization: token },
    },
  }): Promise<any> {
    if (!token) return null
    const { data: adminId }: any = verify(token, 'flzx#qcysyhl9t')
    return await Container.get(AdminService).repository.findOne(adminId)
  },

  // 校验执行权限
  async authorizationChecker(
    {
      request: {
        header: { authorization: token },
        url,
      },
    },
    role,
  ): Promise<boolean> {
    // 默认文章列表的最后一个param为文章id
    const articleId = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?'))
    if (role.includes('author')) {
      const { data: adminId }: any = verify(token, 'flzx#qcysyhl9t')
      const article = await Container.get(ArticleService).repository.findOne({
        where: { id: articleId },
        relations: ['author'],
      })
      if (!article) throw new NotFoundError('文章未找到')
      const {
        author: { id: authorId },
      } = article
      if (authorId !== adminId) throw new UnauthorizedError('非本文作者，无权限执行')
    }
    return true
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
