import { CategoryModel } from "../../data";
import { CreateCategoryDto, CustomError, UserEntity } from "../../domain";
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';


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

    async getCategories(paginationDto:PaginationDto){

        const {page, limit} = paginationDto;


        
        try {

            const [totalCategories, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                .skip((page-1) * limit)
                .limit(limit)
            ])
            const totalPages = Math.ceil(totalCategories / limit);

    
            if (categories.length === 0) {
                throw CustomError.notFound('No categories found')
            }


            
            return {
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available,
                })),
                pagination: {
                    total: totalCategories,
                    pageSize: limit,
                    currentPage: page,
                    Pages: totalPages,
                },
            };
        } catch (error) {
            throw CustomError.internalServer('Internal server')
        }
    }


}