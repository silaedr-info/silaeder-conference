import React, {useEffect, useMemo, useState} from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { useRouter } from 'next/router';
import {Box, Button, Title, Tooltip, Select, Text, Modal, Container, NumberInput} from "@mantine/core";
import {
    IconEye,
    IconPlayerPlay, IconPlus
} from '@tabler/icons-react';
import {useForm} from "@mantine/form";

const start_data = [
];

const Schedule = () => {

    const form = useForm()

    const columns = useMemo(
        //column definitions...
        () => [
            {
                accessorKey: 'time',
                header: 'Время',
                size: 0
            },
            {
                accessorKey: 'name_of_project',
                header: 'Название проекта',
                size: 200
            },
            {
                accessorKey: 'participants',
                header: 'Участники',
                size: 200
            }
        ],
        [],
        //end
    );
    const router = useRouter();
    const handleClick = () => {
        router.push('/');
    };
    const presentClick = () => {
        router.push('/auth');
    };
    const [data, setData] = useState(start_data);
    const [name_of_conference, setName_of_conference] = useState("");
    if (typeof window !== 'undefined') {
        const tags = document.getElementsByTagName('td');
        for (let i = 0; i < tags.length; i++) {
            if (0 === 1) {
                tags[i].style.backgroundColor = '#CCCCCC'
            }
        }
    }

    const [anotherOpened, changeOpened] = useState(false)

    const addBreak = async (time, id, pos) => {
        changeOpened(false)
        await fetch('/api/addBreak', {
            method: 'post',
            body: JSON.stringify({
                time: time,
                conference_id: id,
                schedule_pos: pos
            })
        })
        location.reload()
    }


    useEffect(() => {
        if(!router.isReady) return;
        const query = router.query;

        console.log(query);

        fetch('/api/getScheduleForConferenceID', {
            method: 'POST',
            body: JSON.stringify({ id: Number(router.query.schedule) }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setData(data.output)
        }).catch(() => {
            router.push("/123/123/123")
        })

        fetch('/api/getConferenceNameByID', {
            method: 'POST',
            body: JSON.stringify({ id: Number(router.query.schedule) }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            setName_of_conference(data.name)
        }).catch(() => {
            router.push("/123/123/123")
        })
    }, [router.isReady]);
    const [pos, changePos] = useState()
    return (
        <>
            <Modal opened={anotherOpened} onClose={() => { changeOpened(false) }} title="" centered>
                <Container size={350} my={10}>
                    <Title
                        align="center"
                        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                    >
                        Добавить перерыв
                    </Title>
                    <form onSubmit={form.onSubmit((values) => addBreak(Number(values.time), Number(router.query.schedule), Number(pos) + 1))}>
                        <NumberInput label="Длительность перерыва" placeholder="Время в минутах" required mt="md" {...form.getInputProps('time')} />
                        <Button type={'submit'} fullWidth mt="xl" color="indigo.4">
                            Сохранить
                        </Button>
                    </form>
                </Container>
            </Modal>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
                m={'1%'}
            >
                Расписание конференции {name_of_conference}
            </Title>
            <Box>
            <MantineReactTable
                autoResetPageIndex={true}
                columns={columns}
                data={data}
                enableRowDragging={true}
                enableRowOrdering={true}
                manualSorting={true}
                enableFullScreenToggle={false}
                enableSorting={false}
                enableColumnActions={false}
                enableTopToolbar={false}
                enableRowActions={true}
                positionActionsColumn={"last"}
                renderRowActions={({
                                       row
                                   }) => <div style={{
                    display: 'flex',
                    flexWrap: 'nowrap',
                    gap: '8px'
                }}>
                    <Tooltip label={"Открыть презентацию"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color="indigo.4" variant={"outline"} leftIcon={<IconPlayerPlay height={30} width={40} color={"#748FFC"} />}
                                onClick={() => {presentClick()}} pl={'6%'} pr={'3%'}>
                        </Button>
                    </Tooltip>
                    <Tooltip label={"Скрыть/показать проект"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color="indigo.4" variant={"outline"} pl={'6%'} pr={'3%'} strokeWidth={10}
                                leftIcon={<IconEye height={40} width={40} color={"#748FFC"} />} onClick={(event) => { console.log(1)
                        }}></Button>
                    </Tooltip>
                    <Tooltip label={"Добавить перерыв после"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color="indigo.4" variant={"outline"} leftIcon={<IconPlus height={40} width={40} color={"#748FFC"} />}
                                onClick={() => { changeOpened(true); changePos(Number(row.id) + 1) }} pl={'6%'} pr={'3%'}></Button>
                    </Tooltip>
                </div>}
                mantineTableBodyRowProps={({ row }) => ({
                    onClick: (event) => { if (event.target.tagName === "TD") {handleClick()} },
                    sx: {
                        cursor: 'pointer', //you might want to change the cursor too when adding an onClick
                    },

                })}
                mantineRowDragHandleProps={({ table }) => ({
                    onDragEnd: () => {
                        const { draggingRow, hoveredRow } = table.getState();
                        if (hoveredRow && draggingRow) {
                            data.splice(
                                hoveredRow.index,
                                0,
                                data.splice(draggingRow.index, 1)[0],
                            );
                            setData([...data]);
                            
                            let output = [];

                            data.forEach((el, idx) => {
                                if (el.name_of_project === "Перерыв") {
                                    output.push({
                                        type: "break",
                                        id: el.id
                                    })
                                } else {
                                    output.push({
                                        type: "project",
                                        id: el.id
                                    })
                                }
                            })

                            fetch('/api/saveProjectsAndBreaks', {
                                method: 'POST',
                                body: JSON.stringify({ objects1: output }),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((data) => {
                                fetch('/api/getScheduleForConferenceID', {
                                    method: 'POST',
                                    body: JSON.stringify({ id: Number(router.query.schedule) }),
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                })
                                .then(response => response.json())
                                .then(data => {
                                    setData(data.output)
                                }).catch(() => {
                                    router.push("/123/123/123")
                                })
                            });
                        }
                    },
                })}
            />
            </Box>
        </>
    );
};

export default Schedule;