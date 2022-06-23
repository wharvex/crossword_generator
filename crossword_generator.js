const table = document.querySelector("table");
const form = document.querySelector("form");
const colorsButton = document.querySelector("#colorsButton");
const vegetablesButton = document.querySelector("#vegetablesButton");
const birdsButton = document.querySelector("#birdsButton");
const matchesBox = document.querySelector("#matchesBox");
const matchesButton = document.querySelector("#matchesButton");
const organizeButton = document.querySelector("#organizeButton");
const wordBankBox = document.querySelector("#wordBankBox");
const wordBankDisplay = document.querySelector("#wordBankDisplay");
const tableBox = document.querySelector("#tableBox");
const answers = [];
const commonalities = [];
const colors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "lavender",
  "mauve",
  "saffron",
  "cerulean",
  "chartreuse",
  "crimson",
  "scarlet",
  "gold",
];
const vegetables = [
  "cucumber",
  "lettuce",
  "spinach",
  "carrot",
  "kale",
  "broccoli",
  "asparagus",
  "zucchini",
  "legume",
  "artichoke",
  "cabbage",
  "radish",
  "rhubarb",
  "pepper",
  "yam",
  "potato",
];
const birds = [
  "robin",
  "grackle",
  "tucan",
  "parrot",
  "chickadee",
  "cardinal",
  "kiwi",
  "halcyon",
  "penguin",
  "ostrich",
  "emu",
  "starling",
  "bluejay",
  "kingfisher",
  "eagle",
  "hawk",
  "dove",
  "pigeon",
  "seagull",
  "goose",
];
const goodCellsContents = [" ", undefined];

class Commonality {
  constructor(w1, w1p, w2, w2p, l) {
    this.word1 = w1;
    this.word1Position = w1p;
    this.word2 = w2;
    this.word2Position = w2p;
    this.letter = l;
  }
}

class Answer {
  constructor(w) {
    this.word = w;
    this.matches = [];
  }
}

class Match {
  constructor(matchWord, answerPosition, matchPosition, letter) {
    this.matchWord = matchWord;
    this.answerPosition = answerPosition;
    this.matchPosition = matchPosition;
    this.letter = letter;
  }
}

class PrintedWord {
  constructor(word, matches, startRow, startCol, isAcross = false) {
    this.word = word;
    this.matches = matches;
    this.matchesMade = [];
    this.startRow = startRow;
    this.startCol = startCol;
    this.isAcross = isAcross;
  }
}

function createTD(row, letter = String.fromCharCode(160)) {
  const newTD = document.createElement("td");
  newTD.innerText = letter;
  row.appendChild(newTD);
}

function updateWordBank(word) {
  const answer = new Answer(word);
  answers.push(answer);
  const row = document.createElement("tr");
  for (let letter of word) {
    createTD(row, letter);
  }
  wordBankDisplay.appendChild(row);
}

function updateWordLists(
  answersOptions,
  printedWords,
  word,
  startRow,
  startCol,
  matchMade,
  isAcross = false
) {
  answersOptions.splice(answersOptions.indexOf(word), 1);
  const wordInAnswers = answers.filter((a) => a.word === word);
  const printedWord = new PrintedWord(
    word,
    wordInAnswers[0].matches,
    startRow,
    startCol,
    isAcross
  );
  printedWord.matchesMade.push(matchMade);
  printedWords.push(printedWord);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const answerInput = form.elements.answer.value;
  updateWordBank(answerInput);
  form.elements.answer.value = "";
});

colorsButton.addEventListener("click", () => {
  for (let color of colors) {
    updateWordBank(color);
  }
});

vegetablesButton.addEventListener("click", () => {
  for (let veg of vegetables) {
    updateWordBank(veg);
  }
});

birdsButton.addEventListener("click", () => {
  for (let bird of birds) {
    updateWordBank(bird);
  }
});

