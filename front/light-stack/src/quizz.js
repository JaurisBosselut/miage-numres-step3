import { evaluate, getAnswers, getProposalApi, getQuestionsApi, saveAnswer } from './store.js';
import './style.css';

export let quizzData;
export let currentQuestion;
export let score;
let questionElement;
let proposalsElement;

export function initQuizz(questions) {
  quizzData = [];
  localStorage.clear();
  
  questionElement = document.getElementById("question");
  proposalsElement = document.getElementById("proposals");
    
  currentQuestion = 0;
  score = 0;

  showQuestion();
}
  
async function showQuestion() {
  quizzData = await getQuestionsApi();

  const proposalsPromises = quizzData.map(question =>
    getProposalApi(question.id)
  );

  const allProposals = await Promise.all(proposalsPromises);

  quizzData = quizzData.map((question, index) => ({
    ...question,
    proposals: allProposals[index]
  }));

  const question = quizzData[currentQuestion];
  questionElement.innerText = question.label;

  proposalsElement.innerHTML = "";

  question.proposals.forEach(proposal => {
    const button = document.createElement("button");
    button.innerText = proposal.label;
    button.addEventListener("click", selectAnswer);
    proposalsElement.appendChild(button);
  });
}

  
async function selectAnswer(e) {
  const selectedButton = e.target;
  let proposals = quizzData[currentQuestion].proposals;

  let chosedProposal = [];
  for (let i = 0; i < proposals.length; i++) {
      
    if (selectedButton.innerText === proposals[i].label) {
      chosedProposal.push(proposals[i]);
    }
  }

  let point = await evaluate(chosedProposal);

  score = score + point;
  
  currentQuestion++;
  
  if (currentQuestion < quizzData.length) {
    showQuestion();
  } else {
    showResult();
  }
}
  
async function showResult() {
  quiz.innerHTML = `
    <h1>Quizz Fini!</h1>
    <p>Ton score: ${score}/${quizzData.length}</p>
  `;
}