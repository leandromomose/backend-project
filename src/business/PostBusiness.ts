import dayjs from "dayjs";
import { PostDatabase } from "../data/PostDatabase";
import { Post, PostComplete, PostExample, PostIdInputDTO, PostInputDTO, Tag } from "../entities.ts/Post";
import { CustomError } from "../error/CustomError";
import { AuthenticationData, Authenticator } from "../services/Authenticator";
import { IdGenerator } from "../services/IdGenerator";

export class PostBusiness {
    constructor(
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private postDatabase: PostDatabase
    ) {}

    async createPost(input: PostInputDTO): Promise<void> {
        try {
            
            if (!input.subtitle || !input.file || !input.tag || !input.collection || !input.token) {
                throw new CustomError(422, "Fields subtitle, file, tag and collection must be provided")
            }

            const tokenData: AuthenticationData = this.authenticator.getData(input.token)

            if (!tokenData) {
                throw new CustomError(422, "Access denied. Please log in")
            }

            const idPost: string = this.idGenerator.generate()
            const idTag: string = this.idGenerator.generate()

            const date = dayjs().format('YYYY-MM-DD')

            const newTag: Tag = {
                id: idTag,
                authorId: tokenData.id,
                tags: input.tag
            }

            const newPost: Post = new Post(
                idPost,
                input.subtitle,
                date,
                input.file,
                input.collection,
                tokenData.id
            )

            await this.postDatabase.insertPost(newPost, newTag)

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    async getAllPosts(token: string): Promise<PostComplete[]> {
        try {
            
            if(!token){
                throw new CustomError(422, "Please log in")
            }

            const tokenData: AuthenticationData = this.authenticator.getData(token)

            if (!tokenData) {
                throw new CustomError(422, "Access denied. Please log in")
            }

            const queryResult = await this.postDatabase.selectAllPosts()

            if (!queryResult) {
                throw new CustomError(404, "No posts were found");
            }

            const result = queryResult.map((item: PostExample) => {
                return {
                    id: item.id, 
                    subtitle: item.subtitle, 
                    file: item.file, 
                    tags: item.tags, 
                    authorId: item.authorId, 
                    nickname: item.nickname, 
                }
            })

            return result
            
        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }

    async getPostById(input: PostIdInputDTO): Promise<PostComplete> {
        try {
            
            if (!input.token || !input.id) {
                throw new CustomError(422, "Please log in")
            }

            const tokenData: AuthenticationData = this.authenticator.getData(input.token)

            if (!tokenData) {
                throw new CustomError(422, "Access denied. Please log in")
            }

            const queryResult = await this.postDatabase.selectPostById(input.id)

            if (!queryResult) {
                throw new CustomError(404, "Post not found");
            }

            return queryResult

        } catch (error) {
            throw new CustomError(error.statusCode, error.message)
        }
    }
}