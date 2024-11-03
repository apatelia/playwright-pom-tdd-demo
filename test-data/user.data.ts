export const standardUser = {
  username: "standard_user",
  password: "secret_sauce"
};

export const validUsers = [
  standardUser,
  {
    username: "problem_user",
    password: "secret_sauce"
  },
  {
    username: "performance_glitch_user",
    password: "secret_sauce"
  }
];

export const invalidUsers = [
  {
    username: "invalid_username",
    password: "secret_sauce"
  },
  {
    username: "standard_user",
    password: "invalid_password"
  },
  {
    username: "invalid_username",
    password: "invalid_password"
  }
];

export const lockedOutUser = {
  username: "locked_out_user",
  password: "secret_sauce"
};
