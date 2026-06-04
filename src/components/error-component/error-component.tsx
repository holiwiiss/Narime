import "./error-component.scss"

type ButtonAction =
  | { type: "reload" }
  | { type: "navigate"; href: string };

type ErrorProp = {
  text: string;
  button?: {
    label: string;
    action: ButtonAction;
  };
  size?: "small" 
};

const ErrorComponent = ({text, button, size}:ErrorProp) => {
  const reloadPage = () => {
    if (!button) return;

    if (button.action.type === "reload") {
      window.location.reload();
    } else if (button.action.type === "navigate") {
      window.location.href = button.action.href;
    }
  };
  return(
    <>
      <div className="error-component__container">
        <h1 className={`error-component__sad-face ${size ? `error-component__sad-face--${size}`: ""}`}>(⁠╥⁠﹏⁠╥⁠)</h1>
        <h2 className={`text-h1 error-component__text ${size ? ` error-component__text--${size}`: ""}`}>{text}</h2>
        {button && (
          <button className="btn" onClick={reloadPage}>
            {button.label}
          </button>
        )}
      </div>
    </>
  )
}

export default ErrorComponent