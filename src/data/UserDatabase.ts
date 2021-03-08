import { User } from "../entities.ts/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    private static TABLE_NAME = "USER_EPICS"

    public async insertUser(user: User): Promise<void> {
        try {
            
            await BaseDatabase.connection
            .insert({
                id: user.getId(),
                name: user.getName(),
                email: user.getEmail(),
                nickname: user.getNickname(),
                password: user.getPassword()
            })
            .into(UserDatabase.TABLE_NAME)
        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }

    public async selectUserByEmail(email: string): Promise<User> {
        try {
            
            const result = await BaseDatabase.connection
            .select("*")
            .from(UserDatabase.TABLE_NAME)
            .where({email})

            return new User(
                result[0].id,
                result[0].name,
                result[0].email,
                result[0].nickname,
                result[0].password
            )
        } catch (error) {
            throw new Error(error.sqlMessage)
        }
    }
}