import { BaseDatabase } from "./BaseDatabase";

export class RefreshTokenDatabase extends BaseDatabase {

    private static TABLE_NAME: string = "cadastrologinToken_users"

    // PARA O SIGNUP
    public async createRefreshToken(
        refreshToken: string,
        device: string,
        isActive: boolean,
        userId: string
    ): Promise<void> {
        await this.connection()
            .insert({
                refresh_token: refreshToken,
                device,
                is_active: this.convertBooleanToTinyint(isActive),
                user_id: userId
            })
            .into(RefreshTokenDatabase.TABLE_NAME)
    }

    public async getRefreshToken(refreshToken: string): Promise<any> {
        const result = await this.connection()
            .select("*")
            .from(RefreshTokenDatabase.TABLE_NAME)
            .where({
                refresh_token: refreshToken
            })

        return {
            refreshToken: result[0].refresh_token,
            device: result[0].device,
            userId: result[0].user_id,
            isActive: this.convertTinyintToBoolean(result[0].is_active)
        }
    }

    // PARA O LOGIN
    public async getRefreshTokenByUserIdAndDevice(
        userId: string,
        device: string
    ): Promise<any> {
        const result = await this.connection()
            .select("*")
            .from(RefreshTokenDatabase.TABLE_NAME)
            .where({
                user_id: userId,
                device
            })

        return result[0] && {
            refreshToken: result[0].refresh_token,
            device: result[0].device,
            userId: result[0].user_id,
            isActive: this.convertTinyintToBoolean(result[0].is_active)
        }
    }

    public async deleteRefreshToken(refreshToken: string) {
        await this.connection()
            .delete()
            .from(RefreshTokenDatabase.TABLE_NAME)
            .where({
                refresh_token: refreshToken
            })
    }


}