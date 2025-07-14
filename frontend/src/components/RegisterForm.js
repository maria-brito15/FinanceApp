import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'


const RegisterForm = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError("As Senhas não Coincidem.");
      return;
    }

    try {
      const resp = await fetch("http://localhost:8080/auth/register", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({username, email, password})
      });

    if (!resp.ok) {
      const text = await resp.text(); 
      throw new Error(text || "Erro ao Registrar.");
    }

      const data = await resp.text();
      console.log("Registro Efetuado com Sucesso!");

      alert("Você será redirecionado a página de login, entre na conta criada.");
      navigate('/login');
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

      <div id='container' className='d-flex bg-light rounded-4 shadow align-items-center w-100 justify-content-center'>
        <div id='left' className='w-50 py-5 rounded-left-4' style={{ backgroundColor: '#388E3C', color: 'white' }}>

          <div className='d-flex flex-column gap-3 align-items-center justify-content-center' style={{ minHeight: '50vh' }}>
            <h3 className='fw-bold'>Olá!</h3>
            <p className='w-75 text-center'>Já tem uma conta? Continue cuidando do seu dinheiro! Logue-se!</p>
            <button onClick={() => navigate('/login')} className='border-2 border-white text-white rounded-pill py-2 px-4 fw-semibold bg-transparent'>LOGAR</button>
          </div>
        </div>

        <div id='right' className='w-75 position-relative' style={{ minWidth: '50vh' }}>
          <div className='d-flex flex-column gap-3 align-items-center'>
            <h1 className='fw-bold'>Criar Conta</h1>
            <input id='emailInput' value={username} onChange={e => setUsername(e.target.value)} required type='text' placeholder='username' className='form-control w-75'></input>
            <input id='emailInput' value={email} onChange={e => setEmail(e.target.value)} required type='email' placeholder='example@gmail.com' className='form-control w-75'></input>
            <input id='passwordInput' value={password} onChange={e => setPassword(e.target.value)} required type='password' placeholder='*******' className='form-control w-75'></input>
            <input id='confirmPasswordInput' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required type='password' placeholder='Confirme a Senha' className='form-control w-75'></input>
            <button type='submit' disabled={loading} className='border-2 shadow rounded-pill py-2 px-4 fw-semibold bg-primary text-white'>
              {loading ? 'ENTRANDO...' : 'CONTINUAR'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default RegisterForm;