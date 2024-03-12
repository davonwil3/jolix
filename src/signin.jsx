import React from "react";
import "./styles.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookF } from '@fortawesome/free-brands-svg-icons'

function SignIn() {
  return (
    <div>
      <div className="authentication-page">
        <div className="authentication-container">
          <div className="authentication-image"></div>
          <div className="authentication-form-container">
            <div className="create-account-ask">
              <p>Dont have an account?</p>
              <button>Create an account</button> 
            </div>
            
            <form className="authentication-form">
              <h1>Sign in to jolix </h1>
              <p>Enter your details below</p>
              <div className="form-group" >
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
                <button type="submit">Sign In</button>
              </div>
              <div className="authentication-alt-signin">
                <p>Or sign in using</p>
                <button type="submit"><FontAwesomeIcon icon={faFacebookF} style={{marginRight: '10px'}}/>Sign in with Facebook</button>
                <button type="submit" style={{backgroundColor:"white", color: "black", border:"1px solid black", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <img src="/assets/googleicon.jpeg" alt="" style={{width: '20px', height: '19px', marginRight: '10px'}}/>
                  Sign in with Google
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
