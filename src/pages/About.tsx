import { useI18n } from '../i18n/context';

export const About = () => {
  const { t } = useI18n();

  return (
    <main>
      <h1>khmer-typing</h1>
      <p>
        {t("Khmer-Typing was developed by a team working for the french NGO Passerelles Numériques (meaning 'Digital Bridges'). Our mission is to provide education, technical and professional training in the digital sector to young underprivileged people by leveraging their potential and willpower.")}
      </p>
      <a
        href="https://www.passerellesnumeriques.org/"
        rel="noopener"
        target="_blank"
      >
        <img
          src="/images/PN_Logo.jpg"
          alt="Passerelles Numeriques logo"
          style={{ height: '10vh', 'margin-top': '3%' }}
        />
      </a>
      <p>
        {t("This project was born in PN's cambodian school, as a way to facilitate the learning of khmer typing for students. In order for it to benefit to as many people as possible, we then decided to make it open source and available on Windows and Linux stores.")}
      </p>
      <hr />
      <div id="aboutLinks" style={{ 'margin-top': '3%', display: 'flex', 'flex-direction': 'column' }}>
        <a
          href="https://www.microsoft.com/store/apps/9MZTL2KK24P7"
          rel="noopener"
          target="_blank"
          style={{ margin: '1% auto' }}
        >
          Windows store
        </a>
        <a
          href="https://snapcraft.io/khmer-typing"
          rel="noopener"
          target="_blank"
          style={{ margin: '1% auto' }}
        >
          Snapraft (Linux store)
        </a>
        <a
          href="https://github.com/passerelles-numeriques/khmer-typing"
          rel="noopener"
          target="_blank"
          style={{ margin: '1% auto' }}
        >
          Github
        </a>
        <a
          href="https://www.passerellesnumeriques.org/"
          rel="noopener"
          target="_blank"
          style={{ margin: '1% auto' }}
        >
          Passerelles Numériques
        </a>
      </div>
      <hr />
      <p style={{ 'text-align': 'center' }}>
        v1.0.0
      </p>
    </main>
  );
};
