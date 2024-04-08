import { baseURL } from "$lib/api";

export const login = async (email: string, password: string) => {
  let response: Response;

  try {
    response = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: email, password }),
    });
  } catch (error) {
    return { loggedIn: false, error };
  }

  return { loggedIn: response.ok, response };
};

export const logout = async () => {
  let response: Response;

  try {
    response = await fetch(`${baseURL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    return { loggedOut: false, error };
  }

  return { loggedOut: response.ok, response };
};

export const register = async (
  email: string,
  name: string,
  password: string,
) => {
  let response: Response;

  try {
    response = await fetch(`${baseURL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, name, password }),
    });
  } catch (error) {
    return { registered: false, error };
  }

  return { registered: response.ok, response };
};

export const me = async (customFetch = fetch) => {
  let response: Response;

  try {
    response = await customFetch(`${baseURL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });
  } catch (error) {
    return { authenticated: false, error };
  }

  return { authenticated: response.ok, response };
};
