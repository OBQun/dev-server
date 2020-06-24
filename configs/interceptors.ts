import { InterceptorInterface, Action, Interceptor } from 'routing-controllers'

@Interceptor()
export class AutoAssignJSONInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any): any {
    if (content instanceof Error)
      throw content
    if (typeof content === 'object')
      return JSON.stringify(Object.assign({ message: 'ok' }, content))
    return JSON.stringify({ message: content })

  }
}
