import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState('0,00');
  const [expense, setExpense] = useState('0,00');
  const [income, setIncome] = useState('0,00');
  const [showModal, setShowModal] = useState(false);
  const [modalAnimating, setModalAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    type: 'income',
    title: '',
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const resp = await fetch('http://localhost:8080/auth/me', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!resp.ok) {
          if (resp.status === 401 || resp.status === 403) {
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

  const openModal = () => {
    setShowModal(true);
    setTimeout(() => setModalAnimating(true), 10);
  };

  const closeModal = () => {
    setModalAnimating(false);
    setTimeout(() => {
      setShowModal(false);
      setFormData({
        type: 'income',
        title: '',
        amount: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0],
      });
    }, 300);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert('Usuário não Carregado.');
      return;
    }

    try {
      const transactionPayload = {
        userId: user.id,
        categoryId: parseInt(formData.categoryId, 10),
        title: formData.title,
        amount: parseFloat(formData.amount),
        dateTime: new Date(formData.date).toISOString(),
      };

      const response = await fetch('http://localhost:8080/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao Adicionar Transação');
      }

      closeModal();
      alert('Transação Adicionada com Sucesso!');
      window.location.reload();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao Adicionar Transação: ' + error.message);
    }
  };

  useEffect(() => {
    if (!user) return;

    async function fetchFinancialData() {
      try {
        setLoading(true);
        const transactionsResp = await fetch('http://localhost:8080/api/transactions', {
          method: 'GET',
          credentials: 'include',
        });

        if (!transactionsResp.ok) {
          if (transactionsResp.status === 401 || transactionsResp.status === 403) {
            navigate('/login');
            return;
          }
          throw new Error('Erro ao Buscar Transações');
        }

        const transactions = await transactionsResp.json();

        const transactionsWithType = transactions.map((tx) => ({
          ...tx,
          type: (tx.categoryId >= 1 && tx.categoryId <= 7) ? 'income' : 'expense',
        }));

        let totalIncome = 0;
        let totalExpense = 0;
        let totalBalance = 0;

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        transactionsWithType.forEach((transaction) => {
          const transactionDate = new Date(transaction.dateTime);
          const amount = parseFloat(transaction.amount);

          if (transaction.type === 'income') {
            totalBalance += amount;
          } else if (transaction.type === 'expense') {
            totalBalance -= amount;
          }

          if (transactionDate >= oneWeekAgo) {
            if (transaction.type === 'income') {
              totalIncome += amount;
            } else if (transaction.type === 'expense') {
              totalExpense += amount;
            }
          }
        });

        setBalance(totalBalance.toFixed(2).replace('.', ','));
        setIncome(totalIncome.toFixed(2).replace('.', ','));
        setExpense(totalExpense.toFixed(2).replace('.', ','));
        setError(null);
      } catch (err) {
        console.error('Erro ao Carregar Dados Financeiros:', err);
        setError('Falha ao Carregar Dados Financeiros. Por Favor, Tente Novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchFinancialData();
  }, [user, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Header />

      <main
        className="flex-grow-1 d-flex justify-content-center align-items-center py-5"
        style={{ marginTop: '80px' }}
      >
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 col-xl-6">
              {error && <div className="alert alert-danger text-center">{error}</div>}

              {loading && (
                <div className="text-center mb-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                  </div>
                </div>
              )}

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body py-4 text-center">
                  <h3 className="fw-bold text-primary mb-1">
                    Olá, {user ? user.username : 'Usuário'}!
                  </h3>
                  <p className="text-muted mb-0">Bem-vindo ao seu painel financeiro.</p>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body text-center py-5">
                  <h2 className="fw-semibold text-muted mb-2">Saldo Atual</h2>
                  <h1
                    className={`display-4 fw-bold mb-0 ${
                      parseFloat(balance.replace(',', '.')) >= 0 ? 'text-success' : 'text-danger'
                    }`}
                  >
                    R$ {balance}
                  </h1>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">Movimento da Última Semana</h5>
                </div>
                <div className="card-body">
                  <div className="row g-3 justify-content-center">
                    <div className="col-sm-6">
                      <div className="card border-danger bg-danger bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2 fw-semibold">Saídas</h6>
                          <h4 className="text-danger fw-bold mb-0">R$ {expense}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div className="card border-success bg-success bg-opacity-10">
                        <div className="card-body text-center">
                          <h6 className="text-muted mb-2 fw-semibold">Entradas</h6>
                          <h4 className="text-success fw-bold mb-0">R$ {income}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card shadow-sm border-0 mb-4">
                <div className="card-header bg-primary text-white text-center">
                  <h5 className="mb-0">Transações</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-center gap-3">
                    <button
                      className="fw-semibold btn btn-outline-primary px-4 py-2 rounded-pill flex-fill"
                      style={{ maxWidth: '200px', transition: 'all 0.3s ease' }}
                      onClick={openModal}
                    >
                      Adicionar
                    </button>
                    <button
                      onClick={() => navigate('/history')}
                      className="fw-semibold btn btn-primary px-4 py-2 rounded-pill flex-fill"
                      style={{ maxWidth: '200px', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#0d6efd';
                        e.target.style.borderColor = '#0d6efd';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#0d6efd';
                        e.target.style.color = 'white';
                        e.target.style.borderColor = '#0d6efd';
                      }}
                    >
                      Histórico
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showModal && (
        <div
          className={`modal fade ${modalAnimating ? 'show' : ''} d-block`}
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Adicionar Transação</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Tipo</label>
                    <select
                      className="form-select"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="income">Entrada</option>
                      <option value="expense">Saída</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Descrição</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Descrição da Transação"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Valor</label>
                    <div className="input-group">
                      <span className="input-group-text">R$</span>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        placeholder="0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Categoria</label>
                    <select
                      className="form-select"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Selecione uma Categoria</option>
                      {formData.type === 'income' ? (
                        <>
                          <option value="1">Salário</option>
                          <option value="2">Bônus</option>
                          <option value="3">Renda Extra</option>
                          <option value="4">Investimentos</option>
                          <option value="5">Venda de Produto</option>
                          <option value="6">Reembolso</option>
                          <option value="7">Presentes</option>
                        </>
                      ) : (
                        <>
                          <option value="8">Alimentação</option>
                          <option value="9">Moradia</option>
                          <option value="10">Transporte</option>
                          <option value="11">Saúde</option>
                          <option value="12">Lazer</option>
                          <option value="13">Educação</option>
                          <option value="14">Contas</option>
                          <option value="15">Vestuário</option>
                          <option value="16">Impostos e Taxas</option>
                          <option value="17">Empréstimos e Financiamentos</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Data</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer gap-2">
                  <button type="button" className="rounded-pill px-4 py-2 btn btn-secondary" onClick={closeModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="rounded-pill px-4 py-2 btn btn-primary">
                    Adicionar Transação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
