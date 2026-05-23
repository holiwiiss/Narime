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
                required: 'Este campo es obligatorio', 
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
                required: 'Este campo es obligatorio', 
              minLength: {value: 6, message: 'La contraseña debe tener al  menos 6 carácteres'},
              pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Debe tener una mayúscula y un número"}
            })}
            ></input>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <p className="login-page__form-forget">Forget your password?</p>
          
          {isError && (<span>Ha ocurrido un error iniciando sesión</span>)}
          {isLoading && (<p>Iniciando sesion del usuario...</p>)}

          <button disabled={isLoading} className="btn btn--big" type="submit">Iniciar sesión</button>
        
        </form>

        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">o</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button disabled={isLoading} className="btn btn--secondary btn--big" onClick={registerWithGoogle}>Inicia sesión con google</button>
        
        <Link to="/register"> <p className="login-page__form-sing-up">You don't have account? Register here</p> </Link>
      </section>
    </main>
    </div>
    </>
  );
};

export default LoginPage;
