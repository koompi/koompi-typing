import { Router, Route } from '@solidjs/router';
import { useI18n } from './i18n/context';
import { Modal } from './components/Modal';
import { LandingPage } from './pages/LandingPage';
import { About } from './pages/About';
import { HighScores } from './pages/HighScores';
import { Typefast } from './pages/Typefast';
import { VisualKeyboard } from './pages/VisualKeyboard';
import './App.css';

function Layout(props: any) {
  const { locale, setLocale, t } = useI18n();

  const langs = ['km', 'en', 'fr'] as const;
  const languages = {
    'km': 'ខ្មែរ',
    'en': 'English',
    'fr': '​Français'
  };

  return (
    <div class="container">
      <nav>
        <div class="top-nav row">
          <div>
            <a class="nav-item" href="/">
              {t('Home')}
            </a>
            <a class="nav-item" href="/about">
              {t('About')}
            </a>
          </div>
          <div>
            <select
              value={locale()}
              onChange={(e) => setLocale(e.currentTarget.value as any)}
            >
              {langs.map((lang) => (
                <option value={lang}>
                  {languages[lang]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>
      {props.children}
      <Modal />
    </div>
  );
}

function App() {
  return (
    <Router root={Layout}>
      <Route path="/" component={LandingPage} />
      <Route path="/about" component={About} />
      <Route path="/highScores" component={HighScores} />
      <Route path="/typefast" component={Typefast} />
      <Route path="/visualKeyboard" component={VisualKeyboard} />
    </Router>
  );
}

export default App;
