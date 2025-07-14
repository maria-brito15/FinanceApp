import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../App.css';

const LoginForm = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password}),
        credentials: 'include'
      });

      if (!resp.ok) {
        const text = await resp.text(); 
        throw new Error(text || "Erro ao Logar.");
      }

      const data = await resp.json();
      console.log("Login Efetuado com Sucesso! ");
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className='alert alert-danger'>{error}</div>}

      <div id='container'  className='d-flex bg-light rounded-4 shadow align-items-center w-100 justify-content-center'>
        <div id='left' className='w-50 py-5 rounded-left-4' style={{ backgroundColor: '#388E3C', color: 'white' }}>

          <div className='d-flex flex-column gap-3 align-items-center justify-content-center' style={{ minHeight: '50vh' }}>
            <h3 className='fw-bold'>Olá!</h3>
            <p className='w-75 text-center'>Ainda não tem uma conta? Comece agora a cuidar melhor do seu dinheiro, registre-se!</p>
            <button onClick={() => navigate('/register')} className='border-2 border-white text-white rounded-pill py-2 px-4 fw-semibold bg-transparent'>REGISTRE-SE</button>
          </div>
        </div>

        <div id='right' className='w-75 position-relative' style={{ minWidth: '33.8vh' }}>
          <div className='d-flex flex-column gap-3 align-items-center'>
            <h1 className='fw-bold'>Entrar</h1>
            <input id='emailInput' value={email} onChange={e => setEmail(e.target.value)} required type='email' placeholder='example@gmail.com' className='form-control w-75'></input>
            <input id='passwordInput' value={password} onChange={e => setPassword(e.target.value)} required type='password' placeholder='*******' className='form-control w-75'></input>
            <button type='submit' disabled={loading} className='border-2 shadow rounded-pill py-2 px-4 fw-semibold bg-primary text-white'>
              {loading ? 'ENTRANDO...' : 'CONTINUAR'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default LoginForm;