import jwtDecode from "jwt-decode";

export const checkExpirity = (token) => {
  const { exp } = jwtDecode(token);

  if (exp * 1000 > new Date().getTime()) {
    return {
      expiry: new Date(exp * 1000),
    };
  } else {
    return { error: "Token expired" };
  }
};

export const getProfile = (token) => {
  const { email, username, fullName } = jwtDecode(token);

  return { email, username, fullName };
};
