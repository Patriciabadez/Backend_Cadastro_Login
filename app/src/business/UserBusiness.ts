import { IdGenerator } from '../services/IdGenerator'
import { HashManager } from '../services/HashManager'
import { UserDatabase } from '../data/UserDatabase'
import { User } from '../model/User'

const idGenerator = new IdGenerator()
const hashManager = new HashManager()
const userDatabase = new UserDatabase()
export class UserBusiness {

    public async signup(email: string, name: string, password: string, role: string){
        const id = idGenerator.generatorId()
        const hashPassword = await hashManager.hash(password)
        const user = new User(id, email, name, hashPassword, role)
        await userDatabase.createUser(user)

        return { id: id, role: role }
    }

    public async login(email: string, password: string){
        const user = await userDatabase.getUserByEmail(email)
        if(!user){
            throw new Error("Parâmetros incorretos !")// O usuário não existe 
        }
 
        const comparePasswords = await hashManager.compare(password, user.getPassword())
        if (!comparePasswords) {
            throw new Error("Invalid Params")
        }

        return { id: user.getId(), role: user.getRole()}
    }
    
}