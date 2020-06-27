import { Service } from "typedi";
import { Repository, getRepository } from "typeorm";
import { Tag } from "app/entities";
import { threadId } from "worker_threads";

@Service()
export class TagService {

    repository: Repository<Tag>

    constructor() {
        this.repository = getRepository(Tag)
    }

    // 添加tag
    async addTag(name: string): Promise<Tag> {
        const hasTag = await this.repository.findOne({ name })
        if (hasTag) return hasTag
        return await this.repository.save(this.repository.create({ name }))
    }

    // 删除tag
    async deleteTagById(id: number): Promise<boolean> {
        return Boolean(await this.repository.delete(id))
    }


    // 获取标签
    async getAllTag() {
        return await this.repository.find()
    }
}