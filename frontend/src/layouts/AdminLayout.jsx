import Sidebar from "../components/sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 bg-gray-50 min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;