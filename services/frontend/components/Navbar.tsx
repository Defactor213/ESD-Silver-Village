import React from 'react';
import styled from 'styled-components';

import useAuth from '../hooks/useAuth';
import Link from './NavLink';

const Navbar: React.FC = function (props) {
  const { data, loading } = useAuth();

  return (
    <div className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" href="/">
          Silver Village
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-md-0">
            <li className="nav-item text-uppercase fw-bold">
              <Link href="/">Watch now</Link>
            </li>
            <li className="nav-item text-uppercase fw-bold">
              <Link href="/cinemas">Cinemas</Link>
            </li>
            <li className="nav-item text-uppercase fw-bold">
              <Link href="/experiences">Experiences</Link>
            </li>
            <li className="nav-item text-uppercase fw-bold">
              <Link href="/deals">Deals</Link>
            </li>
          </ul>
          <ul className="navbar-nav mb-2 mb-md-0">
            {data != null && !loading && (
              <span className="text-white">Welcome, {data.display_name}</span>
            )}
            {data == null && !loading && (
              <>
                <li className="nav-item">
                  <Link href="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link href="/signup">Sign up</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
