import './styleguide.scss'

const StyleGuide = () => {
    return(
    <>
        <div className='display-colores'> 
            <div className="color color1">
                <p>var(--color-primary)</p>
                <code>#B0413E</code>
            </div>
            
            <div className="color color3">
                <p>var(--color-secondary)</p>
                <code>#FFFFC7</code>
            </div>

            <div className="color color2">
                <p>var(--color-white)</p>
                <code>#FFFFC7</code>
            </div>
            <div className="color color4">
                <p>var(--color-black)</p>
                <code>#473335</code>
            </div>    
        </div>   
    <table>
        
        <tr>
            <td>h1</td>
            <td> <h1>caracola</h1></td>
        </tr>

        <tr>
            <td>h2</td>
            <td> <h2>caracola</h2></td>
        </tr>

        <tr>
            <td>h3</td>
            <td> <h3>caracola</h3></td>
        </tr>

        <tr>
            <td>h4</td>
            <td><h4>caracola</h4></td>
        </tr>

        <tr>
            <td>h5</td>
            <td><h5>caracola</h5></td>
        </tr>

        <tr>
            <td>h6</td>
            <td><h6>caracola</h6></td>
        </tr>

        <tr>
            <td>p</td>
            <td><p>caracola</p></td>
        </tr>

        <tr>
            <td>span</td>
            <td><span>caracola</span></td>
        </tr>

        <tr>
            <td>a </td>
            <td><a href="#">Enlace</a></td>
        </tr>

        <tr>
            <td>Label </td>
            <td><label>caracola</label></td>
        </tr>

        <tr>
            <td>button</td>
            <td><button>boton</button></td>
        </tr>

        <tr>
            <td>input textito</td>
            <td><input type="text"></input></td>
        </tr>

        <tr>
            <td>input email</td>
            <td><input type="email"></input></td>
        </tr>

        
        
        <tr>
            <td>textarea</td>
            <td><textarea></textarea></td>
        </tr>

        <tr>
            <td>map</td>
            <td><map></map></td>
        </tr>
    
    </table>
        
    </>
    ) 
}

export default StyleGuide