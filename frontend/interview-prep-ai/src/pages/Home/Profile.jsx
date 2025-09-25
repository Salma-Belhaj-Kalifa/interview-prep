import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { FiEdit, FiCamera } from "react-icons/fi";

const ProfilePage = () => {
  const { user, updateUser } = useContext(UserContext);
  const [hoverSave, setHoverSave] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    profileImageUrl: "",
  });
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!user) {
      const fetchProfile = async () => {
        try {
          const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
          updateUser(res.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            profileImageUrl: res.data.profileImageUrl || "",
          });
          setPreview(res.data.profileImageUrl || null);
        } catch (err) {
          console.error("Failed to fetch profile", err);
        }
      };
      fetchProfile();
    } else {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        profileImageUrl: user.profileImageUrl || "",
      });
      setPreview(user.profileImageUrl || null);
    }
  }, [user, updateUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = formData.profileImageUrl;

      if (selectedFile) {
        const formDataImg = new FormData();
        formDataImg.append("image", selectedFile);

        const resUpload = await axiosInstance.post(
          API_PATHS.IMAGE.UPLOAD_IMAGE,
          formDataImg,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = resUpload.data.imageUrl;
      }

      const resUpdate = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        ...formData,
        profileImageUrl: imageUrl,
      });

      const token = localStorage.getItem("token");
      updateUser({ ...resUpdate.data, token });
      localStorage.setItem("user", JSON.stringify(resUpdate.data));
      if (token) localStorage.setItem("token", token);

      alert("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto my-12 p-8 bg-white rounded-2xl shadow-xl relative transition-all duration-300">
        
        {/* Edit button */}
        <button
          onClick={() => setEditing(!editing)}
          className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition flex items-center justify-center shadow-sm"
          title="Edit Profile"
        >
          <FiEdit className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">My Profile</h2>

        {/* Profile image */}
        <div className="flex flex-col items-center mb-8 relative">
          <div className="relative">
            <img
              src={preview || "/default.jpeg"}
              alt="Profile"
              className="w-36 h-36 rounded-full object-cover border-4 border-indigo-500 shadow-md"
            />
            {editing && (
              <>
                <input
                  id="profileFileInput"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="profileFileInput"
                  className="absolute bottom-0 right-0 bg-indigo-500 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-indigo-600 transition"
                  title="Change Profile Image"
                >
                  <FiCamera className="w-5 h-5" />
                </label>
              </>
            )}
          </div>
        </div>

        {/* Form fields */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editing}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
                editing ? "bg-white" : "bg-gray-100 cursor-not-allowed"
              }`}
            />
          </div>
        </div>

        {/* Save/Cancel buttons */}
        {editing && (
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              onMouseEnter={() => setHoverSave(true)}
              onMouseLeave={() => setHoverSave(false)}
              className={`flex-1 py-3 font-semibold rounded-lg transition shadow-md ${
                hoverSave
                  ? "bg-orange-500 text-white"
                  : "bg-orange-200 text-orange-700"
              } hover:scale-105`}
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex-1 py-3 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 hover:scale-105 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
