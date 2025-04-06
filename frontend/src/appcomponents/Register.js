import { useState } from 'react';
import axios from 'axios';
import styles from './Register.module.css';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';




const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
      toast.success(res.data.message);
      navigate('/login');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className={styles.regContainer}>
      <form onSubmit={handleSubmit} className={styles.regForm}>
        <h2 className={styles.regTitle}>Register</h2>
      <input name="username" placeholder="Username"  onChange={handleChange} value={formData.username} className={styles.regin}/>
      <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} className={styles.regin}/>
      <input name="password" type="password" placeholder="Password" onChange={handleChange} value={formData.password} className={styles.regin}/>
      <button type="submit" className={styles.regbutton}>Register</button>
    </form>
    <p style={{ marginTop: '1rem', textAlign: 'center' }}>
    Already have an account? <Link to="/login">Login here</Link>
  </p>
    </div>
    
  );
};

export default Register;
