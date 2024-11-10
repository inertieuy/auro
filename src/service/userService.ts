import {PrismaClient} from "@prisma/client";

import {sign} from 'hono/jwt'

const prisma = new PrismaClient();

class userService {
    static async findByEmail(email: string){}
    static async findByUsername(username: string){}
    static async register(email: string, password: string){}
    static async login(name: string){}
    static async delete(id: string){}
    static async update(id: string){}
}