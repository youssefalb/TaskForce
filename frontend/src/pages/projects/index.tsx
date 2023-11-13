import { getUserProjects } from '@/lib/projects';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';


const ProjectsPage = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const { data: session } = useSession();


    const fetchData = async () => {
        console.log('Kurwa sesja', session);
        if (session?.user?.accessToken && session?.user?.id) {
            await getUserProjects(session.user.accessToken, session.user.id)
                .then((data) => { setProjects(data); console.log(data); })
                .catch((error) => console.error(error));
        } else {
            console.error("Access token or user ID is undefined.");
        }
    }

    useEffect(() => {
        fetchData();
    }, [session]);


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Projects</h1>
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
        </div>
    );
};

export default ProjectsPage;
