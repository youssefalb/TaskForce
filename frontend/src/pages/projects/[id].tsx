
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Tickets from "../../components/projects/Tickets";
import { getProjectDetails } from '@/lib/projects';
import Users from '@/components/projects/Users';
import Settings from '@/components/projects/Settings';
import Home from '@/components/projects/Home';

export default function ProjectPage() {
    const [activeTab, setActiveTab] = useState(0);
    const [project, setProject] = useState([]);
    const router = useRouter()
    const { id } = router.query
    const { data: session } = useSession()

    const fetchData = async () => {
        console.log('Kurwa sesja', session)
        if (session?.user?.accessToken && id) {
            await getProjectDetails(session.user.accessToken, id.toString())
                .then((data) => { setProject(data); console.log('Response Data', data); } )
                .catch((error) => console.error(error));
        } else {
            console.error("Access token or user ID is undefined.");
        }
    }

    useEffect(() => {
        fetchData()
    }, [session])


    const handleTabChange = (event: any, newValue: any) => {
        setActiveTab(newValue);
    };

return (
    <div>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab label="Info" />
        <Tab label="Home" />
        <Tab label="Settings" />
        <Tab label="Users" />
        <Tab label="Tickets" />
      </Tabs>
        <Box p={3}>
          {activeTab === 0 &&  <div>Info</div> }
          {activeTab === 1 && <div><Home projectId= {id}/> </div>}
          {activeTab === 2 && <div><Settings details = {project}/> </div>}
          {activeTab === 3 && <div><Users projectId= {id}/></div>}
          {activeTab === 4 && <div><Tickets projectId ={id}/></div>}
        </Box>
    </div>
  );

};

