interface AdminCardProps {
    picture: string;
    username: string;
    name: string;
    role: string;
    onEdit: () => void;
    onDelete: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ picture, username, name, role, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center">
                <img
                    src={picture}
                    alt="Admin Avatar"
                    className="w-12 h-12 rounded-full border-2 border-blue-500 mr-4"
                />
                <div>
                    <div className="font-medium">{username}</div>
                    <div className="text-gray-600">{name}</div>
                </div>
            </div>
            <div className="flex items-center">
                <div className="text-gray-700 mr-4">{role}</div>
                <button
                    onClick={onEdit}
                    className="mr-4 p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                >
                    ✏️ {/* Icon แก้ไข */}
                </button>
                <button
                    onClick={onDelete}
                    className="text-red-500 hover:underline"
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default AdminCard;
