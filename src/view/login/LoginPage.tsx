import{ useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import type { LoginFormInputs } from "../../types/authTyping";
import  "./login-page.scss";
import { Link } from "react-router-dom";
import { useAuthForms } from "../../hooks/useAuthForms";

const LoginPage = () => {

  const { logInWithEmail, registerWithGoogle, isLoading, isError } = useAuthForms()
  
  const{
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    logInWithEmail(data.email, data.password)
  }

  return (
    <>
    <div className="bg-img-login">
    <main className="login-page">
      <section className="login-page__info">

        <header className="login-page__header">
          <img src="#" alt="Narime logo" className="login-page__logo"></img>
        </header>

        <div className="login-page__text">
          <h1 className="login-page__title"> EVERY STORY MATTERS, YOURS TOO </h1>

          <p className="login-page__description"> Narime allows you to create smart lists, dynamic rankings, and personalized recommendations.</p>
        </div>

      </section>

      <section className="login-page__form-section">
        <div className="login-page__form-section-text">
          <h2 className="login-page__subtitle">Log In</h2>
          <p className="login-page__subtitle-text"> Sign in to keep tracking the progress of your favorite series.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">

          <div className="login-page__form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { 
                required: 'This field is required', 
              })}
            ></input>
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          
          <div className="login-page__form-field">
            <label htmlFor="password">Password</label>
            <input
              type='password'
              id="password"
              {...register('password', { 
                required: 'This field is required', 
              minLength: {value: 6, message: 'Password must be at least 6 characters'},
              pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must contain one uppercase letter and one number"}
            })}
            ></input>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <p className="login-page__form-forget">Forget your password?</p>
          
          {isError && (<span>An error occurred while signing in</span>)}
          {isLoading && (<p>Signing in...</p>)}

          <button disabled={isLoading} className="btn btn--big" type="submit">Sign in</button>
        
        </form>

        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">or</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button disabled={isLoading} className="btn btn--secondary btn--big" onClick={registerWithGoogle}>Sign in with Google</button>
        
        <Link to="/register"> <p className="login-page__form-sing-up">Don't have an account? Register here</p> </Link>
      </section>
    </main>
    </div>
    </>
  );
};

export default LoginPage;
