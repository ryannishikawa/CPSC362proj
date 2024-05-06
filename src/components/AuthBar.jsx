/**
 * @file AuthBar.jsx
 * @author Matt De Binion <mattdb@csu.fullerton.edu>
 * @description This authentication bar component is used to display if the user is currently authenticated
 * 
 */
import { DateTimeFormat } from '../components/Time.jsx';
import { LoggedUser } from '../components/LoggedUser.jsx';

/**
 * The AuthBar component shows authentication status and the current time.
 */
export function AuthBar() {
    return(
        <div className='container'>
            <LoggedUser />
            <DateTimeFormat />
        </div>
    );
}