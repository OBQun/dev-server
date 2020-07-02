import { Service } from 'typedi'
import { Repository, getRepository } from 'typeorm'
import { Admin } from 'app/entities'

enum EditableAttr {
  name = 1,
}

@Service()
export class AdminService {
  repository: Repository<Admin>

  constructor() {
    this.repository = getRepository(Admin)
  }

  // 检查登录
  async checkLogin(username: string, password: string): Promise<number> {
    const admin: Admin = await this.repository.findOne({ username, password })
    return admin && admin.id
  }

  // 修改密码
  async changePassword(admin: Admin, newPassword: string): Promise<boolean> {
    // 校验原密码
    admin.password = newPassword
    return Boolean(await this.repository.save(admin))
  }

  // 保存头像位置到数据库
  async saveAvatar(admin: Admin, avatarPath: string): Promise<string> {
    admin.avatar = avatarPath
    return (await this.repository.save(admin)).avatar
  }

  // 更新用户信息
  async updateAdmin(admin: Admin, info: object): Promise<Admin> {
    Object.keys(info).forEach(key => EditableAttr[key] && (admin[key] = info[key]))
    return await this.repository.save(admin)
  }
}
