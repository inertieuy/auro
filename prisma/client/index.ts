import {PrismaClient} from "@prisma/client"

const prisma = new PrismaClient({
    log : ['info','eror','warn','query'],
    errFormat : 'pretty'
})

export default prisma