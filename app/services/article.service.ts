import { Service } from 'typedi'
import { Repository, getRepository } from 'typeorm'
import { Article, Tag } from 'app/entities'
import { validate } from 'class-validator'

@Service()
export class ArticleService {
  repository: Repository<Article>

  constructor() {
    this.repository = getRepository(Article)
  }

  // 新建文章
  async addArticle(attr: any): Promise<any> {
    attr.tags = await getRepository(Tag).findByIds(attr.tags)
    return await this.repository.save(this.repository.create(attr))
  }

  // 删除文章
  async deleteArticle(id: number): Promise<any> {
    return (await this.repository.delete(id)) && {}
  }

  // 更新文章
  async updateArticle(id: number, data: object): Promise<any> {
    const article = await this.repository.findOne(id)
    Object.keys(data).forEach(attr => (article[attr] = data[attr]))
    await validate(article)
    return await this.repository.save(article)
  }
}
