import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

function formatDateBrazil(dateString) {
  console.log('formatDateBrazil received:', dateString);
  if (!dateString) return 'Data Inválida';

  try {
    const dateObj = new Date(dateString);
    if (isNaN(dateObj)) return 'Data Inválida';

    return dateObj.toLocaleString('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour12: false,
    });
  } catch (error) {
    console.error('Error Formatting Date:', error);
    return 'Data Inválida';
  }
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const resp = await fetch('http://localhost:8080/auth/me', {
          credentials: 'include',
        });

        if (!resp.ok) {
          if (resp.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Erro ao Buscar Usuário');
        }

        const data = await resp.json();
        setUser(data);
      } catch (err) {
        console.error(err);
        setError('Falha ao Carregar Dados do Usuário');
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    async function fetchTransactions() {
      try {
        setLoading(true);
        const resp = await fetch(`http://localhost:8080/api/transactions`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!resp.ok) {
          if (resp.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Erro ao Buscar Transações');
        }

        const data = await resp.json();

        const transactionsWithType = data
          .map((tx) => {
            const catId = Number(tx.categoryId);
            return {
              ...tx,
              type: catId >= 1 && catId <= 7 ? 'income' : 'expense',
            };
          })
          .sort((a, b) => new Date(b.dateTime || 0) - new Date(a.dateTime || 0));

        setTransactions(transactionsWithType);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Falha ao Carregar Transações. Por Favor, Tente Novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [user, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <main className="flex-grow-1 d-flex justify-content-center align-items-center py-5">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">

              {/* Welcome Card */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body py-4 text-center">
                  <h3 className="fw-bold text-primary mb-1">
                    Histórico de {user ? user.username : 'Usuário'}
                  </h3>
                  <p className="text-muted mb-0">
                    Todas as suas transações registradas
                  </p>
                </div>
              </div>

              {/* Transactions List */}
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">Transações</h5>
                </div>
                <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {loading ? (
                    <div className="text-center">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Carregando...</span>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                  ) : transactions.length === 0 ? (
                    <p className="text-center text-muted">Nenhuma transação encontrada.</p>
                  ) : (
                    <div className="list-group">
                      {transactions.map(tx => (
                        <div
                          key={tx.id}
                          className={`list-group-item d-flex justify-content-between align-items-center 
                            ${tx.type === 'income' ? 'list-group-item-success' : 'list-group-item-danger'}`}
                        >
                          <div>
                            <h6 className="mb-1 fw-semibold">{tx.title}</h6>
                            <small className="text-muted">
                              {formatDateBrazil(tx.dateTime)}
                            </small>
                          </div>
                          <div className={`fw-bold ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                            R$ {parseFloat(tx.amount || 0).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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

export default HistoryPage;