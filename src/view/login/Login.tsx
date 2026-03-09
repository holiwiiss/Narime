import { getAuth } from "firebase/auth";
import "./login.scss"
const Login = () => {

    return(
        <>
            <div className="colunm">
                <label>Email</label>
                <input type="email"></input>
                <span>El correo electronico no es correcto</span>

                <label>Contraseña</label>
                <input type="password"></input>
                <span>La contraseña no es correcta</span>

                <button>Iniciar sesión</button>
            </div>
        </>
    )
}

export default Login