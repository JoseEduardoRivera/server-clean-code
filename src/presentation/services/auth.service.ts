import { JwtAdapter, bcryptAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, UserEntity } from '../../domain';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { EmailService } from './email.service';


export class AuthService {

    constructor(
        private readonly emailService: EmailService
    ){}

    public async registerUser(registerUserDto:RegisterUserDto){

        const existUSER = await UserModel.findOne({
            email: registerUserDto.email
        })
        if (existUSER) {
            throw CustomError.badRequest('Email already registered')
        }

        try {
            const user = new UserModel(registerUserDto);
            // Encriptar la contrasenia,
            user.password = bcryptAdapter.hash(registerUserDto.password)
            await user.save() 
            // generar un JWT para autenticar el usuario
            const {password,...rest} = UserEntity.fromObject(user);
            
            const token = await JwtAdapter.generateJWT({id: user.id, email:user.email, password:password})
            if (!token) {
                throw CustomError.internalServer('Error generating token')
            }
            // Email de confirmacion
            await this.sendEmailValidationLink(user.email)

            return {user: rest, Token:token};
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    public async loginUser(loginUserDto:LoginUserDto){
        try { 
            const user = await UserModel.findOne({email: loginUserDto.email})
            
            if (!user) throw CustomError.badRequest('Email not registered')
           
            const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password)
            
            if (!isMatch) throw CustomError.badRequest('Invalid password')

            const {password, ...rest} = UserEntity.fromObject(user);

            const token = await JwtAdapter.generateJWT({id: user.id, email: user.email, password: password})
            if (!token) {
                throw CustomError.internalServer('Error generating token')
            }
            return {
                user:rest,
                token:token
            }
        } catch (error) {
            throw CustomError.internalServer(`${error}`)
        }
    }

    private sendEmailValidationLink = async( email: string ) => {

        const token = await JwtAdapter.generateJWT({ email });
        if ( !token ) throw CustomError.internalServer('Error getting token');
    
        const link = `${ envs.WEB_SERVICE_URL }/auth/validate-email/${ token }`;
        const html = `
          <h1>Validate your email</h1>
          <p>Click on the following link to validate your email</p>
          <a href="${ link }">Validate your email: ${ email }</a>
        `;
    
        const options = {
          to: email,
          subject: 'Validate your email',
          htmlBody: html,
        }
    
        const isSent = await this.emailService.sendEmail(options);
        if ( !isSent ) throw CustomError.internalServer('Error sending email');
    
        return true;
      }

      public validateEmail = async(token:string)=>{
        const payload = await JwtAdapter.validateJWT(token);
        if (!payload) {
            throw CustomError.unAuthorized('Invalid Token')
        }

        const {email} = payload as { email:string};

        if (!email) {
            throw CustomError.internalServer('Email is required')
        }

        const user = await UserModel.findOne({ email:email})
        if (!user) {
            throw CustomError.badRequest('Email does not exist');
        }

        user.emailValidated = true;
        await user.save()
        return true
      }
}

