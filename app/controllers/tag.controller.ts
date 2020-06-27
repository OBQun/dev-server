import { JsonController, Get, Post, CurrentUser, BodyParam, Delete } from "routing-controllers";
import { TagService } from "app/services";
import Container from "typedi";
import { Admin } from "app/entities";

@JsonController('/tag')
export class TagController {

    service: TagService

    constructor() {
        this.service = Container.get(TagService)
    }

    //添加标签
    @Post('/add')
    async addTag(@CurrentUser({ required: true }) admin: Admin,
        @BodyParam('name', { required: true }) name: string): Promise<any> {
        return await this.service.addTag(name) || new Error('添加标签失败')
    }

    // 删除标签
    @Delete('/delete')
    async deleteTag(@CurrentUser({ required: true }) admin: Admin,
        @BodyParam('id') id: number): Promise<any> {
        return await this.service.deleteTagById(id) ? '删除标签成功' : new Error('删除标签失败')
    }

    // 获取所有标签
    @Get('/all')
    async getAllTags() {
        return { content: await this.service.getAllTag() }
    }

}