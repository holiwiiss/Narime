import { loginFirebase, loginWithGoogle} from "../../firebase/services/authService";
import{ useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { sileo } from "sileo";
import type { LoginFormInputs } from "../../types/authTyping";
import  "./login-page.scss";

const LoginPage = () => {

  const{
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    await validateFirebase(data.email, data.password)
  }

  const validateFirebase = async (email:string, password:string) => {
    const { user, error } = await loginFirebase(email, password);
      if(error){
        sileo.error({ 
          title: "Ha habido un problema en la creación del usuario", 
          fill: "#171717" 
        });
      }else {
        console.log("Iniciada sesión en:", user);
      }
  }

  const loginGoogle = async () => {
    const { user, error } = await loginWithGoogle();
    
    if (error) {
      console.log("error" + error);
    } else {
      console.log("sesion iniciada " + user);
    }
  };

  return (
    <>
    <main className="login-page">
      <section className="login-page__info">

        <header className="login-page__header">
          <img src="#" alt="Narime logo" className="login-page__logo"></img>

          <button className="login-page__back">
            <img src="#" alt="" />
            <p>Go back</p>
          </button>
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
            <label>Email</label>
            <input
              type="email"
              {...register('email', { 
                required: 'Este campo es obligatorio', 
              })}
            ></input>
            {errors.email && <span>{errors.email.message}</span>}
          </div>
          
          <div className="login-page__form-field">
            <label>Contraseña</label>
            <input
              type='password'
              {...register('password', { 
                required: 'Este campo es obligatorio', 
              minLength: {value: 6, message: 'La contraseña debe tener al  menos 6 carácteres'},
              pattern: {value: /^(?=.*[A-Z])(?=.*\d).+$/, message: "Debe tener una mayúscula y un número"}
            })}
            ></input>
            {errors.password && <span>{errors.password.message}</span>}
          </div>
          <p className="login-page__form-forget">Forget your password?</p>

          <button className="btn-primary login-page__button" type="submit">Iniciar sesión</button>
        
        </form>

        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">O</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button className="btn-secondary login-page__button" onClick={loginGoogle}>Inicia sesión con google</button>
        
        <p className="login-page__form-sing-up">You don't have account? Register here</p>
      </section>
    </main>
    </>
  );
};

export default LoginPage;
