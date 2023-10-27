import React, {useEffect, useMemo, useState} from 'react';
import { MantineReactTable } from 'mantine-react-table';
import { useRouter } from 'next/router';
import {Box, Button, Title, Tooltip, Select, Text} from "@mantine/core";
import {
    IconEye,
    IconPlayerPlay, IconPlus
} from '@tabler/icons-react';
import { redirect } from 'next/dist/server/api-utils';
import { IconEyeOff } from '@tabler/icons-react';

const start_data = [
    {
        time: '10:00',
        name_of_project: 'Первый проект',
        participants: 'Первый Первопроектный Участник, Второй Первопроектный Участник',
        hide: false
    }
];

const Schedule = () => {

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

    const [permission, setPermission] = useState(false);

    const [name_of_conference, setName_of_conference] = useState("");
    if (typeof window !== 'undefined') {
        const tags = document.getElementsByTagName('td');
        for (let i = 0; i < tags.length; i++) {
            if (0 === 1) {
                tags[i].style.backgroundColor = '#CCCCCC'
            }
        }
    }

    useEffect(() => {
        if(!router.isReady) return;
        const query = router.query;

        console.log(query);

        fetch('/api/getUserPermission')
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                setPermission(data.permission)
            } else {
                setPermission(false)
            }
        }).catch((e) => {
            router.push("/")
        })

        fetch('/api/getScheduleForConferenceID', {
            method: 'POST',
            body: JSON.stringify({ id: Number(router.query.schedule) }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data.output)
        }).catch((e) => {
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
            console.log(data);
            setName_of_conference(data.name)
        }).catch((e) => {
            router.push("/123/123/123")
        })
    }, [router.isReady]);

    function hide(row) {
        console.log(1);

        fetch('/api/hideOrShowProject', {
            method: 'POST',
            body: JSON.stringify({ id: row.original.id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Handle the response data here
        }).catch((e) => {
            console.error(e);
        })

        fetch('/api/getScheduleForConferenceID', {
            method: 'POST',
            body: JSON.stringify({ id: Number(router.query.schedule) }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data.output)
        }).catch((e) => {
            router.push("/123/123/123")
        })
    }

    return (
        <>
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
                    {permission ? <><Tooltip label={"Открыть презентацию"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color={"indigo.4"} variant={"outline"} leftIcon={<IconPlayerPlay height={30} width={40} color={"#748FFC"} />}
                                onClick={() => {presentClick()}} pl={'6%'} pr={'3%'}>
                        </Button>
                    </Tooltip>
                    <Tooltip label={row.original.hidden ? "Показать проект" : "Скрыть проект"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color={"indigo.4"} variant={"outline"} pl={'6%'} pr={'3%'} strokeWidth={10}
                                leftIcon={row.original.hidden ? <IconEyeOff height={40} width={40} color={"#748FFC"} /> : <IconEye height={40} width={40} color={"#748FFC"} />} onClick={(event) => { hide(row)
                        }}></Button>
                    </Tooltip>
                    <Tooltip label={"Добавить перерыв после"} transitionProps={{ transition: 'slide-up', duration: 300 }} withArrow={true} color={"rgba(0.3, 0.3, 0.3, 0.6)"}>
                        <Button color={"indigo.4"} variant={"outline"} leftIcon={<IconPlus height={40} width={40} color={"#748FFC"} />}
                                onClick={(event) => { console.log(1)
                        }} pl={'6%'} pr={'3%'}></Button>
                    </Tooltip></> : <></>}
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
                                    console.log(data);
                                    setData(data.output)
                                }).catch((e) => {
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