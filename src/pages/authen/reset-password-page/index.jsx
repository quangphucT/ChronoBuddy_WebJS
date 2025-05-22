import './index.scss';

const ResetPasswordPage = () => {
  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h1 className="main-title">Change your password</h1>
        <p className="description">
          Create your new password at least 6 characters
        </p>
        <form className="reset-password-form">
          <input
            type="password"
            placeholder="New password"
            className="password-input"
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="password-input"
            required
          />
          <button type="submit" className="change-button">
            Change!
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;