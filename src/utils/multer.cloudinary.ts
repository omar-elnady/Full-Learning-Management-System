import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'


export type FileType = 'image' | 'files' | 'video'
export type MimeTypes = {
    image: string[],
    files: string[],
    video: string[]
}

export const fileVaildation = {
    image: ['image/jpeg', 'image/png', 'image/gif'],
    files: ['application/pdf', 'application/msword'], video: [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-msvideo',
        'video/x-ms-wmv'
    ]
}

export function fileUplode(vaildationFile: string[]) {

    const storage = multer.diskStorage({})
    function fileFilter(req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (vaildationFile.includes(file.mimetype)) {
            cb(null, true)
        }
        else {
            cb(new Error("in-valid format"))
        }
    }
    const upload = multer({ dest: "uploads", fileFilter, storage })
    return upload
}