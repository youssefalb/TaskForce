import React from 'react';
import Link from 'next/link';

const About = () => {
  const features = [
    {
      title: 'Task Assignment & Tracking',
      description:
        'Effortlessly assign tasks to remote team members and keep track of their progress in real-time. No more wondering about task status!',
    },
    {
      title: 'Time Tracking & Reporting',
      description:
        'Gain insights into how your remote team spends their time. Monitor productivity and identify areas for improvement with detailed time tracking and reporting features.',
    },
    {
      title: 'Effective Communication',
      description:
        'Facilitate seamless communication among your remote teams. Our built-in communication tools make collaboration easy and efficient.',
    },
    {
      title: 'Productivity Analytics',
      description:
        'Unlock the power of data-driven decision-making. TaskForce provides in-depth productivity analytics to help you optimize team performance.',
    },
    {
      title: 'Streamlined Collaboration',
      description:
        'Bring your remote team together like never before. TaskForce streamlines collaboration, making remote work feel like you are all in the same room.',
    },
  ];

  return (
    <div>
      <div className="bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="font-extrabold md:text-6xl">
            Welcome to TaskForce
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            TaskForce is your comprehensive solution for effective remote team management. In the era of remote work, we empower organizations to boost productivity and collaboration across dispersed teams.
          </p>
          <div className="mt-5 max-w-md mx-auto flex justify-center">
            <Link href="./auth/login" className='inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-blue-700 bg-white hover:bg-blue-50'>
              Log In & Start Managing
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-10">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            Why Choose TaskForce?
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div className="bg-white overflow-hidden shadow rounded-lg" key={index}>
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {feature.title}
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
