import { loginFirebase, loginWithGoogle} from "../../firebase/services/authService";
import{ useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { sileo } from "sileo";
import type { LoginFormInputs } from "../../types/authTyping";

import "./login.scss";

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
      <div className="colunm">
        <form onSubmit={handleSubmit(onSubmit)} className="colunm">
          <label>Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Este campo es obligatorio', 
            })}
          ></input>
          {errors.email && <span>{errors.email.message}</span>}

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

          <button type="submit">Iniciar sesión</button>
        </form>

        <button onClick={loginGoogle}>Inicia sesión con google</button>
      </div>
    </>
  );
};

export default LoginPage;
