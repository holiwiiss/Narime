import { register } from "../../firebase/services/authService";
import { useState } from "react";

import "./register.scss"

const Register = () => {

    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [userPassword, setUserPassword] = useState('')
    const [userPasswordConfirm, setUserPasswordConfirm] = useState('')
    const [errors, setErrors] = useState({errorUser: '', errorEmail: '', errorPassword: '', errorPaswordConfirm: ''})

    const validateInputs = () => {

        let isCorrect = true
        const errorsValidation = {...errors}
        
        //Comprobacion del nombre de usuario
        if(userName === ''){
            isCorrect = false
            errorsValidation.errorUser = 'El nombre de usuario no puede estar vacío'
        }else{
            errorsValidation.errorUser = ''
        }
        
        //comprobacion del correo electrónico
        if(userEmail === ''){
            isCorrect = false
            errorsValidation.errorEmail = 'El email no puede estar vacío'
        }else{
            errorsValidation.errorEmail = ''
        }

        //comprobacion de la contraseña
        if(userPassword === ''){
            isCorrect = false
            errorsValidation.errorPassword = 'Debes introduccir una contraseña'
        }else if(userPassword.length<6){
            errorsValidation.errorPassword = 'La contraseña debe tener al menos 6 carácteres'
        }else{
            errorsValidation.errorPassword = ''
        }

        if(userPasswordConfirm != userPassword){
            isCorrect = false
            errorsValidation.errorPaswordConfirm = 'Las contraseñas deben coincidir'
        }else{
            errorsValidation.errorPaswordConfirm = ''
        }

        setErrors(errorsValidation)

        if(isCorrect){
            register(userEmail, userPassword)
        }
    }

    return(
        <>
            <div className="colunm">

                <label>UserName*</label>    
                <input type="text" onChange={(event) => setUserName(event.target.value)}></input>
                <span>{errors.errorUser}</span>

                <label>Email*</label>
                <input type="email" onChange={(event) => setUserEmail(event.target.value)}></input>
                <span>{errors.errorEmail}</span>

                <label>Contraseña</label>
                <input type="password" onChange={(event) => setUserPassword(event.target.value)}></input>
                <span>{errors.errorPassword}</span>

                <label>Confirmar contraseña</label>
                <input type="password" onChange={(event) => setUserPasswordConfirm(event.target.value)}></input>
                <span>{errors.errorPaswordConfirm}</span>

                <button onClick={validateInputs}>Registrarse</button>
            </div>
        </>
    )
}

export default Register