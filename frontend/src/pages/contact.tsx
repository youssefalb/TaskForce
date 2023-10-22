import React from 'react';

function Contact() {
  const githubUrl = "https://github.com/youssefalb";

  function handleGitHubButtonClick() {
    window.open(githubUrl, '_blank');
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-2 mt-1">Development Team</h1>
        <p className="text-lg text-center mb-12">Best of the best.</p>
        <div className="grid grid-cols-3 gap-4 m-10">
          <div className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center p-10">
            <img src="/images/youssef.png" alt="Youssef Al Bali" className="w-32 h-32 rounded-full mb-4 object-cover" />
            <h2 className="text-lg font-bold mb-2">Youssef Al Bali</h2>
            <p className="text-gray-500 mb-4">Software Engineer</p>
            <button className="px-8 py-1 text-gray-900 bg-zinc-300 rounded-2xl mr-2 my-3 font-bold" onClick={handleGitHubButtonClick}>
              View on GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
