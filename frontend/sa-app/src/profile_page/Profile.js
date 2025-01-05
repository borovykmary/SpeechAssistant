import React, { useState } from "react";
import "./Profile.css";
import profileIcon from "./assets/profile-icon.png";
import logo from "./assets/logo.png";
import wave from "./assets/yellow-wave.png";

const Profile = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState("seproject");
    const [email, setEmail] = useState("seproject@gmail.com");

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
    };

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value);

    return (
        <div className="app-container">
            <div className="header-container">
                <img src={wave} alt="yellow-wave" className="yellow-wave" />
                <img src={logo} alt="Logo" className="logo" />
            </div>
            {!isEditing ? (
                <div className="profile-view">
                    <img src={profileIcon} alt="Profile" className="profile-icon" />
                    <h1>Profile</h1>
                    <div className="profile-info">
                        <p><strong>Username:</strong> {username}</p>
                        <p><strong>Email:</strong> {email}</p>
                    </div>
                    <button className="edit-button" onClick={handleEditClick}>
                        Edit Profile
                    </button>
                </div>
            ) : (
                <div className="edit-profile-view">
                    <h1>Edit Profile</h1>
                    <div className="edit-form">
                        <label>
                            Username
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </label>
                        <button className="save-button" onClick={handleSave}>
                            Update
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
