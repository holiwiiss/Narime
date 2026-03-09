import { register } from "../../firebase/services/authService";
import { useState } from "react";
import { sileo } from "sileo";

import "./register.scss"

const Register = () => {

    const [formData, setFormData] = useState({
        userName: '',
        userEmail: '',
        userPassword: '',
        userPasswordConfirm:'',
        confirmTerms: false,
    })

    const [errors, setErrors] = useState({
        errorUser: '', 
        errorEmail: '', 
        errorPassword: '', 
        errorPasswordConfirm: '', 
        errorTerms: ''
    })

    const validateForm = async () => {
        let isCorrect = true
        const errorsValidation = { errorUser:'', errorEmail:'', errorPassword:'', errorPasswordConfirm:'', errorTerms:'' };
        
        //Comprobacion del nombre de usuario
        if(!formData.userName){
            isCorrect = false
            errorsValidation.errorUser = 'El nombre de usuario no puede estar vacío'
        }else if(!/^[a-zA-Z0-9_-]+$/.test(formData.userName)){
            isCorrect = false;
            errorsValidation.errorUser = 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos'
        }
        
        //Comprobacion del correo electrónico
        if(!formData.userEmail){
            isCorrect = false
            errorsValidation.errorEmail = 'El email no puede estar vacío'
        }

        //Comprobacion de la contraseña
        if(!formData.userPassword){
            isCorrect = false
            errorsValidation.errorPassword = 'Debes introduccir una contraseña'
        }else if(formData.userPassword.length<6){
            isCorrect = false
            errorsValidation.errorPassword = 'La contraseña debe tener al menos 6 carácteres'
        }

        if(formData.userPasswordConfirm !== formData.userPassword){
            isCorrect = false
            errorsValidation.errorPasswordConfirm = 'Las contraseñas deben coincidir'
        }

        if(!formData.confirmTerms){
            isCorrect = false
            errorsValidation.errorTerms = 'Debe aceptar los terminos y condiciones'
        }

        setErrors(errorsValidation)
        if(isCorrect){
            validateFirebase()
        }
    }

    const validateFirebase = async() => {
        
        const { user, error } = await register(formData.userEmail, formData.userPassword);

        if(error){
            if (error.code === "auth/email-already-in-use") {
                setErrors(prev => ({ ...prev, errorEmail: "Este correo ya está registrado" }));
            } else if (error.code === "auth/invalid-email") {
                setErrors(prev => ({ ...prev, errorEmail: "Correo electrónico inválido" }));
            } else {
                setErrors(prev => ({ ...prev, errorPasswordConfirm: "Ha ocurrido algún error" }));
            }
        }else {
            console.log("Usuario registrado:", user);
            sileo.success({ title: "Usuario creado correctamente", fill: "#171717" });
        }
    }

    return(
        <>

            <div className="colunm">

                <label>UserName*</label>    
                <input type="text" onChange={e => setFormData(prev => ({ ...prev, userName: e.target.value }))}></input>
                <span>{errors.errorUser}</span>

                <label>Email*</label>
                <input type="email" onChange={e => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}></input>
                <span>{errors.errorEmail}</span>

                <label>Contraseña</label>
                <input type="password" onChange={e => setFormData(prev => ({ ...prev, userPassword: e.target.value }))}></input>
                <span>{errors.errorPassword}</span>

                <label>Confirmar contraseña</label>
                <input type="password" onChange={e => setFormData(prev => ({ ...prev, userPasswordConfirm: e.target.value }))}></input>
                <span>{errors.errorPasswordConfirm}</span>
                
                <label>
                    <input type="checkbox" checked={formData.confirmTerms} onChange={() => setFormData(prev => ({ ...prev, confirmTerms: !prev.confirmTerms}))}></input>
                    He leido y acepto los terminos y condiciones de uso
                </label>
                <span>{errors.errorTerms}</span>

                <button onClick={validateForm}>Registrarse</button>
            </div>
        </>
    )
}

export default Register