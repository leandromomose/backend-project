import { UserDatabase } from "../data/UserDatabase";
import { LoginInputDTO, SignupInputDTO, User } from "../entities.ts/User";
import { CustomError } from "../error/CustomError";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class UserBusiness {

    constructor(
        private idGenerator: IdGenerator,
        private hashManager: HashManager,
        private authenticator: Authenticator,
        private userDatabase: UserDatabase
    ) { }

    async createUser(user: SignupInputDTO) {

        try {

            if (!user.name || !user.email || !user.nickname || !user.password) {
                throw new CustomError(422, "Fields name, email, nickname and password must be provided")
            }

            if (user.email.indexOf("@") === -1) {
                throw new CustomError(422, "Email address must have an @")
            }

            if (user.password.length < 6) {
                throw new CustomError(422, "Invalid password, your password must have more than 6 characters")
            }

            const id = this.idGenerator.generate()

            const hashPassword = await this.hashManager.hash(user.password)

            const newUser: User = new User(
                id,
                user.name,
                user.email,
                user.nickname,
                hashPassword
            )

            await this.userDatabase.insertUser(newUser)

            const accessToken = this.authenticator.generateToken({ id })

            return accessToken

        } catch (error) {

            throw new CustomError(error.statusCode, error.message)
        }
    }

    async getUserByEmail(user: LoginInputDTO) {

        try {
            if (!user.email || user.email.indexOf("@") === -1) {
                throw new CustomError(422, 'The field email must be provided and it must have an @ character')
            }

            if (!user.password) {
                throw new CustomError(422, 'The field password must be provided')
            }

            const userFromDB = await this.userDatabase.selectUserByEmail(user.email)

            if (!userFromDB) {
                throw new CustomError(401, "User not found")
            }

            const userPassword: string = userFromDB.getPassword()

            const passwordIsCorrect = await this.hashManager.compare(
                user.password,
                userPassword
            )

            if (!passwordIsCorrect) {
                throw new CustomError(401, "Field password is incorrect, please try again")
            }

            const id: string = userFromDB.getId()

            const accessToken = this.authenticator.generateToken({id})

            return accessToken

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}