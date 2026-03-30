export interface LoginFormInputs {
  email: string;
  password: string;
}

export interface RegisterFormInputs {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  confirmTerms: boolean;
}