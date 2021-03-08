import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { PostDatabase } from "../data/PostDatabase";
import { PostIdInputDTO, PostInputDTO } from "../entities.ts/Post";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

const postBusiness = new PostBusiness(
    new IdGenerator(),
    new Authenticator(),
    new PostDatabase()
)

export class PostController {
    async createPost(req: Request, res: Response): Promise<void> {
        try {
            
            const token: string = req.headers.authorization as string

            const input: PostInputDTO = {
                token: token,
                subtitle: req.body.subtitle,
                file: req.body.file,
                tag: req.body.tag,
                collection: req.body.collection
            }

            await postBusiness.createPost(input)

            res.status(200).send("Post created succesfully!")

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message })
        }
    }

    async getAllPosts(req: Request, res: Response): Promise<void> {
        try {
            
            const token: string = req.headers.authorization as string

            const result = await postBusiness.getAllPosts(token)

            res.status(200).send(result)

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message })
        }
    }

    async getPostById(req: Request, res: Response): Promise<void> {
        try {
            
            const token: string = req.headers.authorization as string

            const input: PostIdInputDTO = {
                token: token,
                id: req.params.id
            }

            const result = await postBusiness.getPostById(input)

            res.status(200).send(result)

        } catch (error) {
            res
                .status(error.statusCode || 400)
                .send({ error: error.message })
        }
    }
}