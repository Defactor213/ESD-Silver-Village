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

const Login: React.FC = function () {
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

  const inputUsername = useInput();
  const inputPassword = useInput();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage(null);

    const resp = await fetch(`${process.env.API_ROOT}/login`, {
      method: 'POST',
      body: new URLSearchParams({
        username: inputUsername.props.value,
        password: inputPassword.props.value,
      }),
      credentials: 'include',
    });

    if (resp.status === 403) {
      setErrorMessage('Invalid credentials');
      setLoading(false);
      return;
    }

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
        <Form method="post" action="/login" onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              id="username"
              className="form-control"
              name="username"
              type="text"
              placeholder="Username"
              required
              {...inputUsername.props}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              className="form-control"
              name="password"
              type="password"
              placeholder="Password"
              required
              {...inputPassword.props}
            />
          </div>

          {errorMessage != null && (
            <div className="text-danger">{errorMessage}</div>
          )}

          {!loading && (
            <button className="btn btn-primary" type="submit">
              Log in
            </button>
          )}
        </Form>
      </div>
    </Layout>
  );
};

export default Login;
