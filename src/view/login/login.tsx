import{ useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import type { LoginFormInputs } from "../../types/authTyping";
import  "./login.scss";
import { Link } from "react-router-dom";
import { useAuthForms } from "../../hooks/use-auth-forms";

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
    <div className="login-page--background">
      <main className="login-page">
        
        <section className="login-page__hero">
          <header className="login-page__header">
            <Link to="/">
              <img src="#" alt="Narime logo" className="login-page__logo"></img>
            </Link>
          </header>

          <div className="login-page__content">
            <h1 className="text-h1"> EVERY STORY MATTERS, YOURS TOO </h1>
            <p className="text-p"> Narime allows you to create smart lists, dynamic rankings, and personalized recommendations.</p>
          </div>
        </section>

        <section className="surface login-page__panel" aria-labelledby="login-title">
          <div>
            <h2 className="text-h2">Log In</h2>
            <p className="text-p text-color--75"> Sign in to keep tracking the progress of your favorite series.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="form__group">
              <label htmlFor="email" className="text-details">Email</label>
              <input
                id="email"
                className="text-p input"
                type="email"
                {...register('email', { 
                  required: 'This field is required', 
                })}
              ></input>
              {errors.email && <p className="form__error" role="alert">{errors.email.message}</p>}
            </div>
            
            <div className="form__group">
              <label htmlFor="password" className="text-details">Password</label>
              <input
                type='password'
                className="text-p input"
                id="password"
                {...register('password', { 
                  required: 'This field is required', 
                minLength: {value: 6, message: 'Password must be at least 6 characters'},
                pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must contain one uppercase letter and one number"}
              })}
              ></input>
              {errors.password && <p className="form__error" role="alert">{errors.password.message}</p>}
            </div>
            <Link to="" className="text-details login-page__forget-password">Forget your password?</Link>
            
            {isError && (<p className="form__error" role="alert">An error occurred while signing in</p>)}
            {isLoading && (<p aria-live="polite">Signing in...</p>)}

            <button disabled={isLoading} className="btn btn--big" type="submit">Sign in</button>
          </form>

          <div className="form__divider" aria-label="Alternative sign in methods">
            <div className="form__divider-line"></div>
            <p className="text-p text-color--50">or</p>
            <div className="form__divider-line"></div>
          </div>

          <button disabled={isLoading} className="btn btn--secondary btn--big" onClick={registerWithGoogle}>Sign in with Google</button>
          
          <Link to="/register" className="text-details form__singup">Don't have an account? Register here</Link>
        </section>

      </main>
    </div>
    </>
  );
};

export default LoginPage;
