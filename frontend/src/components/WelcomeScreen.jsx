import React from 'react';
import { GraduationCap, BookOpen, Users, MapPin, DollarSign, Calendar } from 'lucide-react';

const WelcomeScreen = ({ onSampleQuestion }) => {
  const sampleQuestions = [
    {
      icon: <GraduationCap className="w-5 h-5" />,
      question: "What are the admission requirements?",
      category: "Admissions"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      question: "Tell me about the Computer Science program",
      category: "Academics"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      question: "What facilities are available on campus?",
      category: "Campus Life"
    },
    {
      icon: <DollarSign className="w-5 h-5" />,
      question: "What financial aid options are available?",
      category: "Financial Aid"
    },
    {
      icon: <Users className="w-5 h-5" />,
      question: "What student organizations can I join?",
      category: "Student Life"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      question: "When is the application deadline?",
      category: "Deadlines"
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome to College Assistant
          </h2>
          
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            I'm here to help answer your questions about courses, admissions, campus life, and more. 
            What would you like to know?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sampleQuestions.map((item, index) => (
            <button
              key={index}
              onClick={() => onSampleQuestion(item.question)}
              className="group p-4 text-left bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 p-2 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                    {item.question}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.category}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-gray-500">
            You can ask me anything about college life, academics, admissions, and more!
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;