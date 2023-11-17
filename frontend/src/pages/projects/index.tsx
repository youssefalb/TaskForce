import { getUserProjects } from '@/lib/projects';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import EmptyStateMessage from '@/components/EmptyStateMessage';
import AddProjectDialog from '@/components/AddProjectDialog';
import { createProject } from '@/lib/projects';

const ProjectsPage = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(true);


    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddDialogClose = () => {
        setIsAddDialogOpen(false);
    };



    const fetchData = async () => {
        console.log('Kurwa sesja', session);
        if (session?.user?.accessToken && session?.user?.id) {
            setIsLoading(true);
            await getUserProjects(session.user.accessToken, session.user.id)
                .then((data) => { setProjects(data); console.log(data); })
                .catch((error) => console.error(error))
                .finally(() => setIsLoading(false));
        } else {
            console.error("Access token or user ID is undefined.");
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [session]);

    const addProject = () => {
        setIsAddDialogOpen(true);
    }

    const handleAddProject = (projectData) => {
        if (session?.user?.accessToken) {
            createProject(session.user.accessToken, projectData)
                .then((data) => { console.log(data); fetchData(); })
                .catch((error) => console.error(error));
        }
    
    };

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (projects.length === 0) {
        return (
            <EmptyStateMessage
                title="No Projects Found"
                description="You do not have any projects yet. Start by adding a new project."
            />
        );
    }
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Projects</h1>
                <button onClick={addProject} className="p-2 m-2 text-black font-bold bg-zinc-300 rounded-2xl">
                    + Add Project
                </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {projects.map((project) => (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                        <div className="p-4 border rounded-lg border-gray-300 hover:border-blue-500 hover:bg-gray-100 transition duration-300">
                            <div className="relative">
                                <img src={project.image} alt={project.title} className="w-full h-40 object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-50 transition duration-300 rounded-lg"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white text-center text-lg font-semibold bg-opacity-50 bg-black p-2 rounded-md truncate">
                                        {project.title}
                                    </p>
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-gray-600 truncate">{project.description}</p>
                        </div>
                    </Link>

                ))}
            </div>

            <AddProjectDialog
                open={isAddDialogOpen}
                handleClose={handleAddDialogClose}
                handleSubmit={handleAddProject}
            />
        </div>
    );
};

export default ProjectsPage;
