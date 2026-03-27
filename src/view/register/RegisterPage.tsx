import { registerFirebase, loginWithGoogle } from "../../firebase/services/authService";
import { useForm} from "react-hook-form"
import type { SubmitHandler } from "react-hook-form";
import { sileo } from "sileo";

import "./register.scss";

type Inputs = {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
  confirmTerms: boolean;
};

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const passwordValue = watch("password");

  const onSubmit: SubmitHandler<Inputs> = async (data) => {   
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
      <div className="colunm">
        <form onSubmit={handleSubmit(onSubmit)} className="colunm">
          <label>UserName*</label>
          <input
            type="text"
            {...register("username", { 
                required: 'El nombre de usuario es obligatorio', 
                maxLength:{value:20, message:'El máximo de carácteres son 20'}
            })}
          ></input>
          {errors.username && <span>{errors.username.message}</span>}

          <label>Email*</label>
          <input
            type='email'
            {...register('email', { 
                required: 'Este campo es obligatorio', 
            })}
          ></input>
          {errors.email && <span>{errors.email.message}</span>}

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

          <label>
            <input
              type="checkbox"
              {...register("confirmTerms", { required:'Este campo es obligatorio'})}
            ></input>
            He leido y acepto los terminos y condiciones de uso
          </label>
          {errors.confirmTerms && (<span>{errors.confirmTerms.message}</span>)}

          <button type="submit">Registrarse
          </button>
        </form>

        <button onClick={loginGoogle}>Continua con google</button>
      </div>
    </>
  );
};

export default RegisterPage;
