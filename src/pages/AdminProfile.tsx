import {
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { Link } from "react-router-dom";

import "../styles/admin-profile.css";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function AdminProfile() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({
    name: "Mohamed",
    email: "mohamed@burgerizza.com",
    phone: "01012345678",
  });

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileImage, setProfileImage] = useState<string>("");

  const [showCurrentPassword, setShowCurrentPassword] =
    useState(false);

  const [showNewPassword, setShowNewPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [profileMessage, setProfileMessage] = useState("");

  const [passwordMessage, setPasswordMessage] = useState("");

  const handleProfileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setProfileForm((previousProfile) => ({
      ...previousProfile,
      [name]: value,
    }));
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setPasswordForm((previousPassword) => ({
      ...previousPassword,
      [name]: value,
    }));
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  const handleProfileSubmit = (event: FormEvent) => {
    event.preventDefault();

    console.log("Profile Data:", profileForm);

    setProfileMessage("Profile information updated successfully.");

    // PUT / PATCH API Request
  };

  const handlePasswordSubmit = (event: FormEvent) => {
    event.preventDefault();

    setPasswordMessage("");

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setPasswordMessage("Please complete all password fields.");

      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage(
        "New password must contain at least 6 characters."
      );

      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      setPasswordMessage("New passwords do not match.");

      return;
    }

    console.log("Password Data:", passwordForm);

    setPasswordMessage("Password changed successfully.");

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // PATCH Change Password API Request
  };

  return (
    <div className="admin-profile-page">

      <div className="container py-5">

        {/* PAGE HEADER */}

        <div className="profile-page-header mb-4">

          <div>

            <div className="profile-page-label mb-2">

              <i className="bi bi-person-gear me-2"></i>

              ACCOUNT MANAGEMENT

            </div>

            <h1 className="profile-page-title mb-2">
              Admin Profile
            </h1>

            <p className="text-muted mb-0">
              Manage your personal information and account security.
            </p>

          </div>

          <Link
            to="/"
            className="btn btn-light profile-back-button"
          >
            <i className="bi bi-arrow-left me-2"></i>

            Dashboard
          </Link>

        </div>


        <div className="row g-4">

          {/* LEFT SIDE */}

          <div className="col-lg-4">

            <div className="profile-card">

              <div className="profile-image-wrapper">

                {profileImage ? (

                  <img
                    src={profileImage}
                    alt={profileForm.name}
                    className="profile-image"
                  />

                ) : (

                  <div className="profile-avatar">

                    {profileForm.name
                      .charAt(0)
                      .toUpperCase()}

                  </div>

                )}

                <button
                  type="button"
                  className="profile-image-edit-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  title="Change profile image"
                >
                  <i className="bi bi-camera-fill"></i>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleImageChange}
                />

              </div>


              <h4 className="profile-name">
                {profileForm.name}
              </h4>

              <p className="profile-email">
                {profileForm.email}
              </p>


              <div className="profile-role-badge">

                <i className="bi bi-shield-check me-2"></i>

                Administrator

              </div>


              <div className="profile-divider"></div>


              <div className="profile-account-info">

                <div className="account-info-row">

                  <span>

                    <i className="bi bi-person-badge me-2"></i>

                    Role

                  </span>

                  <strong>Admin</strong>

                </div>


                <div className="account-info-row">

                  <span>

                    <i className="bi bi-check-circle me-2"></i>

                    Account Status

                  </span>

                  <strong className="active-account">
                    Active
                  </strong>

                </div>


                <div className="account-info-row">

                  <span>

                    <i className="bi bi-calendar3 me-2"></i>

                    Member Since

                  </span>

                  <strong>Dec 2025</strong>

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="col-lg-8">

            {/* PERSONAL INFORMATION */}

            <div className="profile-form-card mb-4">

              <div className="profile-section-header">

                <div className="profile-section-icon">

                  <i className="bi bi-person"></i>

                </div>

                <div>

                  <h5 className="mb-1">
                    Personal Information
                  </h5>

                  <p className="text-muted mb-0">
                    Update your account details and contact information.
                  </p>

                </div>

              </div>


              {profileMessage && (

                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>

                  {profileMessage}
                </div>

              )}


              <form onSubmit={handleProfileSubmit}>

                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label">
                      Full Name
                    </label>

                    <div className="profile-input-wrapper">

                      <i className="bi bi-person"></i>

                      <input
                        type="text"
                        name="name"
                        className="form-control profile-input"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        required
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label">
                      Email Address
                    </label>

                    <div className="profile-input-wrapper">

                      <i className="bi bi-envelope"></i>

                      <input
                        type="email"
                        name="email"
                        className="form-control profile-input"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        required
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label">
                      Phone Number
                    </label>

                    <div className="profile-input-wrapper">

                      <i className="bi bi-telephone"></i>

                      <input
                        type="tel"
                        name="phone"
                        className="form-control profile-input"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label">
                      Account Role
                    </label>

                    <div className="profile-input-wrapper disabled-input">

                      <i className="bi bi-shield-lock"></i>

                      <input
                        type="text"
                        className="form-control profile-input"
                        value="Administrator"
                        disabled
                      />

                    </div>

                  </div>

                </div>


                <div className="profile-form-actions">

                  <button
                    type="submit"
                    className="btn profile-save-button"
                  >
                    <i className="bi bi-check-lg me-2"></i>

                    Save Changes
                  </button>

                </div>

              </form>

            </div>


            {/* SECURITY */}

            <div className="profile-form-card">

              <div className="profile-section-header">

                <div className="profile-section-icon">

                  <i className="bi bi-shield-lock"></i>

                </div>

                <div>

                  <h5 className="mb-1">
                    Password & Security
                  </h5>

                  <p className="text-muted mb-0">
                    Change your password to keep your account secure.
                  </p>

                </div>

              </div>


              {passwordMessage && (

                <div
                  className={`alert ${
                    passwordMessage.includes("successfully")
                      ? "alert-success"
                      : "alert-danger"
                  }`}
                >
                  {passwordMessage}
                </div>

              )}


              <form onSubmit={handlePasswordSubmit}>

                <div className="mb-4">

                  <label className="form-label">
                    Current Password
                  </label>

                  <div className="password-input-wrapper">

                    <i className="bi bi-lock"></i>

                    <input
                      type={
                        showCurrentPassword
                          ? "text"
                          : "password"
                      }
                      name="currentPassword"
                      className="form-control profile-input"
                      placeholder="Enter current password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                    />

                    <button
                      type="button"
                      className="password-toggle-button"
                      onClick={() =>
                        setShowCurrentPassword(
                          (previous) => !previous
                        )
                      }
                    >
                      <i
                        className={`bi ${
                          showCurrentPassword
                            ? "bi-eye-slash"
                            : "bi-eye"
                        }`}
                      ></i>
                    </button>

                  </div>

                </div>


                <div className="row g-4">

                  <div className="col-md-6">

                    <label className="form-label">
                      New Password
                    </label>

                    <div className="password-input-wrapper">

                      <i className="bi bi-key"></i>

                      <input
                        type={
                          showNewPassword
                            ? "text"
                            : "password"
                        }
                        name="newPassword"
                        className="form-control profile-input"
                        placeholder="Enter new password"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                      />

                      <button
                        type="button"
                        className="password-toggle-button"
                        onClick={() =>
                          setShowNewPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        <i
                          className={`bi ${
                            showNewPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>

                    </div>

                  </div>


                  <div className="col-md-6">

                    <label className="form-label">
                      Confirm New Password
                    </label>

                    <div className="password-input-wrapper">

                      <i className="bi bi-key-fill"></i>

                      <input
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        className="form-control profile-input"
                        placeholder="Confirm new password"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                      />

                      <button
                        type="button"
                        className="password-toggle-button"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                      >
                        <i
                          className={`bi ${
                            showConfirmPassword
                              ? "bi-eye-slash"
                              : "bi-eye"
                          }`}
                        ></i>
                      </button>

                    </div>

                  </div>

                </div>


                <div className="password-hint">

                  <i className="bi bi-info-circle"></i>

                  Password must contain at least 6 characters.

                </div>


                <div className="profile-form-actions">

                  <button
                    type="submit"
                    className="btn change-password-button"
                  >
                    <i className="bi bi-shield-check me-2"></i>

                    Change Password
                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminProfile;