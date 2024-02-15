import mongoose from "mongoose"

const isMongoId = (id:string) => {
    return mongoose.isValidObjectId(id)
}

export const validators = {
    isMongoId
}