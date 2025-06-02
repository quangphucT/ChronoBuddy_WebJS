import { Button } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import subImage from '../../assets/images/business-team-meeting-boardroom.jpg';
import logoToDoList from '../../assets/images/unnamed.png';

const AboutSection = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 lg:p-12 bg-white rounded-xl shadow-md">
      {/* Image Section */}
      <div className="flex-shrink-0 w-full lg:w-1/2">
        <img
          src={subImage}
          alt="Todo List"
          className="rounded-xl w-full object-cover"
        />
      </div>

      {/* Text Section */}
      <div className="w-full lg:w-1/2">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          ABOUT{' '}
          <span className="bg-gradient-to-r from-red-500 via-green-500 to-blue-500 text-transparent bg-clip-text">
            TODOLIST
          </span>
        </h2>

        <p className="text-gray-700 mb-4 leading-relaxed">
          TODOLIST is a simple and effective application that helps users manage their daily tasks. You can easily add, edit, and mark tasks as completed.
        </p>

        <p className="text-gray-700 mb-6 leading-relaxed">
          With an intuitive interface and synchronization features, TODOLIST helps you organize your time efficiently, boost personal productivity, and ensure you never miss any important task.
        </p>

        {/* Logo + Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src={logoToDoList}
            alt="TodoList Logo"
            className="h-[150px]"
          />

          <Button
            type="primary"
            size="large"
            className="bg-green-600 hover:bg-green-700 border-none flex items-center gap-2"
          >
            Learn More
            <span className="ml-2 text-white flex items-center gap-1">
              <PhoneOutlined />
              +84 335 785 107
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
