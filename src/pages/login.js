import '../css/login.css';


function LoginButton() {
    return(
        <button type='submit' class='Button'>Login</button>
    );
}

function LoginForm() {
    return(
        <div class="Login-Form">
            <h1>Welcome</h1>
            <form>
                <input type="text" title="email address" placeholder='you@email.domain' />
                <input type="password" title="password" placeholder='password' />
                <LoginButton />
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className='Login-Background'>
            <LoginForm />
        </div>
    );
}

