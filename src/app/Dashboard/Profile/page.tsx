import React, { useState } from "react";

const Profile: React.FC = () => {
  const [phone, setPhone] = useState<string>("123-456-7890"); // Default phone number
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to determine if editing
  const [showModal, setShowModal] = useState<boolean>(false); // State to show modal for confirmation

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSave = () => {
    setShowModal(true); // Show confirmation modal
  };

  const handleConfirmSave = () => {
    setIsEditing(false); // Turn off edit mode
    setShowModal(false); // Close modal
    // You can perform the save operation here, such as calling an API to update the number
  };

  const handleCancelSave = () => {
    setShowModal(false); // Close modal without saving
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">User Profile</h1>
        <div className="flex items-center space-x-4 mb-6">
          <img
            src="/images/Icons/Avatar.png"
            alt="Profile Picture"
            className="w-20 h-20 rounded-full"
          />
          <label htmlFor="file-input" className="text-blue-500 underline cursor-pointer">
            Change Photo
          </label>
          <input
            type="file"
            id="file-input"
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <p className="font-bold">Name:</p>
          <p>Juan Pérez</p>
        </div>
        <div>
          <p className="font-bold">Email:</p>
          <p>juan.perez@example.com</p>
        </div>
        <div className="mt-4">
          <label className="font-bold" htmlFor="phone">Phone Number:</label>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="border border-gray-300 rounded p-2 mt-2 w-full"
                />
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white p-2 rounded mt-2"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p>{phone}</p>
                <button
                  onClick={handleEdit}
                  className="text-blue-500 p-2"
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal for save confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Save</h2>
            <p className="mb-4">Are you sure you want to save the changes to your phone number?</p>
            <div className="flex justify-between">
              <button
                onClick={handleCancelSave}
                className="bg-gray-300 text-black p-2 rounded"
              >
                No
              </button>
              <button
                onClick={handleConfirmSave}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;