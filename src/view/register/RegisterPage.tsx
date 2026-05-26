import { useForm} from "react-hook-form"
import type { SubmitHandler } from "react-hook-form";
import type { RegisterFormInputs } from "../../types/authTyping";
import "./register.scss";
import { Link} from "react-router-dom";
import { useAuthForms } from "../../hooks/useAuthForms";

const RegisterPage = () => {
  
  const { registerWithEmail, registerWithGoogle, isLoading, isError } = useAuthForms()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {   
    registerWithEmail(data.email, data.password, data.username)
  }

  return (
    <>
    <main className="register-page">
      <section className="register-page__form-section">
        <div className="register-page__form-section-text">
          <h1 className="register-page__tittle">Start now</h1>
          <p>Don't miss the ultimate anime and series content management.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="register-page__form">

          <div className="register-page__form-field">
            <label htmlFor="username">Username*</label>
            <input
              id="username"
              type="text"
              {...register("username", { 
                  required: 'Username is required', 
                  maxLength:{value:20, message:'Maximum 20 characters'},
                  minLength:{value:3, message:'Minimum 3 characters'}
              })}
            ></input>
            {errors.username && <span>{errors.username.message}</span>}
          </div>

          <div className="register-page__form-field">
            <label htmlFor="email">Email*</label>
            <input
              id="email"
              type='email'
              {...register('email', { 
                  required: 'This field is required', 
              })}
            ></input>
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="register-page__form-field">
            <label htmlFor="password">Password*</label>
            <input
              id="password"
              type='password'
              {...register('password', { 
                required: 'This field is required', 
                minLength: {value: 6, message: 'Password must be at least 6 characters'},
                pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must contain one uppercase letter and one number"}
              })}
            ></input>
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="register-page__form-field">
            <label htmlFor="confirmPassword">Confirm password*</label>
            <input
              id="confirmPassword"
              type='password'
              {...register('passwordConfirm', { 
                  required: 'This field is required', 
                  validate: (value) =>
                  value === passwordValue || 'Passwords do not match',
              })}
            ></input>
            {errors.passwordConfirm && (<span>{errors.passwordConfirm.message}</span>)}  
          </div>

          <div className="register-page__form-field">
            <label>
              <input
                id="terms"
                type="checkbox"
                {...register("confirmTerms", { required:'This field is required'})}
              ></input>
              I have read and accept the terms and conditions
            </label>
            {errors.confirmTerms && (<span>{errors.confirmTerms.message}</span>)}  
          </div>
          {isError && (<span>An error occurred while creating the account</span>)}
          {isLoading && (<p>Creating account...</p>)}
          <button disabled={isLoading} className="btn btn--big" type="submit">Sign up</button>
        </form>
        
        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">or</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button disabled={isLoading} className="btn btn--secondary btn--big"  onClick={registerWithGoogle}>Continue with Google</button>
        <Link to="/login"><p className="login-page__form-sing-up">Already have an account? Sign in here</p></Link>
      </section>
    </main>
    </>
  );
};

export default RegisterPage;
