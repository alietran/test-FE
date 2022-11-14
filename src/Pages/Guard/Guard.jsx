import React from 'react'
import { Navigate, Outlet } from 'react-router';

export default function Guard() {
      const token = JSON.parse(localStorage.getItem("token"));
    //   console.log(token);
      if (!token) {
        return <Navigate to={"/login"} />;
      }
  return (
    <div style={{ backgroundColor: "#eff1f8", height: "100%" }}>
      <Outlet />
    </div>
  );
}
