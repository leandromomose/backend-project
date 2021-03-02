import { Request, Response } from "express";
import { GenreBusiness } from "../business/GenreBusiness";
import { GenreDatabase } from "../data/GenreDatabase";
import { GenreInputDTO } from "../entities.ts/Genre";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

const genreBusiness = new GenreBusiness(
    new IdGenerator(),
    new Authenticator(),
    new GenreDatabase()
)

export class GenreController {
    async createGenre(req: Request, res: Response) {
        try {
            
            const input: GenreInputDTO = {
                author_id: req.body.author_id,
                genre: req.body.genre
            }

            const token = req.headers.authorization!

            await genreBusiness.createGenre(input, token)

            res.status(200).send({message: "Genre created successfully"})

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message })
        }
    }
}