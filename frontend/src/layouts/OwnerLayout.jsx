import Sidebar from "../components/sidebar";

const OwnerLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar role="owner" />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default OwnerLayout;