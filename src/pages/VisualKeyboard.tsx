import { createSignal, onCleanup, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { useI18n } from '../i18n/context';
import { showModal, hideModal } from '../components/Modal';
import splitKhmerRunes from '../utils/split-khmer';
import { mapping } from '../assets/mapping';
import { hands } from '../assets/hands';
import { LeftHand } from '../components/LeftHand';
import { RightHand } from '../components/RightHand';
import { Keyboard } from '../components/Keyboard';
import { textsList } from '../data/texts-list';
import './VisualKeyboard.css';

interface Rune {
  id: string;
  rune: string;
  isCurrent: boolean;
  isCorrect: boolean;
  isHidden: boolean;
}

interface Letter {
  id: string;
  letter: string;
  isCurrent: boolean;
  isCorrect: boolean;
}

const initialState = () => ({
  text: '',
  seconds: 0,
  runes: [] as Rune[],
  letters: [] as Letter[],
  runesCounter: 0,
  totalRunes: 0,
  errors: 0,
  alertError: false,
  idsBreakBefore: [] as number[]
});

export const VisualKeyboard = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const [practiceLanguage, setPracticeLanguage] = createSignal<'km' | 'en'>('km');
  const [gameStarted, setGameStarted] = createSignal(false);
  const [text, setText] = createSignal('');
  const [seconds, setSeconds] = createSignal(0);
  const [runes, setRunes] = createSignal<Rune[]>([]);
  const [letters, setLetters] = createSignal<Letter[]>([]);
  const [runesCounter, setRunesCounter] = createSignal(0);
  const [totalRunes, setTotalRunes] = createSignal(0);
  const [errors, setErrors] = createSignal(0);
  const [alertError, setAlertError] = createSignal(false);
  const [idsBreakBefore, setIdsBreakBefore] = createSignal<number[]>([]);
  
  let timerInterval: number | undefined;
  let currentLetters = '';
  let listKeys: string[][] = [];

  const startGame = () => {
    setGameStarted(true);
    
    // Filter texts by selected language
    const lang = practiceLanguage();
    const availableTexts = lang === 'km' 
      ? textsList.list.filter(text => /[\u1780-\u17FF]/.test(text)) // Contains Khmer
      : textsList.list.filter(text => /[a-zA-Z]/.test(text) && !/[\u1780-\u17FF]/.test(text)); // English only
    
    // Fallback to all texts if no match
    const textsToUse = availableTexts.length > 0 ? availableTexts : textsList.list;
    const random = Math.floor(Math.random() * textsToUse.length);
    const selectedText = textsToUse[random];
    setText(selectedText);
    
    // Start timer
    if (timerInterval) clearInterval(timerInterval);
    setSeconds(0);
    timerInterval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    // Start playing
    play(selectedText);
  };

  const play = (gameText: string) => {
    // Initialization
    setRunesCounter(0);
    setErrors(0);
    currentLetters = '';
    
    const listRunes = splitKhmerRunes(gameText);
    setTotalRunes(listRunes.length);
    
    splitTextIntoSpannedRunes(gameText);
    splitRuneIntoSpannedLetters(listRunes[0]);
    
    listKeys = getAllKeys(gameText);
    
    // Initial highlights
    setRunes(prev => prev.map((r, i) => i === 0 ? {...r, isCurrent: true} : r));
    setLetters(prev => prev.map((l, i) => i === 0 ? {...l, isCurrent: true} : l));
    
    // Display first hints
    resetHints();
    nextHint(listKeys);
    
    // Create invisible input field to capture composed characters from input methods
    const hiddenInput = document.createElement('input');
    hiddenInput.id = 'hidden-input-vk';
    hiddenInput.style.position = 'absolute';
    hiddenInput.style.opacity = '0';
    hiddenInput.style.pointerEvents = 'none';
    document.body.appendChild(hiddenInput);
    hiddenInput.focus();
    
    // Listen to input event which fires after composition
    hiddenInput.oninput = (ev) => {
      const inputEl = ev.target as HTMLInputElement;
      const typedChar = inputEl.value;
      
      if (!typedChar) return;
      
      // Clear the input for next character
      inputEl.value = '';
      
      const expectedLetter = letters()[currentLetters.length]?.letter;
      
      console.log('Character typed:', typedChar, 'charCode:', typedChar.charCodeAt(0));
      console.log('Expected letter:', expectedLetter, 'charCode:', expectedLetter?.charCodeAt(0));
      
      const isCorrect = typedChar === expectedLetter || typedChar.trim() === expectedLetter?.trim();
      
      if (isCorrect) {
        currentLetters += typedChar;
        
        // Highlight correct letter
        setLetters(prev => prev.map((l, i) => 
          i === currentLetters.length - 1 ? {...l, isCurrent: false, isCorrect: true} : l
        ));
        
        // Check if grapheme completed
        const graphemes = splitKhmerRunes(currentLetters);
        const currentRuneIdx = runesCounter();
        const currentListRunes = splitKhmerRunes(text());
        
        if (graphemes[0] === currentListRunes[currentRuneIdx]) {
          // Mark rune as complete
          setRunes(prev => prev.map((r, i) => 
            i === currentRuneIdx ? {...r, isCurrent: false, isCorrect: true} : r
          ));
          
          currentLetters = '';
          setLetters([]);
          setRunesCounter(prev => prev + 1);
          
          // Display next grapheme if exists
          if (runesCounter() < currentListRunes.length) {
            splitRuneIntoSpannedLetters(currentListRunes[runesCounter()]);
          }
          
          scrollSync();
        }
        
        // Remove current action
        listKeys.shift();
        
        // Check if game won
        if (listKeys.length === 0) {
          currentLetters = '';
          endGame();
        } else {
          // Display hints for next action
          setRunes(prev => prev.map((r, i) => 
            i === runesCounter() ? {...r, isCurrent: true} : r
          ));
          setLetters(prev => prev.map((l, i) => 
            i === currentLetters.length ? {...l, isCurrent: true} : l
          ));
          resetHints();
          nextHint(listKeys);
        }
      } else {
        // Wrong character typed - works for both Khmer and English
        alertWrongKey();
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
        if (currentLetters.length > 0) {
          currentLetters = currentLetters.substring(0, currentLetters.length - 1);
          setLetters(prev => prev.map((l, i) => 
            i === currentLetters.length ? {...l, isCurrent: true} : 
            i === currentLetters.length - 1 ? {...l, isCurrent: false, isCorrect: false} : l
          ));
        }
      }
    };
  };

  const endGame = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    const secs = seconds();
    const minutes = Math.round((secs / 60) * 100) / 100;
    const newSpeed = runesCounter() / (secs / 60);
    const errorCount = errors();
    const runeCount = runesCounter();
    
    // Save highest scores
    const oldErrors = parseInt(localStorage.getItem('visualKeyboard.acc.errors') || 'Infinity');
    if (errorCount < oldErrors) {
      localStorage.setItem('visualKeyboard.acc.time', minutes.toString());
      localStorage.setItem('visualKeyboard.acc.errors', errorCount.toString());
      localStorage.setItem('visualKeyboard.acc.runes', runeCount.toString());
    }
    
    const oldMinutes = parseFloat(localStorage.getItem('visualKeyboard.speed.time') || 'Infinity');
    const oldRunes = parseInt(localStorage.getItem('visualKeyboard.speed.runes') || '0');
    const oldSpeed = oldRunes / oldMinutes;
    
    if (newSpeed > oldSpeed) {
      localStorage.setItem('visualKeyboard.speed.time', minutes.toString());
      localStorage.setItem('visualKeyboard.speed.errors', errorCount.toString());
      localStorage.setItem('visualKeyboard.speed.runes', runeCount.toString());
    }
    
    // Display results
    showModal({
      title: t('message.finishedPlaying'),
      text: t('message.scoreVisualKeyboard', { errors: errorCount, minutes }),
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
            // Reset state
            const state = initialState();
            setText(state.text);
            setSeconds(state.seconds);
            setRunes(state.runes);
            setLetters(state.letters);
            setRunesCounter(state.runesCounter);
            setTotalRunes(state.totalRunes);
            setErrors(state.errors);
            setAlertError(state.alertError);
            setIdsBreakBefore(state.idsBreakBefore);
            startGame();
          }
        }
      ]
    });
  };

  const splitTextIntoSpannedRunes = (text: string) => {
    const graphemes = splitKhmerRunes(text);
    const newRunes: Rune[] = [];
    
    for (let i = 0; i < graphemes.length; i++) {
      newRunes.push({
        id: `rune-${i}`,
        rune: graphemes[i],
        isCurrent: false,
        isCorrect: false,
        isHidden: false
      });
    }
    
    setRunes(newRunes);
  };

  const splitRuneIntoSpannedLetters = (rune: string) => {
    const letterArray = rune.split('');
    const newLetters: Letter[] = [];
    
    for (let i = 0; i < letterArray.length; i++) {
      let letter = letterArray[i];
      if (letter === '្') {
        letter = ' ្';
      }
      newLetters.push({
        id: `letter-${i}`,
        letter,
        isCurrent: false,
        isCorrect: false
      });
    }
    
    setLetters(newLetters);
  };

  const getRunesIdsBreakBefore = () => {
    const idBreakBefore: number[] = [];
    const runeElements = document.getElementsByClassName('runes');
    
    for (let i = 0; i < runeElements.length; i++) {
      const current = runeElements[i] as HTMLElement;
      const prev = runeElements[i - 1] as HTMLElement;
      
      if (!prev || current.offsetLeft < prev.offsetLeft) {
        idBreakBefore.push(i);
      }
    }
    
    return idBreakBefore;
  };

  const scrollSync = () => {
    const counter = runesCounter();
    if (idsBreakBefore().includes(counter)) {
      setRunes(prev => prev.map((r, i) => 
        i < counter ? {...r, isHidden: true} : r
      ));
    }
  };

  const getAllKeys = (text: string): string[][] => {
    const listKeys: string[][] = [];
    
    for (let i = 0; i < text.length; i++) {
      const letter = text.substring(i, i + 1);
      const keys = mapping[letter];
      
      if (keys === undefined) {
        console.log('Mapping undefined: ' + letter);
      } else {
        listKeys.push(keys);
      }
    }
    
    return listKeys;
  };

  const alertWrongKey = () => {
    setAlertError(true);
    setTimeout(() => {
      setAlertError(false);
    }, 500);
    setErrors(prev => prev + 1);
  };

  const nextHint = (listKeys: string[][]) => {
    const currentKeys = listKeys[0];
    const currentFingers: string[] = [];
    
    for (let j = 0; j < currentKeys.length; j++) {
      currentFingers.push(hands[currentKeys[j]]);
    }
    
    const color = '#ffab40';
    
    for (let i = 0; i < currentFingers.length; i++) {
      const finger = currentFingers[i];
      const key = currentKeys[i];
      
      if (key === 'SPACE') {
        const leftHand = document.getElementById('leftHand');
        const rightHand = document.getElementById('rightHand');
        leftHand?.querySelector('#left-finger-1')?.setAttribute('fill', color);
        rightHand?.querySelector('#right-finger-1')?.setAttribute('fill', color);
      } else {
        const hand = finger.split('-')[0];
        const handElement = document.getElementById(hand + 'Hand');
        handElement?.querySelector('#' + finger)?.setAttribute('fill', color);
      }
      
      const keyboard = document.getElementById('keyboard');
      keyboard?.querySelector('#' + key)?.setAttribute('fill', color);
    }
  };

  const resetHints = () => {
    const keys = Object.keys(hands);
    const fingers = ['right-finger-1', 'left-finger-1', 'right-finger-2', 'left-finger-2', 
                     'right-finger-3', 'left-finger-3', 'right-finger-4', 'left-finger-4', 
                     'right-finger-5', 'left-finger-5'];
    const greyKeys = ['BACKSPACE', 'MENU', 'FN', 'WINDOWS', 'path5784', 'SPACE', 'ALT_GR', 
                      'ENTER', 'RIGHT_SHIFT', 'RIGHT_CTRL', 'ALT', 'TAB', 'CAPS_LOCK', 
                      'LEFT_SHIFT', 'LEFT_CTRL'];
    
    // Reset fingers
    for (const finger of fingers) {
      const hand = finger.split('-')[0];
      const handElement = document.getElementById(hand + 'Hand');
      handElement?.querySelector('#' + finger)?.setAttribute('fill', 'none');
    }
    
    const svgKeyboard = document.getElementById('keyboard');
    
    // Reset normal keys
    for (const key of keys) {
      svgKeyboard?.querySelector('#' + key)?.setAttribute('fill', 'white');
    }
    
    // Reset grey keys
    for (const key of greyKeys) {
      svgKeyboard?.querySelector('#' + key)?.setAttribute('fill', '#C1C0C0');
    }
  };

  onMount(() => {
    // Update break points when DOM changes
    const updateBreakPoints = () => {
      if (gameStarted()) {
        setIdsBreakBefore(getRunesIdsBreakBefore());
      }
    };
    
    // Use MutationObserver to detect DOM changes
    const observer = new MutationObserver(updateBreakPoints);
    const textWrap = document.getElementById('textWrap-vk');
    
    if (textWrap) {
      observer.observe(textWrap, { childList: true, subtree: true, attributes: true });
    }
    
    onCleanup(() => observer.disconnect());
  });

  onCleanup(() => {
    document.onkeydown = null;
    const hiddenInput = document.getElementById('hidden-input-vk');
    if (hiddenInput) {
      hiddenInput.remove();
    }
    if (timerInterval) clearInterval(timerInterval);
  });

  return (
    <main>
      <h1>{t('Visual Keyboard')}</h1>
      <p>{t('Write the whole text as fast as you can with as few mistakes as possible')}</p>
      
      <Show when={!gameStarted()}>
        <div class="language-selector-wrapper">
          <label>{t('Practice language')}:</label>
          <select 
            value={practiceLanguage()}
            onInput={(e) => setPracticeLanguage(e.currentTarget.value as 'km' | 'en')}
          >
            <option value="km">ខ្មែរ (Khmer)</option>
            <option value="en">English</option>
          </select>
        </div>
        <button id="cmdTyping-vk" onClick={startGame}>
          {t('Start')}
        </button>
      </Show>
      
      <Show when={gameStarted()}>
        <div id="gameWrap-vk">
          <div class="row">
            <div class="runesWrap">
              <strong>{runesCounter()}</strong> / {totalRunes()}
            </div>
            <div class="errorsWrap">
              <strong class={alertError() ? 'error' : ''}>{errors()}</strong> errors
            </div>
          </div>
          
          <div id="textWrap-vk" class={alertError() ? 'error-bg' : ''}>
            <h2 id="text-vk">
              <For each={runes()}>
                {(rune) => (
                  <span
                    class={`runes ${rune.isCurrent ? 'current' : ''} ${rune.isCorrect ? 'correct' : ''} ${rune.isHidden ? 'hidden' : ''}`}
                    id={rune.id}
                  >
                    {rune.rune}
                  </span>
                )}
              </For>
            </h2>
          </div>
          
          <div>
            <h4 id="decomposition-vk">
              <span>​</span>
              <For each={letters()}>
                {(letter) => (
                  <span
                    class={`${letter.isCurrent ? 'current' : ''} ${letter.isCorrect ? 'correct' : ''}`}
                    id={letter.id}
                  >
                    {letter.letter}
                  </span>
                )}
              </For>
            </h4>
          </div>
          
          <div id="handsAndKeyboardWrap-vk">
            <div class="row">
              <div id="leftHand">
                <LeftHand />
              </div>
              <div id="keyboard">
                <Keyboard />
              </div>
              <div id="rightHand">
                <RightHand />
              </div>
            </div>
          </div>
        </div>
      </Show>
    </main>
  );
};
