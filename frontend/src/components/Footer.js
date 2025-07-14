import '../App.css';

const Footer = () => {
  return (
    <footer className='w-100 bg-light py-3 mt-auto border-top'>
      <div className='container text-center'>
        <p className='mb-0 text-muted' style={{ fontSize: '0.85rem' }}>
          FinanceApp &copy; {new Date().getFullYear()} - Desenvolvido para fins de aprendizado por Maria Eduarda P. Brito.
        </p>
      </div>
    </footer>
  );
};

export default Footer;