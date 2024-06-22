import React from "react";
const Error403 =()=>{
    return(
        <div className="containern text-center">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-6">
            <h1 className="display-1">403</h1>
            <p className="lead">Forbidden - You don't have permission to access this page.</p>
            <a href="/" className="btn btn-primary">Go to Home</a>
          </div>
        </div>
      </div>
    );
}
export default Error403;