matchesButton.addEventListener("click", (e) => {
  while (commonalities.length) commonalities.pop();
  for (let answer of answers) {
    while (answer.matches.length) answer.matches.pop();
  }
  for (let i = 0; i < answers.length; i++) {
    for (let j = 0; j < answers[i].word.length; j++) {
      for (let k = i + 1; k < answers.length; k++) {
        for (let l = 0; l < answers[k].word.length; l++) {
          if (answers[i].word[j] === answers[k].word[l]) {
            const commonality = new Commonality(
              answers[i].word,
              j,
              answers[k].word,
              l,
              answers[i].word[j]
            );
            commonalities.push(commonality);
            const match1 = new Match(answers[k].word, j, l, answers[i].word[j]);
            answers[i].matches.push(match1);
            const match2 = new Match(answers[i].word, l, j, answers[i].word[j]);
            answers[k].matches.push(match2);
          }
        }
      }
    }
  }
  matchesBox.innerHTML = "";
  for (let comm of commonalities) {
    const newCommDisplay = document.createElement("p");
    newCommDisplay.innerText = `ltr ${comm.word1Position + 1} of ${
      comm.word1
    } = ltr ${comm.word2Position + 1} of ${comm.word2}`;
    matchesBox.appendChild(newCommDisplay);
  }
});

