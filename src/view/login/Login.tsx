import { useState } from "react";
import { login } from "../../firebase/services/authService";
import "./login.scss"
const Login = () => {

    const [formData, setFormData] = useState({
        userEmail:'',
        userPassword:''
    })

    const [errors, setErrors] = useState({
        errorEmail:'',
        errorPassword: '',
    })

    const validateForm = async () => {
        let isCorrect = true
        const errorsValidation = { errorEmail:'', errorPassword:''}

        if(!formData.userEmail){
            isCorrect = false
            errorsValidation.errorEmail = 'Introduce un correo electrónico'
        }

        if(!formData.userPassword || formData.userPassword.length < 6){
            isCorrect = false
            errorsValidation.errorPassword = 'La contraseña no es válida'
        }

        setErrors(errorsValidation)

        if(isCorrect){
            validateFirebase()
        }
    }

    const validateFirebase = async () => {
        const { user, error } = await login(formData.userEmail, formData.userPassword);

        if(error){
            if(error.code ==='auth/invalid-email'){
                setErrors(prev => ({ ...prev, errorEmail: "Correo electrónico inválido" }));
            }else if(error.code ==='auth/user-disabled'){
                setErrors(prev => ({ ...prev, errorEmail: "Usuario deshabilitado" }));
            }else if(error.code ==='auth/user-not-found'){
                setErrors(prev => ({ ...prev, errorEmail: "El correo electrónico no existe"}));
            }else if(error.code ==='auth/wrong-password'){
                setErrors(prev => ({ ...prev, errorPassword: "La contraseña no coincide"}));
            }else{
                setErrors(prev => ({ ...prev, errorPassword: "Ha habido algún error"}));
            }   
        }else {
            console.log("Iniciada sesión en:", user);
        }
    }

    return(
        <>
            <div className="colunm">
                <label>Email</label>
                <input type="email" onChange={e => setFormData(prev => ({...prev, userEmail: e.target.value}))}></input>
                <span>{errors.errorEmail}</span>

                <label>Contraseña</label>
                <input type="password" onChange={e => setFormData(prev => ({...prev, userPassword: e.target.value}))}></input>
                <span>{errors.errorPassword}</span>

                <button onClick={validateForm}>Iniciar sesión</button>
            </div>
        </>
    )
}

export default Login