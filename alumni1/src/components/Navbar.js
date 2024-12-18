import { Link } from 'react-router-dom';

const Navbar = () => {
    const navStyles = {
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    };

    const ulStyles = {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0
    };

    const liStyles = {
        margin: '0 15px'
    };

    const linkStyles = {
        color: 'black',
        textDecoration: 'none',
        fontWeight: 'bold'
    };

    return (
        <nav style={navStyles}>
            <ul style={ulStyles}>
                <li style={liStyles}><a href="/alumni_list" style={linkStyles}>Our Alumni</a></li>
                <li style={liStyles}><Link to="/events" style={linkStyles}>Events</Link></li>
                <li style={liStyles}><a href="/donate" style={linkStyles}>Donation</a></li>
                <li style={liStyles}><a href="/profile" style={linkStyles}>Profile</a></li>
                <li style={liStyles}><Link to="/jobs" style={linkStyles}>Job</Link></li> 
            </ul>
        </nav>
    );
};

export default Navbar;
