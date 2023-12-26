import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { getUserRecords } from '@/lib/projects';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';

const UserRecordsList = () => {
    const [records, setRecords] = useState([]);
    const { data: session } = useSession();
    const router = useRouter();

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const TableCellStyled = styled(TableCell)({
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '200px',
        '&.clickable': {
            cursor: 'pointer',
            color: 'blue',
            textDecoration: 'underline',
        }
    });

    const getProjectPath = (projectId) => {
        router.push(`/projects/${projectId}`);
    };

    const getTicketPath = (projectId, ticketId) => {
        router.push(`/projects/${projectId}/tickets/${ticketId}`);
    };

    const fetchRecords = async () => {
        if (session?.user?.accessToken) {
            try {
                const data = await getUserRecords(session.user.accessToken);
                setRecords(data);
                console.log('Records: ', data);
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error('Access token or user ID is undefined.');
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [session]);

    return (
        <div className="container m-8">
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                            <TableCell>Hours Worked</TableCell>
                            <TableCell>Notes</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Ticket</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((record) => (
                            <TableRow key={record.id}>
                                <TableCellStyled>{formatDate(record.start_date)}</TableCellStyled>
                                <TableCellStyled>{formatDate(record.end_date)}</TableCellStyled>
                                <TableCellStyled>{record.hours_worked}</TableCellStyled>
                                <TableCellStyled>{record.notes}</TableCellStyled>
                                <TableCellStyled className="clickable" style={{ cursor: 'pointer' }} onClick={() => getProjectPath(record.project_id)}>
                                    {record.project_name}
                                </TableCellStyled>
                                <TableCellStyled className="clickable" style={{ cursor: 'pointer' }} onClick={() => getTicketPath(record.project_id, record.ticket)}>
                                    {record.ticket_title}
                                </TableCellStyled>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default UserRecordsList;
