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
    @Post()
    async addTag(@CurrentUser({ required: true }) admin: Admin,
        @BodyParam('name', { required: true }) name: string): Promise<any> {
        return { content: await this.service.addTag(name) }
    }

    // 删除标签
    @Delete()
    async deleteTag(@CurrentUser({ required: true }) admin: Admin,
        @BodyParam('id') id: number): Promise<any> {
        await this.service.deleteTagById(id)
        return {}
    }

    // 获取所有标签
    @Get()
    async getAllTags() {
        return { content: await this.service.getAllTag() }
    }

}