import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',  // Add confirmPassword field
    roles: ['member'],  // Default role
  });
  const [passwordMatch, setPasswordMatch] = useState(true);  // State to track password match
  const [acceptTerms, setAcceptTerms] = useState(false); // State for terms acceptance

  const { firstName, lastName, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Update passwordMatch state
    if (name === 'password' || name === 'confirmPassword') {
      setPasswordMatch(formData.password === value || formData.confirmPassword === value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (!passwordMatch || password !== confirmPassword) {
      alert('הסיסמאות אינן תואמות');
      return;
    }

    // Check if terms are accepted
    if (!acceptTerms) {
      alert('עליך להסכים לתנאי השימוש כדי להירשם');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName, email, password, roles: ['member'] }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('המשתמש נרשם בהצלחה');
        console.log('User signed up:', data);
        navigate('/login');
      } else {
        alert(`Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      alert('Sign-up failed.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title text-center mb-4">הרשמה</h3>
              <form onSubmit={handleSubmit}>

                {/* First Name Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    name="firstName"
                    placeholder="שם פרטי"
                    value={firstName}
                    onChange={handleChange}
                    required
                    dir="rtl"
                  />
                  <label htmlFor="firstName" style={{ right: 0, left: 'auto'}}>שם פרטי</label>
                </div>

                {/* Last Name Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    name="lastName"
                    placeholder="שם משפחה"
                    value={lastName}
                    onChange={handleChange}
                    required
                    dir="rtl"
                  />
                  <label htmlFor="lastName" style={{ right: 0, left: 'auto'}}>שם משפחה</label>
                </div>

                {/* Email Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    placeholder="כתובת מייל"
                    value={email}
                    onChange={handleChange}
                    required
                   
                  />
                  <label htmlFor="email" style={{ right: 0, left: 'auto'}}>כתובת מייל</label>
                </div>

                {/* Password Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className={`form-control ${!passwordMatch ? 'is-invalid' : ''}`}
                    id="password"
                    name="password"
                    placeholder="סיסמא"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    
                  />
                  <label htmlFor="password" style={{ right: 0, left: 'auto'}}>סיסמא</label>
                  {!passwordMatch && <div className="invalid-feedback">הסיסמאות אינן תואמות</div>}
                </div>

                {/* Confirm Password Field */}
                <div className="form-floating mb-3 text-end">
                  <input
                    type="password"
                    className={`form-control ${!passwordMatch ? 'is-invalid' : ''}`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="אשר סיסמא"
                    value={confirmPassword}
                    onChange={handlePasswordChange}
                    required
                   
                  />
                  <label htmlFor="confirmPassword" style={{ right: 0, left: 'auto'}}>אשר סיסמא</label>
                </div>

                {/* Accept Terms Checkbox */}
                <div className="form-group mb-3 text-end">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={acceptTerms}
                    onChange={() => setAcceptTerms(!acceptTerms)}
                   
                  />
                  <label htmlFor="acceptTerms" className="ms-2">
                    אני מסכים ל<a href="/terms" target="_blank">תנאי השימוש</a>
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-block">הירשמו</button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;