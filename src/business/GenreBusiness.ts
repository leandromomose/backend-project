import { GenreDatabase } from "../data/GenreDatabase";
import { Genre, GenreInputDTO } from "../entities.ts/Genre";
import { CustomError } from "../error/CustomError";
import { Authenticator } from "../services/Authenticator";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";

export class GenreBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private genreDatabase: GenreDatabase
    ) {}

    async createGenre(genre: GenreInputDTO, token: string): Promise<void> {
        try {
            
            if(!genre.author_id || !genre.genre){
                throw new CustomError(422, "Fields author_id and genre must be provided")
            }

            const id = this.idGenerator.generate()

            const verifiedToken = this.authenticator.getData(token)

            if(!verifiedToken){
                throw new CustomError(401, "Please log in");
            }

            const newGenre: Genre = new Genre(
                id,
                genre.author_id,
                genre.genre
            )

            await this.genreDatabase.insertGenre(newGenre)

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}