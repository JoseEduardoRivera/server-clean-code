



import { ProductModel } from "../../data";
import { CreateProductDto, CustomError } from "../../domain";
import { PaginationDto } from '../../domain/dtos/shared/pagination.dto';


export class ProductService {

    constructor(){}

    async createProduct(createProductDto:CreateProductDto){

        const productExist  = await ProductModel.findOne({name:createProductDto.name});
        if (productExist) {
            throw CustomError.badRequest('Product already exists')
        }
        try {
            
            const product = new ProductModel(createProductDto)

            await product.save();

            return product


        } catch (error) {
            throw CustomError.internalServer('Internal server')
        }
    }

    async getProduct(paginationDto:PaginationDto){

        const {page, limit} = paginationDto;
        
        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                 .skip((page-1) * limit)
                 .limit(limit)
                 .populate('user')
                 .populate('category')
            ]) 

            const totalPages = Math.ceil(total / limit);


            
            return {
                products: products,
                pagination: {
                    total: total,
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