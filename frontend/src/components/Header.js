import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/icon.png';
import '../App.css';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); 

  useEffect(() => {
    async function fetchUser() {
      try {
        const resp = await fetch("http://localhost:8080/auth/me", {
          credentials: 'include'
        });

        if (!resp.ok) {
          throw new Error('Erro ao Buscar Usuário');
        }

        const data = await resp.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);
  
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error("Erro ao Fazer Logout", err);
    }

    navigate('/login');
  };

  const getInitials = (fullName) => {
    if (!fullName) return 'US';
    
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  };

  const profileInitials = getInitials(user?.username);

  return (
    <header className="bg-light shadow-sm py-3 position-fixed w-100 border-bottom" style={{ zIndex: 1030 }}>
      <div className="container-fluid px-4">
        <div className="d-flex align-items-center justify-content-between">
          {/* Logo */}
          <div className="d-flex align-items-center gap-2">
            <img src={logo} alt="logo" className="rounded pt-1" style={{ height: '30px' }} />
            <h4 className="mb-0 fw-bold" style={{ color: '#388E3C' }}>FinanceApp</h4>
          </div>

          {/* Profile + Logout */}
          <div className="d-flex align-items-center gap-3">
            {/* Circle*/}
          <div 
            className="d-flex justify-content-center align-items-center rounded-circle bg-success text-white fw-bold profile-btn"
            style={{ width: '36px', height: '36px', fontSize: '1rem', userSelect: 'none' }}
            title={user?.username || 'Usuário'}
            onClick={() => navigate('/profile')}
          >
            {profileInitials}
          </div>

            <button 
              className="btn border-2 btn-outline-danger rounded-pill px-4 py-2 fw-medium"
              onClick={handleLogout}
              style={{ transition: 'all 0.3s ease' }}
            >
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
