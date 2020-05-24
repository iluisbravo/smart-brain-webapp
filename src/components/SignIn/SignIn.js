import React, {Component} from 'react';

class SignIn extends Component{

    constructor(props){
        super(props); 
        this.state = {
            signInEmail: '',
            signInPassword:''
        }
    }

    onInputChange = (event) => {
        const input = event.target.id;
        const value = event.target.value;
        if(input === "email"){
            this.setState({signInEmail: value});
        }
        else if(input === "password"){
            this.setState({signInPassword: value});
        }       
    }

    onSubmitSignIn = () => {
        console.log(this.state);
        fetch('https://infinite-depths-21841.herokuapp.com/signin',{
            method: 'post',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                email: this.state.signInEmail,
                password: this.state.signInPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            if(!data.hasError){
                const user = data.user;
                this.props.loadUser(user);
                this.props.onRouteChange('home');
                alert(`Bienvenido: ${user.name}`);
            }
            else{
                alert(`Error: ${data.message}`);
            }
        })
        .catch(err => {
            alert(`Error: ${err.message}`);
        });
         
    }

    render() {
        const {onRouteChange} = this.props;
        return(
            <div>
                <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
                    <main className="pa4 black-80">
                        <div className="measure">
                            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                                <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                                <div className="mt3">
                                    <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
                                    <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="email" name="email"  id="email" onInput={this.onInputChange} />
                                </div>
                                <div className="mv3">
                                    <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
                                    <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" onInput={this.onInputChange} />
                                </div>
                            </fieldset>
                            <div className="">
                                <input 
                                 onClick={this.onSubmitSignIn}
                                 className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                                 type="submit" 
                                 value="Sign in" />
                            </div>
                            <div className="lh-copy mt3">
                                <p  
                                 onClick={() => onRouteChange('register')}
                                className="f6 link dim black db pointer">
                                Register
                                </p>
                            </div>
                        </div>
                    </main>
                </article>
            </div>    
        );
    }   
}

export default SignIn;