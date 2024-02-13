import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain";


export class CategoryService {

    constructor(){}

    async createCategory(createCategoryDto:CreateCategoryDto, user:UserEntity){

        const categoryExist  = await CategoryModel.findOne({name:createCategoryDto.name});
        if (categoryExist) {
            throw CustomError.badRequest('Category already exists')
        }
        try {
            
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id
            })

            await category.save();

            return {
                id:category.id,
                name:category.name,
                available:category.available,
            }


        } catch (error) {
            throw CustomError.internalServer('Internal server')
        }
    }

    async getCategories(){
        
        try {
            
            const categories = await CategoryModel.find();
    
            if (categories.length === 0) {
                throw CustomError.notFound('No categories found')
            }
            
            return categories.map(category => {
                return {
                    id:category.id,
                    name:category.name,
                    available:category.available,
                }
            })
        } catch (error) {
            throw CustomError.internalServer('Internal server')
        }
    }


}