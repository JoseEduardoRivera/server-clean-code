import { CustomError } from "../errors/custom.error";

export class UserEntity {


    constructor(
        public id:string,
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
        public role: string[],
        public img?: string,
    ){}

    static fromObject(object: {[key: string]: any}){
        const {id, _id, name, email, emailValidated, password, role, img } = object;
        
        if (!_id && !id)  {
            throw CustomError.badRequest('Missing Id');
        }
        if (!name) {
            throw CustomError.badRequest('Missing Name');
        }
        if (!email) {
            throw CustomError.badRequest('Missing Email');
        }
        if(emailValidated === undefined) throw CustomError.badRequest('Missing Email Validated');
        if (!password) {
            throw CustomError.badRequest('Missing Password');
        }
        if (!role) {
            throw CustomError.badRequest('Missing Role');
        }

        return new UserEntity(
            _id || id,
            name,
            email,
            emailValidated,
            password,
            role,
            img
        );
    }


}