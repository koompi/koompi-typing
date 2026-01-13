import { A } from '@solidjs/router';
import { useI18n } from '../i18n/context';

export const LandingPage = () => {
  const { t } = useI18n();

  return (
    <main>
      <h1>{t('Welcome!')}</h1>
      <p>{t('Choose what you would like to do to practice Khmer typing today.')}</p>
      <br />
      <A class="button" href="/visualKeyboard">
        {t('Practise with Visual Keyboard')}
      </A>
      <br />
      <A class="button" href="/typefast">
        {t('Play Typefast game')}
      </A>
      <br />
      <hr />
      <A class="button" href="/highScores">
        {t('View high scores')}
      </A>
    </main>
  );
};
