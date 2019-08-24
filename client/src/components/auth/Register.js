import React, { Fragment, useState } from 'react';
// import axios from 'axios';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types';

const Register = ({ setAlert }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  //  Destructring the formData into const
  const { name, email, password, password2 } = formData;

  //  Set the state

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //  On Click on Submit Action Handler
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
      console.log('Passwords do not match');
    } else {
      console.log(`success`);
      /* //  Prepare the body for the request by creating JSON Object as newUser
      const newUser = {
        name,
        email,
        password
      };
      try {
        //  Prepare header data for the request by adding content type as json
        const config = {
          headers: {
            'Content-type': 'application/json'
          }
        };
        //  prepare request using axios post method. Axios sends us a promise
        //  we can make use of the feature  await of async and avoid using .then
        //  and catch.
        const res = await axios.post('/users/register', newUser, config);
        console.log(res.data);
      } catch (error) {
        console.error(error.response.data);
      } */
    }
  };
  return (
    <Fragment>
      {' '}
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'>
        <i className='fas fa-user' /> Create Your Account
      </p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            required
            value={email}
            onChange={e => onChange(e)}
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            required
            value={password}
            onChange={e => onChange(e)}
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            minLength='6'
            required
            value={password2}
            onChange={e => onChange(e)}
          />
        </div>
        <input type='submit' className='btn btn-primary' value='Register' />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired
};
export default connect(
  null,
  { setAlert }
)(Register);
