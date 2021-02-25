import { BaseDatabase } from "../data/BaseDatabase";

export class MySqlSetup extends BaseDatabase {
    public async createTable(): Promise<void> {
        try {
            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS USERS_MUSIC_MANAGER (
                    id VARCHAR(255) PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    nickname VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS MUSICS_MUSIC_MANAGER (
                    id VARCHAR(255) PRIMARY KEY,
                    title VARCHAR(255) NOT NULL,
                    author_id VARCHAR(255) NOT NULL,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    file VARCHAR(255) NOT NULL,
                    album VARCHAR(255) NOT NULL,
                    FOREIGN KEY(author_id) REFERENCES USERS_MUSIC_MANAGER(id)
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS GENRES_MUSIC_MANAGER (
                    id VARCHAR(255) PRIMARY KEY,
                    author_id VARCHAR(255) NOT NULL,
                    genre TEXT NOT NULL,
                    FOREIGN KEY(author_id) REFERENCES USERS_MUSIC_MANAGER(id)
                )
            `)

            await BaseDatabase.connection.raw(`
                CREATE TABLE IF NOT EXISTS MUSICS_GENRES_MUSIC_MANAGER (
                    music_id VARCHAR(255),
                    genre_id VARCHAR(255),
                    PRIMARY KEY (music_id, genre_id),
                    FOREIGN KEY (music_id) REFERENCES MUSICS_MUSIC_MANAGER(id),
                    FOREIGN KEY (genre_id) REFERENCES GENRES_MUSIC_MANAGER(id)
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