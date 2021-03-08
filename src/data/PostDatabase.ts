import dayjs from "dayjs";
import { Post, PostComplete, Tag } from "../entities.ts/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    private static TABLE_NAME = "POST_EPICS";
    private static SECOND_TABLE_NAME = "TAG_EPICS"
    private static INTER_TABLE_NAME = "POSTTAGS_EPICS"

    private static toPostModel(post: any): PostComplete {
        return new PostComplete(
            post.id,
            post.subtitle,
            dayjs(post.date).format('DD/MM/YYYY'),
            post.file,
            post.collection,
            post.tag,
            post.author_id,
            post.nickname,
        )
    }

    public async insertPost(post: Post, tag: Tag) {
        try {

            await BaseDatabase.connection
                .insert({
                    id: post.getId(),
                    subtitle: post.getSubtitle(),
                    date: post.getDate(),
                    file: post.getFile(),
                    collection: post.getCollection(),
                    author_id: post.getAuthorId()
                })
                .into(PostDatabase.TABLE_NAME)

            await BaseDatabase.connection
                .insert({
                    id: tag.id,
                    author_id: tag.authorId,
                    tag: tag.tags
                })
                .into(PostDatabase.SECOND_TABLE_NAME)

            await BaseDatabase.connection
                .insert({
                    post_id: post.getId(),
                    tag_id: tag.id
                })
                .into(PostDatabase.INTER_TABLE_NAME)

        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }

    public async selectAllPosts(): Promise<any> {
        try {

            const result = await BaseDatabase.connection.raw(`
            SELECT post.id, 
            post.subtitle,
            post.date,
            post.file,
            post.collection,
            tag.tag,
            post.author_id, 
            users.nickname FROM POST_EPICS post
            RIGHT JOIN USER_EPICS users
            ON post.author_id =  users.id
            LEFT JOIN TAG_EPICS tag
            ON tag.author_id = post.author_id
            JOIN POSTTAGS_EPICS pt
            ON pt.post_id = post.id
            AND pt.tag_id = tag.id
            ORDER BY date DESC
            `)

            let postArray: PostComplete[] = []

            for (let item of result[0]) {
                postArray.push(PostDatabase.toPostModel(item))
            }

            return postArray

        } catch (error) {
            throw new Error(error.sqlmessage || error.message)
        }
    }

    public async selectPostById(id: string): Promise<any> {
        try {
            
            const result = await BaseDatabase.connection.raw(`
            SELECT post.id, 
            post.subtitle,
            post.date,
            post.file,
            post.collection,
            tag.tag,
            post.author_id, 
            users.nickname FROM POST_EPICS post
            RIGHT JOIN USER_EPICS users
            ON post.author_id = users.id
            LEFT JOIN TAG_EPICS tag
            ON tag.author_id = post.author_id
            JOIN POSTTAGS_EPICS pt
            ON pt.post_id = post.id
            AND pt.tag_id = tag.id
            WHERE post.id = "${id}"
            ORDER BY date DESC;
            `)

            return PostDatabase.toPostModel(result[0][0])

        } catch (error) {
            throw new Error(error.sqlmessage || error.message)
        }
    }
}