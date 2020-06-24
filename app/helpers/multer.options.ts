import { diskStorage } from "koa-multer";

export const avatarUploadOptions = {
    storage: diskStorage({
        destination: 'app/../static/uploaded/avatar',
        filename: function (req, file, cb) {
            cb(null, Date.now() + '.' + file.originalname.split('.').pop())
        }
    })
}