import { PrismaClient } from "@prisma/client";
import { getCookie } from "cookies-next";


const prisma = new PrismaClient

export default async function getUserProjects(req, res) {
    if (req.method === "GET") {
        const jwt = getCookie('auth_token', { req, res })
        const user_id = JSON.parse(atob(jwt.split('.')[1])).user_id
        const all_projects = await prisma.project.findMany({
            include: {
                users: true
            }
        })
        const projects = []
        all_projects.forEach((project) => {
            project.users.forEach((user) => {
                if (user.userId === user_id) {
                    projects.push(project)
                }
            })
        })

        await prisma.$disconnect();
        await res.status(200).json({ projects: projects.sort((a, b) => {return a.id - b.id}) })
    }
}