organizeButton.addEventListener("click", () => {
  for (let answer of answers) {
    for (let match of answer.matches) {
      const newTable = document.createElement("table");
      const answersOptions = answers.map((a) => a.word);
      const printedWords = [];
      //Match Word (Down)
      for (let letter of match.matchWord) {
        const newRow = document.createElement("tr");
        for (let i = 0; i < match.answerPosition; i++) {
          createTD(newRow);
        }
        createTD(newRow, letter);
        newTable.appendChild(newRow);
      }
      updateWordLists(
        answersOptions,
        printedWords,
        match.matchWord,
        0,
        match.answerPosition,
        match.matchPosition
      );
      //Answer Word (Across)
      const targetRow = newTable.children[match.matchPosition];
      for (let i = 0; i <= match.answerPosition; i++) {
        targetRow.children[i].innerText = answer.word[i];
      }
      for (let i = match.answerPosition + 1; i < answer.word.length; i++) {
        createTD(targetRow, answer.word[i]);
      }
      updateWordLists(
        answersOptions,
        printedWords,
        answer.word,
        match.matchPosition,
        0,
        match.answerPosition,
        true
      );
      //Beyond the first two
      for (let printedWord of printedWords) {
        for (let match of printedWord.matches) {
          if (
            !answersOptions.includes(match.matchWord) ||
            printedWord.matchesMade.includes(match.answerPosition)
          )
            continue;
          if (printedWord.isAcross) {
            //DOWN
            //Setting start positions
            const matchCol = printedWord.startCol + match.answerPosition;
            let matchStartRow = printedWord.startRow - match.matchPosition;
            //Checking for unwanted intersections or adjacencies by cell
            //Defining variables for the check loop (to allow for negative startRow)
            let checkRow = matchStartRow;
            let checkLength = match.matchWord.length;
            let checkLetter = 0;
            if (matchStartRow < 0) {
              checkRow = 0;
              checkLength = match.matchWord.length + matchStartRow;
              checkLetter = Math.abs(matchStartRow);
            }
            //Pre- and post-word check
            const checkPreWord =
              newTable.children[checkRow - 1]?.children[matchCol]?.innerText;
            const checkPostWord =
              newTable.children[checkRow + checkLength]?.children[matchCol]
                ?.innerText;
            const goodPreWordBool = goodCellsContents.includes(checkPreWord);
            const goodPostWordBool = goodCellsContents.includes(checkPostWord);
            if (!goodPreWordBool || !goodPostWordBool) continue;
            //The cell check loop
            let continueBool = false;
            for (let i = 0; i < checkLength; i++) {
              const checkCells = [
                newTable.children[checkRow + i]?.children[matchCol + 1]
                  ?.innerText,
                newTable.children[checkRow + i]?.children[matchCol - 1]
                  ?.innerText,
              ];
              const goodCellsBool = checkCells.every((cell) =>
                goodCellsContents.includes(cell)
              );
              const checkCell =
                newTable.children[checkRow + i]?.children[matchCol]?.innerText;
              goodCellsContents.push(match.matchWord[checkLetter]);
              const goodCellBool = goodCellsContents.includes(checkCell);
              goodCellsContents.pop();
              if (
                !goodCellBool ||
                (checkCell !== match.matchWord[checkLetter] && !goodCellsBool)
              ) {
                continueBool = true;
                break;
              }
              checkLetter++;
            }
            if (continueBool) continue;
            //If new rows above are needed
            let h = 0;
            if (matchStartRow < 0) {
              for (let i = matchStartRow; i < 0; i++) {
                const newRowAbove = newTable.insertRow(h);
                for (let j = 0; j < matchCol; j++) {
                  createTD(newRowAbove);
                }
                createTD(newRowAbove, match.matchWord[h]);
                h++;
              }
              //Updating row logs of previously printed words
              for (let word of printedWords) {
                word.startRow = word.startRow + h;
              }
              matchStartRow = 0;
            }
            //Printing proper
            for (let i = h; i < match.matchWord.length; i++) {
              const targetRow = newTable.children[matchStartRow + i];
              //If new rows below are needed
              if (!targetRow) {
                const newRowBelow = document.createElement("tr");
                for (let j = 0; j < matchCol; j++) {
                  createTD(newRowBelow);
                }
                createTD(newRowBelow, match.matchWord[i]);
                newTable.appendChild(newRowBelow);
              } else {
                //Normal printing
                const targetTD = targetRow.children[matchCol];
                if (targetTD) {
                  targetTD.innerText = match.matchWord[i];
                } else {
                  for (let j = 0; j < matchCol; j++) {
                    while (targetRow.children[j]) j++;
                    if (j < matchCol) createTD(targetRow);
                  }
                  createTD(targetRow, match.matchWord[i]);
                }
              }
            }
            //Updating printedWords and answersOptions
            printedWord.matchesMade.push(match.answerPosition);
            updateWordLists(
              answersOptions,
              printedWords,
              match.matchWord,
              matchStartRow,
              matchCol,
              match.matchPosition
            );
          } else {
            //ACROSS
            //Setting start positions
            const matchRow = printedWord.startRow + match.answerPosition;
            let matchStartCol = printedWord.startCol - match.matchPosition;
            //Checking for unwanted intersections or adjacencies by cell
            //Defining variables for the check loop (to allow for negative startCol)
            let checkCol = matchStartCol;
            let checkLength = match.matchWord.length;
            let checkLetter = 0;
            if (matchStartCol < 0) {
              checkCol = 0;
              checkLength = match.matchWord.length + matchStartCol;
              checkLetter = Math.abs(matchStartCol);
            }
            //Post-word check
            const checkPostWord =
              newTable.children[matchRow].children[checkCol + checkLength] &&
              newTable.children[matchRow].children[checkCol + checkLength]
                .innerText;
            const goodPostWordBool = goodCellsContents.includes(checkPostWord);
            if (!goodPostWordBool) continue;
            //The cell check loop
            let continueBool = false;
            for (let i = 0; i < checkLength; i++) {
              const checkCells = [
                newTable.children[matchRow + 1]?.children[checkCol + i]
                  ?.innerText,
                newTable.children[matchRow - 1]?.children[checkCol + i]
                  ?.innerText,
              ];
              const goodCellsBool = checkCells.every((cell) =>
                goodCellsContents.includes(cell)
              );
              const checkCell =
                newTable.children[matchRow].children[checkCol + i]?.innerText;
              goodCellsContents.push(match.matchWord[checkLetter]);
              const goodCellBool = goodCellsContents.includes(checkCell);
              goodCellsContents.pop();
              if (
                !goodCellBool ||
                (checkCell !== match.matchWord[checkLetter] && !goodCellsBool)
              ) {
                continueBool = true;
                break;
              }
              checkLetter++;
            }
            if (continueBool) continue;
            //If new cells to the left are needed
            let g = 0;
            if (matchStartCol < 0) {
              g = Math.abs(matchStartCol);
              for (let child of newTable.children) {
                let h = 0;
                for (let i = matchStartCol; i < 0; i++) {
                  child.insertCell(h);
                  h++;
                }
              }
              for (let i = 0; i < g; i++) {
                newTable.children[matchRow].children[i].innerText =
                  match.matchWord[i];
              }
              for (let word of printedWords) {
                word.startCol = word.startCol + g;
              }
              matchStartCol = 0;
            }
            //Printing proper
            for (let i = g; i < match.matchWord.length; i++) {
              const targetTD =
                newTable.children[matchRow].children[matchStartCol + i];
              if (targetTD) {
                targetTD.innerText = match.matchWord[i];
              } else {
                createTD(newTable.children[matchRow], match.matchWord[i]);
              }
            }
            //Updating printedWords and answersOptions
            printedWord.matchesMade.push(match.answerPosition);
            updateWordLists(
              answersOptions,
              printedWords,
              match.matchWord,
              matchRow,
              matchStartCol,
              match.matchPosition,
              true
            );
          }
        }
      }
      if (printedWords.length === answers.length) {
        tableBox.appendChild(newTable);
      }
    }
  }
});
