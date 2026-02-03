import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

export default function TermsOfService() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const colors = {
    light: {
      background: '#F8F4F0',
      text: '#2E1B1B',
      heading: '#3E2723',
      link: '#D4A017'
    },
    dark: {
      background: '#1A1412',
      text: '#F8F4F0',
      heading: '#FCFAF8',
      link: '#D4A017'
    }
  };

  const c = colors[theme];

  return (
    <div style={{
      background: c.background,
      color: c.text,
      minHeight: '100vh',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: theme === 'light' ? '#FFFFFF' : '#2E1B1B',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: '1.5rem',
            color: c.link,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← {t('back')}
        </button>

        <h1 style={{ 
          color: c.heading, 
          marginBottom: '1.5rem',
          fontSize: '2rem'
        }}>
          Terms of Service
        </h1>

        <div style={{ lineHeight: 1.6, fontSize: '1rem' }}>
          <p><strong>Last Updated:</strong> February 3, 2026</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>1. Introduction</h2>
          <p>Welcome to Louable! These terms govern your use of our chocolate e-commerce platform ("App") accessible through the Pi Browser. By using our App, you agree to these Terms of Service.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>2. Acceptance of Terms</h2>
          <p>By accessing or using our App, you confirm that you are at least 18 years old and agree to be bound by these terms.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>3. Use of Pi Network</h2>
          <p>Our App integrates with the Pi Network Testnet for development purposes. All transactions during this phase use Test Pi, which has no monetary value. Real Pi transactions will only be enabled after proper Mainnet approval.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>4. Product Information</h2>
          <p>We strive for accuracy in product descriptions, pricing, and availability. However, we reserve the right to correct any errors and cancel orders if necessary.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>5. Payment Processing</h2>
          <p>All payments are processed through the Pi Network's secure payment system. You authorize us to process payments for your orders through your Pi Wallet.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>6. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your Pi account credentials and for all activities that occur under your account.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>7. Limitation of Liability</h2>
          <p>Our App is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>8. Changes to Terms</h2>
          <p>We may modify these terms at any time. Continued use of the App constitutes acceptance of the modified terms.</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>9. Contact Information</h2>
          <p>For questions about these terms, please contact us at: ahmedabdelmonem6815160@gmail.com</p>
          
          <h2 style={{ color: c.heading, marginTop: '1.5rem' }}>10. Governing Law</h2>
          <p>These terms are governed by the laws of Egypt.</p>
        </div>
      </div>
    </div>
  );
}