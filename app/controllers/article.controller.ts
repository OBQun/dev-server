import {
  JsonController,
  Post,
  CurrentUser,
  UploadedFile,
  ContentType,
  BodyParam,
  Delete,
  Put,
  Body,
  Param,
  Authorized,
  Get,
  QueryParam,
} from 'routing-controllers'
import { ArticleService } from 'app/services'
import Container from 'typedi'
import { Admin } from 'app/entities'
import { File } from 'koa-multer'
import { coverUploadOptions } from 'app/helpers/multer.options'

interface baseAttr {
  title: string
  description: string
  body: string
  tags: number[]
}

@JsonController('/article')
export class ArticleController {
  service: ArticleService

  constructor() {
    this.service = Container.get(ArticleService)
  }

  // 新增文章
  @Post()
  @ContentType('mutipart/form-data')
  async addArticle(
    @CurrentUser({ required: true }) admin: Admin,
    @UploadedFile('cover', { options: coverUploadOptions }) cover: File,
    @BodyParam('body') body: baseAttr,
  ): Promise<any> {
    const { id } = await this.service.addArticle({
      ...body,
      cover: cover.path.substring(cover.path.indexOf('/')),
      views: 0,
      author: admin,
    })
    return { id }
  }

  // 删除文章
  @Delete('/:articleId')
  @Authorized(['author'])
  async deleteArticle(@Param('articleId') id: number): Promise<any> {
    return await this.service.deleteArticle(id)
  }

  // 更新文章封面
  @Put('/cover/:articleId')
  @Authorized(['author'])
  @ContentType('multer/form-data')
  async updateCover(
    @UploadedFile('cover', { options: coverUploadOptions }) file: File,
    @Param('articleId') id: number,
  ): Promise<any> {
    return await this.service.updateArticle(id, {
      cover: file.path.substring(file.path.indexOf('/')),
    })
  }

  // 修改文章内容
  @Put('/:articleId')
  @Authorized(['author'])
  async updateArticle(
    @Param('articleId') id: number,
    @Body() body: baseAttr,
  ): Promise<any> {
    return await this.service.updateArticle(id, body)
  }

  // 获取文章列表
  @Get('/:page')
  async getArticles(
    @CurrentUser({ required: false }) admin: Admin,
    @Param('page') page: number = 1,
    @QueryParam('limit') limit: number = 10,
    @QueryParam('tag') tag: number,
  ): Promise<any> {
    if (admin) {
      return { content: await this.service.getAdminArticles(admin, page, limit) }
    } else {
      return { content: await this.service.getArticles(page, tag, limit) }
    }
  }
}
