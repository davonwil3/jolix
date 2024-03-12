import React from "react";
import "./styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'

function SignUp() {
  return (
    <div>
      <div className="authentication-page">
        <div className="authentication-container">
          <div className="authentication-image"></div>
          <div className="authentication-form-container">
            
            <form className="authentication-form">
              <h1>Sign Up to jolix </h1>
              <p>Create an account below</p>
              <div className="form-group" >
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
                <button type="submit">Sign Up</button>
              </div>
              <div className="authentication-alt-signin">
                <p>Or sign up using</p>
                <button type="submit"><FontAwesomeIcon icon={faFacebookF} style={{marginRight: '10px'}}/>Sign up with Facebook</button>
                <button type="submit" style={{backgroundColor:"white", color: "black", border:"1px solid black", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src="/assets/googleicon.jpeg" alt="" style={{width: '20px', height: '19px', marginRight: '10px'}}/>
                  Sign up with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
