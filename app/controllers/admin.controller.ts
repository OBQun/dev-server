import { JsonController, Post, BodyParam, NotFoundError, Put, CurrentUser, UploadedFile, ContentType, Body } from "routing-controllers";
import { AdminService } from "app/services";
import Container from "typedi";
import { sign } from "jsonwebtoken";
import { Admin } from "app/entities";
import { avatarUploadOptions } from "app/helpers/multer.options";



@JsonController('/admin')
export class AdminController {

    service: AdminService

    constructor() {
        this.service = Container.get(AdminService)
    }

    // 登录接口
    @Post('/login')
    async login(@BodyParam('username') username: string,
        @BodyParam('password') password: string): Promise<any> {
        const id = await this.service.checkLogin(username, password)
        return id
            ? { token: sign({ data: id }, 'flzx#qcysyhl9t') }
            : new NotFoundError('用户名或密码错误')
    }

    // 修改密码
    @Put('/changePassword')
    async changePassword(@CurrentUser({ required: true }) admin: Admin,
        @BodyParam('oldPassword') oldPassword: string,
        @BodyParam('newPassword') newPassword: string): Promise<any> {
        if (newPassword.length < 6)
            return new Error('密码长度不得小于6位')
        if (admin.password !== oldPassword)
            return new Error('原密码错误')
        const result = await this.service.changePassword(admin, newPassword)
        return result ? '密码修改成功' : new Error('密码修改失败')
    }

    // 上传头像
    @Post('/uploadAvatar')
    @ContentType('multipart/form-data')
    async uploadAvatar(@CurrentUser({ required: true }) admin: Admin,
        @UploadedFile('avatar', { options: avatarUploadOptions }) file: any): Promise<any> {
        const result = await this.service.saveAvatar(admin, file.path.substring(file.path.indexOf('/')))
        return result ? '头像上传成功' : new Error('头像上传失败')
        // TODO 是否删除原头像文件
    }

    // 修改信息
    @Put('/changeInfo')
    async changeInfo(@CurrentUser({ required: true }) admin: Admin,
        @Body() body: object): Promise<any> {
        const { id, username, password, ...result } = await this.service.updateAdmin(admin, body)
        return result
    }

}