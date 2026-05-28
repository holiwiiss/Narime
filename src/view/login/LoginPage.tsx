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
          <h1 className="text-h1"> EVERY STORY MATTERS, YOURS TOO </h1>

          <p className="text-p"> Narime allows you to create smart lists, dynamic rankings, and personalized recommendations.</p>
        </div>

      </section>

      <section className="surface login-page__form-section">
        <div className="login-page__form-section-text">
          <h2 className="text-h2">Log In</h2>
          <p className="text-p text-color--75"> Sign in to keep tracking the progress of your favorite series.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">

          <div className="form__group">
            <label htmlFor="email" className="text-details">Email</label>
            <input
              id="email"
              className="text-p"
              type="email"
              {...register('email', { 
                required: 'This field is required', 
              })}
            ></input>
            {errors.email && <span className="form__error">{errors.email.message}</span>}
          </div>
          
          <div className="form__group">
            <label htmlFor="password" className="text-details">Password</label>
            <input
              type='password'
              className="text-p"
              id="password"
              {...register('password', { 
                required: 'This field is required', 
              minLength: {value: 6, message: 'Password must be at least 6 characters'},
              pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Must contain one uppercase letter and one number"}
            })}
            ></input>
            {errors.password && <span className="form__error">{errors.password.message}</span>}
          </div>
          <p className="text-details login-page__form-forget">Forget your password?</p>
          
          {isError && (<span className="form__error">An error occurred while signing in</span>)}
          {isLoading && (<p>Signing in...</p>)}

          <button disabled={isLoading} className="btn btn--big" type="submit">Sign in</button>
        
        </form>

        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="text-p text-color--50">or</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button disabled={isLoading} className="btn btn--secondary btn--big" onClick={registerWithGoogle}>Sign in with Google</button>
        
        <Link to="/register"> <p className="text-details login-page__form-sing-up">Don't have an account? Register here</p> </Link>
      </section>
    </main>
    </div>
    </>
  );
};

export default LoginPage;
