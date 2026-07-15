import '../stylesheets/ProfileSettingsModal.css'
import { useState } from 'react';
import { useAuthContext } from '../hook/useAuthContext';
import { updateProfile, updatePassword } from '../api/profileSettings';

function ProfileSettingsModal({ onClose }) {
    const { user, dispatch } = useAuthContext();
    const isAdmin = user?.role === 'admin';

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [message, setMessage] = useState(null); 
    const [isSaving, setIsSaving] = useState(false);

    const handleCancel = () => {
        setMessage(null);
        onClose();
    };

    const handleSaveChanges = async () => {
        setMessage(null);

        const wantsProfileUpdate = firstName.trim() || lastName.trim() || email.trim();
        const wantsPasswordUpdate = currentPassword || newPassword || confirmNewPassword;

        if (!wantsProfileUpdate && !wantsPasswordUpdate) {
            setMessage({ type: 'error', text: 'No changes to save.' });
            return;
        }

        try {
            setIsSaving(true);

            if (wantsProfileUpdate) {
                const updates = {};
                if (firstName.trim()) updates.firstName = firstName.trim();
                if (lastName.trim()) updates.lastName = lastName.trim();
                if (email.trim()) updates.email = email.trim();

                const updatedUser = await updateProfile(user._id, updates, user.token);

                
                dispatch({ type: 'UPDATE_USER', payload: updatedUser });
            }

            if (wantsPasswordUpdate) {
                if (!currentPassword) {
                    throw new Error('Enter your current password.');
                }
                if (!newPassword || !confirmNewPassword) {
                    throw new Error('Fill in both new password fields.');
                }
                if (newPassword !== confirmNewPassword) {
                    throw new Error('New passwords do not match.');
                }

                await updatePassword(user._id, { currentPassword, newPassword }, user.token);
            }

            setMessage({ type: 'success', text: 'Changes saved successfully.' });
            setFirstName('');
            setLastName('');
            setEmail('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div id="modal-wrap">
        <div id="grey-overlay"></div>
      <section id="settings-modal">
        <section id="modal-header">
          Settings
          <svg onClick={handleCancel} className="clickable" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="#727687" />
          </svg>
        </section>

        <section id="modal-main">
          <section id="personal-info">
            <div id="personal-info-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#0050CB" />
              </svg>
              Personal Information
            </div>
            <section id="personal-info-content">
              {!isAdmin && (
                <section id="profile-picture-container">
                  <div id="image-container"></div>
                  <div id="profile-photo-settings">
                    <div style={{color: '#424656', fontFamily: 'Montserrat', fontSize: '14px', fontWeight: '500', lineHeight: '20px', letterSpacing: '0.14px' }}>
                      Profile Photo
                    </div>
                    <div style={{color: '#727687', fontFamily: 'Montserrat', fontSize: '16px', fontWeight: '400', lineHeight: '24px'}}>
                      Accepts PNG, JPG under 5MB
                    </div>
                    <div id="upload-new-button">Upload New</div>
                  </div>
                </section>
              )}

              <section id="name-input-row">
                <section className="personal-info-input">
                  First Name
                  <div className="info-container">
                    <input
                      type="text"
                      placeholder={user?.firstName || 'First Name'}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </section>
                <section className="personal-info-input">
                  Last Name
                  <div className="info-container">
                    <input
                      type="text"
                      placeholder={user?.lastName || 'Last Name'}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </section>
              </section>

              <section className="personal-info-input">Email Address
                <div className="info-container">
                  <input
                    type="text"
                    placeholder={user?.email || 'Email Address'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </section>
            </section>
          </section>

          <div id="separator"></div>

          <section id="security">
            <div id="security-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                <path d="M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.73333 17.35 11.1667 16.25 12.3 14.6C13.4333 12.95 14 11.1167 14 9.1V4.375L8 2.125L2 4.375V9.1C2 11.1167 2.56667 12.95 3.7 14.6C4.83333 16.25 6.26667 17.35 8 17.9Z" fill="#0050CB" />
              </svg>
              Security
            </div>
            <section id="security-content">
              <section className="password-contanier">
                Current Password
                <section className="password-container-legit">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <svg
                    className="reveal-password clickable"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none"
                  >
                    <path d="M9.16667 10C10.2083 10 11.0938 9.63542 11.8229 8.90625C12.5521 8.17708 12.9167 7.29167 12.9167 6.25C12.9167 5.20833 12.5521 4.32292 11.8229 3.59375C11.0938 2.86458 10.2083 2.5 9.16667 2.5C8.125 2.5 7.23958 2.86458 6.51042 3.59375C5.78125 4.32292 5.41667 5.20833 5.41667 6.25C5.41667 7.29167 5.78125 8.17708 6.51042 8.90625C7.23958 9.63542 8.125 10 9.16667 10ZM9.16667 8.5C8.54167 8.5 8.01042 8.28125 7.57292 7.84375C7.13542 7.40625 6.91667 6.875 6.91667 6.25C6.91667 5.625 7.13542 5.09375 7.57292 4.65625C8.01042 4.21875 8.54167 4 9.16667 4C9.79167 4 10.3229 4.21875 10.7604 4.65625C11.1979 5.09375 11.4167 5.625 11.4167 6.25C11.4167 6.875 11.1979 7.40625 10.7604 7.84375C10.3229 8.28125 9.79167 8.5 9.16667 8.5ZM9.16667 12.5C7.13889 12.5 5.29167 11.934 3.625 10.8021C1.95833 9.67014 0.75 8.15278 0 6.25C0.75 4.34722 1.95833 2.82986 3.625 1.69792C5.29167 0.565972 7.13889 0 9.16667 0C11.1944 0 13.0417 0.565972 14.7083 1.69792C16.375 2.82986 17.5833 4.34722 18.3333 6.25C17.5833 8.15278 16.375 9.67014 14.7083 10.8021C13.0417 11.934 11.1944 12.5 9.16667 12.5ZM9.16667 10.8333C10.7361 10.8333 12.1771 10.4201 13.4896 9.59375C14.8021 8.76736 15.8056 7.65278 16.5 6.25C15.8056 4.84722 14.8021 3.73264 13.4896 2.90625C12.1771 2.07986 10.7361 1.66667 9.16667 1.66667C7.59722 1.66667 6.15625 2.07986 4.84375 2.90625C3.53125 3.73264 2.52778 4.84722 1.83333 6.25C2.52778 7.65278 3.53125 8.76736 4.84375 9.59375C6.15625 10.4201 7.59722 10.8333 9.16667 10.8333Z" fill="#C2C6D8" />
                  </svg>
                </section>
              </section>
              <section id="old-new-password">
                <section className="password-contanier">
                  New Password
                  <section className="password-container-legit">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <svg
                      className="reveal-password clickable"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none"
                    >
                      <path d="M9.16667 10C10.2083 10 11.0938 9.63542 11.8229 8.90625C12.5521 8.17708 12.9167 7.29167 12.9167 6.25C12.9167 5.20833 12.5521 4.32292 11.8229 3.59375C11.0938 2.86458 10.2083 2.5 9.16667 2.5C8.125 2.5 7.23958 2.86458 6.51042 3.59375C5.78125 4.32292 5.41667 5.20833 5.41667 6.25C5.41667 7.29167 5.78125 8.17708 6.51042 8.90625C7.23958 9.63542 8.125 10 9.16667 10ZM9.16667 8.5C8.54167 8.5 8.01042 8.28125 7.57292 7.84375C7.13542 7.40625 6.91667 6.875 6.91667 6.25C6.91667 5.625 7.13542 5.09375 7.57292 4.65625C8.01042 4.21875 8.54167 4 9.16667 4C9.79167 4 10.3229 4.21875 10.7604 4.65625C11.1979 5.09375 11.4167 5.625 11.4167 6.25C11.4167 6.875 11.1979 7.40625 10.7604 7.84375C10.3229 8.28125 9.79167 8.5 9.16667 8.5ZM9.16667 12.5C7.13889 12.5 5.29167 11.934 3.625 10.8021C1.95833 9.67014 0.75 8.15278 0 6.25C0.75 4.34722 1.95833 2.82986 3.625 1.69792C5.29167 0.565972 7.13889 0 9.16667 0C11.1944 0 13.0417 0.565972 14.7083 1.69792C16.375 2.82986 17.5833 4.34722 18.3333 6.25C17.5833 8.15278 16.375 9.67014 14.7083 10.8021C13.0417 11.934 11.1944 12.5 9.16667 12.5ZM9.16667 10.8333C10.7361 10.8333 12.1771 10.4201 13.4896 9.59375C14.8021 8.76736 15.8056 7.65278 16.5 6.25C15.8056 4.84722 14.8021 3.73264 13.4896 2.90625C12.1771 2.07986 10.7361 1.66667 9.16667 1.66667C7.59722 1.66667 6.15625 2.07986 4.84375 2.90625C3.53125 3.73264 2.52778 4.84722 1.83333 6.25C2.52778 7.65278 3.53125 8.76736 4.84375 9.59375C6.15625 10.4201 7.59722 10.8333 9.16667 10.8333Z" fill="#C2C6D8" />
                    </svg>
                  </section>
                </section>
                <section className="password-contanier">
                  Confirm New Password
                  <section className="password-container-legit">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <svg
                      className="reveal-password clickable"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      xmlns="http://www.w3.org/2000/svg" width="19" height="13" viewBox="0 0 19 13" fill="none"
                    >
                      <path d="M9.16667 10C10.2083 10 11.0938 9.63542 11.8229 8.90625C12.5521 8.17708 12.9167 7.29167 12.9167 6.25C12.9167 5.20833 12.5521 4.32292 11.8229 3.59375C11.0938 2.86458 10.2083 2.5 9.16667 2.5C8.125 2.5 7.23958 2.86458 6.51042 3.59375C5.78125 4.32292 5.41667 5.20833 5.41667 6.25C5.41667 7.29167 5.78125 8.17708 6.51042 8.90625C7.23958 9.63542 8.125 10 9.16667 10ZM9.16667 8.5C8.54167 8.5 8.01042 8.28125 7.57292 7.84375C7.13542 7.40625 6.91667 6.875 6.91667 6.25C6.91667 5.625 7.13542 5.09375 7.57292 4.65625C8.01042 4.21875 8.54167 4 9.16667 4C9.79167 4 10.3229 4.21875 10.7604 4.65625C11.1979 5.09375 11.4167 5.625 11.4167 6.25C11.4167 6.875 11.1979 7.40625 10.7604 7.84375C10.3229 8.28125 9.79167 8.5 9.16667 8.5ZM9.16667 12.5C7.13889 12.5 5.29167 11.934 3.625 10.8021C1.95833 9.67014 0.75 8.15278 0 6.25C0.75 4.34722 1.95833 2.82986 3.625 1.69792C5.29167 0.565972 7.13889 0 9.16667 0C11.1944 0 13.0417 0.565972 14.7083 1.69792C16.375 2.82986 17.5833 4.34722 18.3333 6.25C17.5833 8.15278 16.375 9.67014 14.7083 10.8021C13.0417 11.934 11.1944 12.5 9.16667 12.5ZM9.16667 10.8333C10.7361 10.8333 12.1771 10.4201 13.4896 9.59375C14.8021 8.76736 15.8056 7.65278 16.5 6.25C15.8056 4.84722 14.8021 3.73264 13.4896 2.90625C12.1771 2.07986 10.7361 1.66667 9.16667 1.66667C7.59722 1.66667 6.15625 2.07986 4.84375 2.90625C3.53125 3.73264 2.52778 4.84722 1.83333 6.25C2.52778 7.65278 3.53125 8.76736 4.84375 9.59375C6.15625 10.4201 7.59722 10.8333 9.16667 10.8333Z" fill="#C2C6D8" />
                    </svg>
                  </section>
                </section>
              </section>
            </section>
          </section>
        </section>

        <section id="modal-footer">
          {message && (
            <div className={`footer-message ${message.type}`}>
              {message.text}
            </div>
          )}
          <div className="footer-actions">
            <section className="clickable" id="cancel-button" onClick={handleCancel}>Cancel</section>
            <section
              className="clickable"
              id="save-changes-button"
              onClick={isSaving ? undefined : handleSaveChanges}
              style={{ opacity: isSaving ? 0.7 : 1, pointerEvents: isSaving ? 'none' : 'auto' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M18 4V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H14L18 4ZM9 15C9.83333 15 10.5417 14.7083 11.125 14.125C11.7083 13.5417 12 12.8333 12 12C12 11.1667 11.7083 10.4583 11.125 9.875C10.5417 9.29167 9.83333 9 9 9C8.16667 9 7.45833 9.29167 6.875 9.875C6.29167 10.4583 6 11.1667 6 12C6 12.8333 6.29167 13.5417 6.875 14.125C7.45833 14.7083 8.16667 15 9 15ZM3 7H12V3H3V7Z" fill="#633700" />
              </svg>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </section>
          </div>
        </section>
      </section>
</div>
    );
}

export default ProfileSettingsModal;