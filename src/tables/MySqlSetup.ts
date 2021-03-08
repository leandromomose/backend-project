import { BaseDatabase } from "../data/BaseDatabase";

export class MySqlSetup extends BaseDatabase {
    public async createTable(): Promise<void> {
        try {
            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS USER_EPICS (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    nickname VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS POST_EPICS (
                    id VARCHAR(255) PRIMARY KEY,
                    subtitle VARCHAR(750) NOT NULL,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    file VARCHAR(750) NOT NULL,
                    collection VARCHAR(255) NOT NULL,
                    author_id VARCHAR(255) NOT NULL,
                    FOREIGN KEY(author_id) REFERENCES USER_EPICS(id)
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS TAG_EPICS (
                    id VARCHAR(255) PRIMARY KEY,
                    author_id VARCHAR(255) NOT NULL,
                    tag TEXT NOT NULL,
                    FOREIGN KEY(author_id) REFERENCES USER_EPICS(id)
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS POSTTAGS_EPICS (
                    post_id VARCHAR(255),
                    tag_id VARCHAR(255),
                    PRIMARY KEY (post_id, tag_id),
                    FOREIGN KEY (post_id) REFERENCES POST_EPICS(id),
                    FOREIGN KEY (tag_id) REFERENCES TAG_EPICS(id)
                )
            `)

            console.log("MySql setup completed!")

            BaseDatabase.connection.destroy()

        } catch (error) {
            console.log(error.sqlMessage || error.message)

            BaseDatabase.connection.destroy()
        }
    }
}

new MySqlSetup().createTable()