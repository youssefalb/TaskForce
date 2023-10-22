import { getUserProjects } from '@/lib/projects';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';


const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        console.log('Kurwa sesja',session);
        if (session?.user?.accessToken && session?.user?.id) {
            getUserProjects(session.user.accessToken, session.user.id)
                .then((data) => { setProjects(data); console.log(data); })
                .catch((error) => console.error(error));
        } else {
            console.error("Access token or user ID is undefined.");
        }

    }, [session]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {projects.map((project) => (
                    // <Link key={project.id} href={`/project/${project.id}`}>
                        <a className="p-4 border rounded-lg border-gray-300 hover:border-blue-500 hover:bg-gray-100 transition duration-300">
                            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
                        </a>
                    // </Link>
                ))}
            </div>
        </div>
    );
};

export default ProjectsPage;
