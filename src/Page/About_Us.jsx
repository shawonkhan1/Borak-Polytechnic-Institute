import React from 'react';

const About_Us = () => {
    return (
        <div className="bg-gray-600 rounded-2xl mt-10 px-6 py-12">
            <div className="max-w-5xl mx-auto text-center">
                {/* Title */}
                <h1 className="text-4xl font-bold mb-6 text-blue-600">
                    About Us
                </h1>

                {/* Intro */}
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
                    Welcome to <span className="font-semibold text-blue-600">Borak Polytechnic Institute</span> — a 
                    modern learning platform where you can purchase high-quality courses, submit 
                    assignments, and track your learning progress.  
                    Our mission is to make education accessible, interactive, and career-focused 
                    for students everywhere.
                </p>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 mt-10">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3 text-blue-600">
                            Quality Courses
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Learn from expert instructors with real-world experience and 
                            up-to-date content.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3 text-blue-600">
                            Assignment Submission
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Easily submit your assignments and get valuable feedback from instructors.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-3 text-blue-600">
                            Progress Tracking
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Track your learning journey and stay motivated with progress reports.
                        </p>
                    </div>
                </div>

                {/* Closing */}
                <div className="mt-12 text-gray-700 dark:text-gray-300">
                    <p>
                        Whether you're just starting out or advancing your career, 
                        <span className="font-semibold text-blue-600"> Borak Polytechnic Institute</span> is here 
                        to help you achieve your learning goals.  
                        Join thousands of students already growing with us!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About_Us;
