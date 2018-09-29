import { removeChildNodes } from '../dom-utils.js';

class TypingTutorView {
  constructor() {
    this.learnerKeystrokesEl = null;
    this.callbacks = {};
    this.totalLength = 0;
    this.keyCorrect = 0;
    this.keyInCorrect = 0;
  }

  registerStartRoundCallback(callback) {
    this.callbacks.startRound = callback;
  }

  registerHandleKeystrokeCallback(callback) {
    this.callbacks.handleKeystroke = callback;
  }

  initDOMAndListeners() {
    this.learnerKeystrokesEl = document.querySelector('.learner-keystrokes');

    document
      .querySelector('body')
      .addEventListener('keyup', this.handleDocumentKeyUp.bind(this));

    document
      .querySelector('.btn-start-round')
      .addEventListener('click', this.handleStartRound.bind(this));
  }

  handleStartRound(evt) {
    // prevent the default behavior of button being "pressed"
    // when you type a space
    evt.target.blur();
    this.clearKeystrokes();
    this.totalLength = 0;
    this.keyCorrect = 0;
    this.keyInCorrect = 0;
    this.callbacks.startRound();
  }

  clearKeystrokes() {
    removeChildNodes(this.learnerKeystrokesEl);
  }

  announceResults() {
    this.clearKeystrokes();
    const contaier = document.querySelector('.learner-keystrokes');
    const result = document.createElement('div');
    const content = document.createTextNode(`Your results : ${Math.floor((this.keyCorrect / this.totalLength) * 100)}%`);
    result.appendChild(content);
    contaier.appendChild(result);
  }

  handleDocumentKeyUp(evt) {
    if (evt.key.length !== 1) return;
    this.callbacks.handleKeystroke(evt.key);
  }

  renderTargetText(text) {
    this.totalLength = text.length;
    document.querySelector('.target-text').innerText = text;
  }

  renderKeystroke(typedChar, targetChar) {
    const spanEl = document.createElement('SPAN');
    spanEl.innerText = typedChar;
    spanEl.className = (typedChar === targetChar) ? 'key-correct' : 'key-incorrect';
    if (typedChar === targetChar) {
      this.keyCorrect += 1;
    } else {
      this.keyInCorrect += 1;
    }
    this.learnerKeystrokesEl.appendChild(spanEl);
    if (this.totalLength === this.keyCorrect + this.keyInCorrect) {
      this.announceResults();
    }
  }
}

export default TypingTutorView;
