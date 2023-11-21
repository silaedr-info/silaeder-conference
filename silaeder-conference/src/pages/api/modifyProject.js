import { prisma } from "./_prisma_base";

export default async function CreateProject(req, res) {
    if (req.method === "POST") {
        const { name, description, time_for_speech, grade, section, conference_id, members } = req.body
        const users = [
        ]
        const conference = await prisma.conference.findMany({
            where: {
                id: parseInt(conference_id)
            }
        });
        const breaks = await prisma.break.findMany({
            where: {
                conferenceId: conference_id
            }
        });
        const projects = await prisma.project.findMany({
            where: {
                conferenceId: conference_id
            }
        })
        let schedule_pos = breaks.length + projects.length + 1;
        const project = await prisma.project.findUnique({
            where: {
                id: req.body.project_id
            },
            include: {
                users: true,
            }
        })
        const members_of_project_now = []
        project.users.forEach((e) => {
            members_of_project_now.push(e.userId)
        })
        members.forEach((e) => {
            if (!members_of_project_now.includes(e)) {

                users.push({
                    user: {
                        connect: {
                            id: e
                        }
                    }
                })
            }
        })

        await prisma.project.update({
            where: {
                id: req.body.project_id,
            },
            data: {
                schedulePos: schedule_pos,
                name: name,
                description: description,
                section: section,
                timeForSpeech: time_for_speech,
                grade: grade,
                active: true,
                additionalUsers: req.body.additional_users,
                users:
                    {
                        create: users
                    },
                Conference: {
                    connect: {
                        id: conference[0].id,
                    }
                },
            }
        })
        

        return res.status(200).json({ success: true })
    }
}
