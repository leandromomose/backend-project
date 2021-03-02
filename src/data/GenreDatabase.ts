import { Genre } from "../entities.ts/Genre";
import { CustomError } from "../error/CustomError";
import { BaseDatabase } from "./BaseDatabase";

export class GenreDatabase extends BaseDatabase {
    private static TABLE_NAME = "GENRES_MUSIC_MANAGER"

    async insertGenre(genre: Genre): Promise<void> {
        try {
            
            await BaseDatabase.connection()
            .insert({
                id: genre.getId(),
                author_id: genre.getAuthor_id(),
                genre: genre.getGenre()
            })
            .into(GenreDatabase.TABLE_NAME)

        } catch (error) {
            throw new CustomError(500, "An unexpected error ocurred")
        }
    }
}