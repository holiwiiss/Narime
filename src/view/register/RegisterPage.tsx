import { registerFirebase, loginWithGoogle } from "../../firebase/services/authService";
import { useForm} from "react-hook-form"
import { sileo } from "sileo";

import type { SubmitHandler } from "react-hook-form";
import type { RegisterFormInputs } from "../../types/authTyping";

import "./register.scss";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormInputs>();

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<RegisterFormInputs> = async (data) => {   
    await validateRegister(data.email, data.password)
  }

  const validateRegister = async (email:string , password:string) => {

    const { user, error } = await registerFirebase(email, password);

    if (error) {
      sileo.error({ title: "Ha habido un problema en la creación del usuario", fill: "#171717" });
    }

    console.log("Usuario registrado:", user);
    sileo.success({ title: "Usuario creado correctamente", fill: "#171717" });
  }

  const loginGoogle = async() => {
    const {user, error} = await loginWithGoogle()

    if(error){
      console.log('error' + error)
    }else{
      console.log('sesion iniciada ' + user)
    }
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
                  maxLength:{value:20, message:'El máximo de carácteres son 20'}
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
          <button className="btn-primary register-page__button" type="submit">Registrarse</button>
        </form>
        
        <div className="login-page__form-separation">
          <div className="login-page__form-separation-line"></div>
          <p className="login-page__form-separation-text">o</p>
          <div className="login-page__form-separation-line"></div>
        </div>

        <button className=" register-page__button btn-secondary"  onClick={loginGoogle}>Continua con google</button>

        <p className="login-page__form-sing-up">Do you have account? Sign In here</p>
      </section>
    </main>
    </>
  );
};

export default RegisterPage;
