import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    username: '',
    email: '',
  });

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
        setData({
          username: data.username || '',
          email: data.email || ''
        });
      } catch (err) {
        console.error(err);
      }
    }

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:8080/api/user/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Erro ao atualizar perfil");
      }

      const updatedUser = await resp.json();
      setUser(updatedUser);
      alert("Perfil atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      alert(`Erro: ${err.message}`);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">

              {/* Profile Card */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body py-4 text-center">
                  <h3 className="fw-bold text-primary mb-1">
                    Perfil de {user ? user.username : 'Usuário'}
                  </h3>
                  <p className="text-muted mb-0">
                    Gerencie suas informações de conta.
                  </p>
                </div>
              </div>

              {/* Edit Profile Form */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">Editar Perfil</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Nome de Usuário</label>
                      <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={data.username}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={data.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <button
                      type="submit"
                      className="rounded-pill px-4 py-2 btn btn-primary w-100 fw-semibold"
                    >
                      Salvar Alterações
                    </button>
                  </form>
                </div>
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  className="fw-semibold btn btn-outline-primary px-4 py-2 rounded-pill flex-fill"
                  style={{ maxWidth: '200px', transition: 'all 0.3s ease' }}
                  onClick={() => navigate('/dashboard')}
                >
                  Voltar
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
