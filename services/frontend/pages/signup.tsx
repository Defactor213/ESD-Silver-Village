import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';
import useInput from '../hooks/useInput';

const Form = styled.form`
  display: flex;
  flex-direction: column;

  padding: 20px;
`;

const Signup: React.FC = function () {
  const { data: authData, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (authData != null) {
      router.push('/');
    }
  }, [authData, authLoading, router]);

  const inputEmail = useInput();
  const inputUsername = useInput();
  const inputDisplayName = useInput();
  const inputPassword = useInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const resp = await fetch(`${process.env.API_ROOT}/signup`, {
      method: 'POST',
      body: new URLSearchParams({
        email: inputEmail.props.value,
        username: inputUsername.props.value,
        displayName: inputDisplayName.props.value,
        password: inputPassword.props.value,
      }),
      credentials: 'include',
    });

    const body = await resp.json();
    const status: string = body.status;

    switch (status) {
      case 'ok': {
        // Success
        await router.push('/');
        break;
      }
      default: {
        setErrorMessage(body.message);
        break;
      }
    }

    setLoading(false);
  };

  if (authData != null || authLoading) {
    return null;
  }

  return (
    <Layout>
      <Navbar />
      <div className="container">
        <Form method="post" action="/signup" onSubmit={handleSubmit}>
          <h1>Sign up</h1>

          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-control"
              type="email"
              name="email"
              placeholder="e.g. john@example.com"
              required
              {...inputEmail.props}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              className="form-control"
              type="text"
              name="username"
              required
              {...inputUsername.props}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="displayName" className="form-label">
              Display Name
            </label>
            <input
              id="displayName"
              className="form-control"
              type="text"
              name="displayName"
              placeholder="e.g. John Smith"
              required
              {...inputDisplayName.props}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              className="form-control"
              type="password"
              name="password"
              required
              {...inputPassword.props}
            />
          </div>
          {errorMessage != null && (
            <div className="text-danger">{errorMessage}</div>
          )}
          {!loading && (
            <button className="btn btn-primary" type="submit">
              Sign up
            </button>
          )}
        </Form>
      </div>
    </Layout>
  );
};

export default Signup;
