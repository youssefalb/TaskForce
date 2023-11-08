
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Tickets from "../../components/projects/Tickets";
import { getProjectDetails } from '@/lib/projects';
import Users from '@/components/projects/Users';
import ProjectInfo from '@/components/projects/ProjectInfo';
import Home from '@/components/projects/Home';
import ProjectRoles from '@/components/projects/ProjectRoles';
import { getUserPermissions } from '@/lib/projects';

export default function ProjectPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [project, setProject] = useState([]);
  const router = useRouter()
  const { id } = router.query
  const { data: session } = useSession()
  const [permissions, setPermissions] = useState([])

  const fetchData = async () => {
    if (session?.user?.accessToken && id) {
      await getProjectDetails(session.user.accessToken, id.toString())
        .then((data) => { setProject(data); console.log('Projectyyyy: ', data)})
        .catch((error) => console.error(error));
    } else {
      console.error("Access token or user ID is undefined.");
    }

  }
  const fetchPermissions = async () => {
    if (session?.user?.accessToken && id) {
      await getUserPermissions(session.user.accessToken, id.toString(), session?.user.id)
        .then((data) => {
          const codenames = data.map(permission => permission.codename);
          setPermissions(codenames);
          console.log('Codenames', codenames);
        })
        .catch((error) => console.error(error));
    } else {
      console.error("Access token or user ID is undefined.");
    }

  }





  useEffect(() => {
    fetchData()
    fetchPermissions()
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
        <Tab label="Home" />
        <Tab label="Info" />
        <Tab label="Users" />
        <Tab label="Tickets" />
        <Tab label="Roles" />
      </Tabs>
      <Box p={3}>
        {activeTab === 0 && <div><Home projectId={id} permissions={permissions} /> </div>}
        {activeTab === 1 && <div><ProjectInfo details={project} fetchData={fetchData} /></div>}
        {activeTab === 2 && <div><Users projectId={id} projectRoles={project?.roles}/></div>}
        {activeTab === 3 && <div><Tickets projectId={id} /></div>}
        {activeTab === 4 && <div><ProjectRoles projectId={id} /></div>}
      </Box>
    </div>
  );

};

