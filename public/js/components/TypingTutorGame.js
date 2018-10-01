import { fetchRandomQuote } from '../api-client.js';
import TypingTutorView from './TypingTutorView.js';

class TypingTutorGame {
  constructor() {
    this.isRoundInProgress = false;
    this.currentStrokeCount = -1;
    this.targetText = null;
    this.keyCorrect = 0;
    this.keyInCorrect = 0;
  }

  init() {
    this.view = new TypingTutorView();
    this.view.registerStartRoundCallback(this.startRound.bind(this));
    this.view.registerHandleKeystrokeCallback(this.handleKeyStroke.bind(this));
    this.view.initDOMAndListeners();
  }

  startRound() {
    this.isRoundInProgress = true;
    this.currentStrokeCount = -1;
    this.keyCorrect = 0;
    this.keyInCorrect = 0;
    this.targetText = null;
    this.initTargetText();
  }

  handleKeyStroke(key) {
    if (this.targetText.length - 1 === this.keyCorrect + this.keyInCorrect) {
      this.isRoundInProgress = false;
      this.view.announceResults(this.keyCorrect, this.targetText.length);
    }
    if (!this.isRoundInProgress) return;
    this.currentStrokeCount += 1;
    const targetChar = this.targetText[this.currentStrokeCount];
    if (key === targetChar) {
      this.keyCorrect += 1;
    } else {
      this.keyInCorrect += 1;
    }
    this.view.renderKeystroke(key, targetChar);
  }

  initTargetText() {
    fetchRandomQuote()
      .then((quoteText) => {
        this.view.renderTargetText(quoteText);
        this.targetText = quoteText.split('');
      });
  }
}

export default TypingTutorGame;
