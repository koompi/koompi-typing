import { createSignal, onCleanup, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useI18n } from '../i18n/context';
import { showModal, hideModal } from '../components/Modal';
import splitKhmerRunes from '../utils/split-khmer';
import { wordsList } from '../data/words-list';
import './Typefast.css';

export const Typefast = () => {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  
  const [practiceLanguage, setPracticeLanguage] = createSignal<'km' | 'en'>('km');
  const [score, setScore] = createSignal(0);
  const [seconds, setSeconds] = createSignal(0);
  const [spans, setSpans] = createSignal<string[]>([]);
  const [buffer, setBuffer] = createSignal('');
  
  let timerInterval: number | undefined;

  const startGame = () => {
    setSeconds(60);
    setScore(0);
    setBuffer('');
    
    // Start the timer
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      setSeconds(prev => {
        const newSeconds = prev - 1;
        if (newSeconds === 0) {
          clearInterval(timerInterval);
          endGame();
        }
        return newSeconds;
      });
    }, 1000);
    
    // Set the first word
    random();
    
    // Create invisible input field to capture composed characters from input methods
    const hiddenInput = document.createElement('input');
    hiddenInput.id = 'hidden-input-tf';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    hiddenInput.style.pointerEvents = 'none';
    document.body.appendChild(hiddenInput);
    hiddenInput.focus();
    
    // Listen to input event which fires after composition
    hiddenInput.oninput = (ev) => {
      const inputEl = ev.target as HTMLInputElement;
      const typed = inputEl.value;
      
      if (!typed) return;
      
      // Clear the input for next character
      inputEl.value = '';
      
      const newBuffer = buffer() + typed;
      const graphemes = splitKhmerRunes(newBuffer);
      const lastGrapheme = graphemes[graphemes.length - 1];
      setBuffer(lastGrapheme);
      
      // Check all span elements
      const spanElements = document.getElementsByClassName('spans');
      for (let i = 0; i < spanElements.length; i++) {
        const spanText = spanElements[i].innerHTML;
        if (spanText === typed || spanText === lastGrapheme) {
          if (spanElements[i].classList.contains('bg')) {
            continue;
          } else if (!spanElements[i].classList.contains('bg') && 
                     (i === 0 || spanElements[i - 1]?.classList.contains('bg'))) {
            spanElements[i].classList.add('bg');
            break;
          }
        }
      }
      
      // Check if the player has typed all letters of the word
      let checker = 0;
      for (let j = 0; j < spanElements.length; j++) {
        if (spanElements[j].className === 'spans bg') {
          checker++;
        }
        
        if (checker === spanElements.length && lastGrapheme === spanElements[j].innerHTML) {
          setScore(prev => prev + 1);
          document.getElementsByClassName('words')[0]?.classList.add('fadeout');
          
          setTimeout(() => {
            setBuffer('');
            // Reset spans classes
            for (let k = 0; k < spanElements.length; k++) {
              spanElements[k].className = 'spans';
            }
            random();
            document.getElementsByClassName('words')[0]?.classList.remove('fadeout');
          }, 200);
        }
      }
    };
    
    // Keep input focused
    hiddenInput.onblur = () => {
      setTimeout(() => hiddenInput.focus(), 0);
    };
    
    // Backspace/Delete handler
    document.onkeydown = (e: KeyboardEvent) => {
      if (e.keyCode === 8 || e.keyCode === 46) {
        e.preventDefault();
        setBuffer(prev => prev.substring(0, prev.length - 1));
      }
    };
  };

  const endGame = () => {
    // Remove hidden input
    const hiddenInput = document.getElementById('hidden-input-tf');
    if (hiddenInput) {
      hiddenInput.remove();
    }
    document.onkeydown = null;
    
    // Store highest score
    const previousHighest = parseInt(localStorage.getItem('typefast.score') || '0');
    if (score() > previousHighest) {
      localStorage.setItem('typefast.score', score().toString());
    }
    
    // Display end modal
    showModal({
      title: t('message.finishedPlaying'),
      text: t('message.scoreTypeFast', { score: score() }),
      buttons: [
        {
          title: t('Home'),
          handler: () => {
            hideModal();
            navigate('/');
          }
        },
        {
          title: t('High scores'),
          handler: () => {
            hideModal();
            navigate('/highScores');
          }
        },
        {
          title: t('Play again'),
          default: true,
          handler: () => {
            hideModal();
            setScore(0);
            setSeconds(0);
            setSpans([]);
            setBuffer('');
            startGame();
          }
        }
      ]
    });
  };

  const random = () => {
    // Use practice language instead of UI locale
    const lang = practiceLanguage();
    let list = wordsList[lang] || wordsList.km;
    
    // If no words for selected language, fallback
    if (!list || list.length === 0) {
      list = wordsList.km;
    }
    
    const randomIndex = Math.floor(Math.random() * list.length);
    const word = list[randomIndex];
    const graphemes = splitKhmerRunes(word);
    setSpans(graphemes);
  };

  onCleanup(() => {
    const hiddenInput = document.getElementById('hidden-input-tf');
    if (hiddenInput) {
      hiddenInput.remove();
    }
    document.onkeydown = null;
    if (timerInterval) clearInterval(timerInterval);
  });

  return (
    <main>
      <h1>{t('Typing game')}</h1>
      <p>{t('Type as many words as you can until time runs out!')}</p>
      
      <Show when={seconds() === 0}>
        <div style="margin-bottom: 20px;">
          <label style="margin-right: 10px; font-size: 1.2em;">{t('Practice language')}:</label>
          <select 
            value={practiceLanguage()} 
            onChange={(e) => setPracticeLanguage(e.currentTarget.value as 'km' | 'en')}
            style="font-size: 1.1em; padding: 5px 10px;"
          >
            <option value="km">ខ្មែរ (Khmer)</option>
            <option value="en">English</option>
          </select>
        </div>
        <button onClick={startGame}>
          {t('Start')}
        </button>
      </Show>
      
      <Show when={seconds() > 0}>
        <div class="outerWrap">
          <div class="scoreWrap">
            <p>{t('Score')}</p>
            <span class="score">{score()}</span>
          </div>
          <div class="timeWrap">
            <p>{t('Time left')}</p>
            <span class="time">{seconds()}</span>
          </div>
        </div>
        
        <div class="wordsWrap">
          <p class="words">
            <For each={spans()}>
              {(span) => <span class="spans">{span}</span>}
            </For>
          </p>
        </div>
        
        <h3 class="buffer-title">
          {t('What you are typing:')}
        </h3>
        <div class="buffer">
          {buffer()}
        </div>
      </Show>
    </main>
  );
};
