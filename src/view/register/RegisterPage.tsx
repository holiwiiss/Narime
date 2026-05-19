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
            <label>UserName*</label>
            <input
              type="text"
              {...register("username", { 
                  required: 'El nombre de usuario es obligatorio', 
                  maxLength:{value:20, message:'El máximo de carácteres son 20'},
                  minLength:{value:3, message:'El mínimo de carácteres son 3'}
              })}
            ></input>
            {errors.username && <span>{errors.username.message}</span>}
          </div>

          <div className="register-page__form-field">
            <label>Email*</label>
            <input
              type='email'
              {...register('email', { 
                  required: 'Este campo es obligatorio', 
              })}
            ></input>
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="register-page__form-field">
            <label>Contraseña*</label>
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

          <div className="register-page__form-field">
            <label>Confirmar contraseña*</label>
            <input
              type='password'
              {...register('passwordConfirm', { 
                  required: 'Este campo es obligatorio', 
                  validate: (value) =>
                  value === passwordValue || 'Las contraseñas no coinciden',
              })}
            ></input>
            {errors.passwordConfirm && (<span>{errors.passwordConfirm.message}</span>)}  
          </div>

          <div className="register-page__form-field">
            <label>
              <input
                type="checkbox"
                {...register("confirmTerms", { required:'Este campo es obligatorio'})}
              ></input>
              He leido y acepto los terminos y condiciones de uso
            </label>
            {errors.confirmTerms && (<span>{errors.confirmTerms.message}</span>)}  
          </div>
          {isError && (<span>Ha ocurrido un error creando al usuario</span>)}
          {isLoading && (<p>Creando el usuario...</p>)}
          <button disabled={isLoading} className="btn-primary register-page__button" type="submit">Registrarse</button>
        </form>
        
        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">o</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button disabled={isLoading} className=" register-page__button btn-secondary"  onClick={registerWithGoogle}>Continua con google</button>
        <Link to="/login"><p className="login-page__form-sing-up">Do you have account? Sign In here</p></Link>
      </section>
    </main>
    </>
  );
};

export default RegisterPage;
