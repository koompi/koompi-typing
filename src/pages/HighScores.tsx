import { useI18n } from '../i18n/context';
import { Show } from 'solid-js';

export const HighScores = () => {
  const { t } = useI18n();

  const vkaErrors = localStorage.getItem('visualKeyboard.acc.errors');
  const vkaTime = localStorage.getItem('visualKeyboard.acc.time');
  const vkaRunes = localStorage.getItem('visualKeyboard.acc.runes');
  const vksErrors = localStorage.getItem('visualKeyboard.speed.errors');
  const vksTime = localStorage.getItem('visualKeyboard.speed.time');
  const vksRunes = localStorage.getItem('visualKeyboard.speed.runes');
  const tfScore = localStorage.getItem('typefast.score');

  return (
    <main>
      <h1>{t('highScores.title')}</h1>
      <p>{t('highScores.description')}</p>
      <br />
      <hr />
      <h2>{t('Visual Keyboard')}</h2>
      <Show
        when={vkaErrors}
        fallback={<p>{t('highScores.notPlayed')}</p>}
      >
        <p>
          <strong>{t('highScores.accuracy')}</strong>
          {t('highScores.visualKeyboard', { runes: vkaRunes, time: vkaTime, errors: vkaErrors })}
        </p>
        <p>
          <strong>{t('highScores.speed')}</strong>
          {t('highScores.visualKeyboard', { runes: vksRunes, time: vksTime, errors: vksErrors })}
        </p>
      </Show>
      <hr />
      <h2>{t('Typing game')}</h2>
      <Show
        when={tfScore}
        fallback={<p>{t('highScores.notPlayed')}</p>}
      >
        <p>{t('highScores.typefast', { score: tfScore })}</p>
      </Show>
    </main>
  );
};
