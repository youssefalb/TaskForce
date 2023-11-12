import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getProjectTickets } from '@/lib/projects';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TableHead,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import PriorityChip from '../chips/PriorityChips';
import StatusChip from '../chips/StatusChips';

const TableCellStyled = styled(TableCell)({
  fontWeight: 'bold',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '200px',
});



const Tickets = ({ projectId }) => {
  const [tickets, setTickets] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchData = async () => {
    if (session?.user?.accessToken && projectId) {
      try {
        const data = await getProjectTickets(session.user.accessToken, projectId);
        setTickets(data);
        console.log('Response Data', data);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Access token or projectId is undefined.");
    }

  };
  useEffect(() => {
    if (projectId && session?.user?.accessToken) {
      fetchData();
      console.log('Tickets', tickets);
    }
  }, [projectId]);





  const ticketRows = tickets.map((ticket) => (
    <TableRow key={ticket.id} hover className="hover:bg-gray-100">
      <TableCellStyled>{ticket.title}</TableCellStyled>
      <TableCellStyled>
        <PriorityChip priority={ticket.priority} />
        </TableCellStyled>

      <TableCellStyled >
        <StatusChip status={ticket.status} />
      </TableCellStyled>


      <TableCellStyled >
        {ticket.description}
      </TableCellStyled>
      <TableCell>
        <Button variant="contained" color="primary" onClick={() => router.push(`${router.asPath}/tickets/${ticket.id}`)}>
          View Details
        </Button>
      </TableCell>
    </TableRow>
  ));

  return (
    <div className="container mx-auto mt-8">
      <TableContainer component={Paper} sx={{ maxWidth: '100%' }}>
        <Table sx={{ minWidth: 650 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell className="uppercase">Title</TableCell>
              <TableCell className="uppercase">Priority</TableCell>
              <TableCell className="uppercase">Status</TableCell>
              <TableCell className="uppercase">Description</TableCell>
              <TableCell className="uppercase">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ticketRows.length > 0 ? ticketRows : (
              <TableRow>
                <TableCellStyled>
                  No tickets found
                </TableCellStyled>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tickets;