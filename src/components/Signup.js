
import  React, {useState} from 'react'
import { useHistory } from 'react-router-dom'


const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"",email: "", password: "",cpassword:""}) 
    let history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,email,password}=credentials;
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
           

            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name,email,password})
        });
        const json = await response.json()
        console.log(json);
        if (json.success){
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken); 
            history.push("/");
            // props.showAlert("successfully created account ","success");
        }
        else{
            alert("invalid credentials ","danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials, [e.target.name]: e.target.value})
    }

    return (
        <div className='container'>
           <form  onSubmit={handleSubmit}>

            <div className="mb-3">
                    <label htmlFor="name" className="form-label">name</label>
                    <input type="text" className="form-control" value={credentials.name} onChange={onChange} 
                    id="name" name="name"
                     aria-describedby="emailHelp" />
                    
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange}
                     id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} 
                    name="password" id="password" minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">re enter Password</label>
                    <input type="password" className="form-control" value={credentials.cpassword} onChange={onChange}
                     name="cpassword" id="cpasswor1d" minLength={5} required/>
                </div>

                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    )
}


export default Signup
