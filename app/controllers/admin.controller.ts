import {
  JsonController,
  Post,
  BodyParam,
  Put,
  CurrentUser,
  UploadedFile,
  ContentType,
  Body,
} from 'routing-controllers'
import { AdminService } from 'app/services'
import Container from 'typedi'
import { sign } from 'jsonwebtoken'
import { Admin } from 'app/entities'
import { avatarUploadOptions } from 'app/helpers/multer.options'
import { File } from 'koa-multer'

@JsonController('/admin')
export class AdminController {
  service: AdminService

  constructor() {
    this.service = Container.get(AdminService)
  }

  // 登录接口
  @Post('/login')
  async login(
    @BodyParam('username') username: string,
    @BodyParam('password') password: string,
  ): Promise<any> {
    const id = await this.service.checkLogin(username, password)
    return id ? { token: sign({ data: id }, 'flzx#qcysyhl9t') } : '用户名或密码错误'
  }

  // 修改密码
  @Put('/password')
  async changePassword(
    @CurrentUser({ required: true }) admin: Admin,
    @BodyParam('oldPassword') oldPassword: string,
    @BodyParam('newPassword') newPassword: string,
  ): Promise<any> {
    if (newPassword.length < 6) return '密码长度不得小于6位'
    if (admin.password !== oldPassword) return '原密码错误'
    await this.service.changePassword(admin, newPassword)
    return {}
  }

  // 上传头像
  @Post('/avatar')
  @ContentType('multipart/form-data')
  async uploadAvatar(
    @CurrentUser({ required: true }) admin: Admin,
    @UploadedFile('avatar', { options: avatarUploadOptions }) file: File,
  ): Promise<any> {
    return {
      path: await this.service.saveAvatar(
        admin,
        file.path.substring(file.path.indexOf('/')),
      ),
    }
    // TODO 是否删除原头像文件
  }

  // 修改信息
  @Put('/info')
  async changeInfo(
    @CurrentUser({ required: true }) admin: Admin,
    @Body() body: object,
  ): Promise<any> {
    const { id, username, password, ...result } = await this.service.updateAdmin(
      admin,
      body,
    )
    return { content: result }
  }
}
