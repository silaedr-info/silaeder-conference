import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient
export default async function getConferenceNameByID(req, res) {
    const conference = await prisma.conference.findMany({
        where: {
            id: req.body.id
        }
    });

    await prisma.$disconnect()

    res.status(200).json({ name: conference[0].name })
}