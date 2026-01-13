import { createSignal, Show, For } from 'solid-js';
import './Modal.css';

export type ModalButton = {
  title: string;
  default?: boolean;
  handler?: () => void;
};

export type ModalOptions = {
  title: string;
  text: string;
  buttons?: ModalButton[];
};

let showModalFn: ((options: ModalOptions) => void) | null = null;
let hideModalFn: (() => void) | null = null;

export const showModal = (options: ModalOptions) => {
  if (showModalFn) showModalFn(options);
};

export const hideModal = () => {
  if (hideModalFn) hideModalFn();
};

export const Modal = () => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [options, setOptions] = createSignal<ModalOptions>({
    title: '',
    text: '',
    buttons: []
  });

  showModalFn = (opts: ModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  hideModalFn = () => {
    setIsOpen(false);
  };

  const handleButtonClick = (button: ModalButton) => {
    if (button.handler) {
      button.handler();
    } else {
      hideModal();
    }
  };

  return (
    <Show when={isOpen()}>
      <div class="modal-overlay" onClick={() => setIsOpen(false)}>
        <div class="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{options().title}</h2>
          <p>{options().text}</p>
          <div class="modal-buttons">
            <For each={options().buttons || [{ title: 'Close', default: true }]}>
              {(button) => (
                <button
                  class={button.default ? 'default' : ''}
                  onClick={() => handleButtonClick(button)}
                >
                  {button.title}
                </button>
              )}
            </For>
          </div>
        </div>
      </div>
    </Show>
  );
};
