type ErrorProp = {
  text: string;
};

const ErrorComponent = ({text}:ErrorProp) => {
    const reloadPage = () => {
        window.location.reload();
    };
    return(
        <>
        <div>
            <img src="#"></img>
            <div>
                <h1>(⁠╥⁠﹏⁠╥⁠)</h1>
                <h2>{text}</h2>
                <button className="btn-primary" onClick={reloadPage}>Reintentar</button>
            </div>
        </div>
        </>
    )
}

export default ErrorComponent