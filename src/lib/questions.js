// 25 assessment questions with weights for 5 streams
// Streams: pcm (Science-Engineering), pcb (Science-Medicine),
//          commerce, humanities, polytechnic
// Each weight is 1-5 (how strongly this answer maps to that stream)

export const questions = [
  {
    id: 1,
    text: "I enjoy solving puzzles, logic problems, and mathematical challenges.",
    weights: { pcm: 5, pcb: 2, commerce: 2, humanities: 1, polytechnic: 3 },
  },
  {
    id: 2,
    text: "I get fascinated watching how machines, engines, or gadgets work.",
    weights: { pcm: 4, pcb: 1, commerce: 1, humanities: 1, polytechnic: 5 },
  },
  {
    id: 3,
    text: "I genuinely care about people's health, illness, and wellbeing.",
    weights: { pcm: 1, pcb: 5, commerce: 1, humanities: 2, polytechnic: 1 },
  },
  {
    id: 4,
    text: "I find myself curious about how businesses make money and grow.",
    weights: { pcm: 1, pcb: 1, commerce: 5, humanities: 1, polytechnic: 1 },
  },
  {
    id: 5,
    text: "I love reading, writing stories, or debating issues with others.",
    weights: { pcm: 1, pcb: 1, commerce: 1, humanities: 5, polytechnic: 1 },
  },
  {
    id: 6,
    text: "I enjoy doing experiments, building models, or hands-on projects.",
    weights: { pcm: 3, pcb: 4, commerce: 1, humanities: 1, polytechnic: 5 },
  },
  {
    id: 7,
    text: "I like analyzing data, graphs, and finding hidden patterns.",
    weights: { pcm: 5, pcb: 3, commerce: 4, humanities: 2, polytechnic: 2 },
  },
  {
    id: 8,
    text: "I often enjoy helping friends with their personal problems or giving advice.",
    weights: { pcm: 1, pcb: 3, commerce: 2, humanities: 5, polytechnic: 1 },
  },
  {
    id: 9,
    text: "Topics like history, politics, or social movements genuinely interest me.",
    weights: { pcm: 1, pcb: 1, commerce: 2, humanities: 5, polytechnic: 1 },
  },
  {
    id: 10,
    text: "I enjoy repairing, assembling, or building things with my hands.",
    weights: { pcm: 2, pcb: 1, commerce: 1, humanities: 1, polytechnic: 5 },
  },
  {
    id: 11,
    text: "I prefer expressing myself creatively through art, music, or design.",
    weights: { pcm: 1, pcb: 1, commerce: 2, humanities: 5, polytechnic: 2 },
  },
  {
    id: 12,
    text: "Numbers and calculations feel natural and easy to me.",
    weights: { pcm: 5, pcb: 2, commerce: 4, humanities: 1, polytechnic: 2 },
  },
  {
    id: 13,
    text: "I am fascinated by nature, plants, animals, or the environment.",
    weights: { pcm: 2, pcb: 5, commerce: 1, humanities: 2, polytechnic: 1 },
  },
  {
    id: 14,
    text: "I enjoy organizing events, managing teams, or planning strategies.",
    weights: { pcm: 2, pcb: 1, commerce: 5, humanities: 3, polytechnic: 2 },
  },
  {
    id: 15,
    text: "I find the human body, its diseases, and treatments truly fascinating.",
    weights: { pcm: 1, pcb: 5, commerce: 1, humanities: 1, polytechnic: 1 },
  },
  {
    id: 16,
    text: "I enjoy coding, creating apps, or using technology to solve problems.",
    weights: { pcm: 5, pcb: 2, commerce: 3, humanities: 1, polytechnic: 4 },
  },
  {
    id: 17,
    text: "I dream about running my own business or becoming an entrepreneur.",
    weights: { pcm: 2, pcb: 1, commerce: 5, humanities: 2, polytechnic: 3 },
  },
  {
    id: 18,
    text: "I care deeply about justice, human rights, and ethical issues in society.",
    weights: { pcm: 1, pcb: 2, commerce: 2, humanities: 5, polytechnic: 1 },
  },
  {
    id: 19,
    text: "I enjoy working with electrical circuits, wiring, or mechanical tools.",
    weights: { pcm: 3, pcb: 1, commerce: 1, humanities: 1, polytechnic: 5 },
  },
  {
    id: 20,
    text: "I am naturally good at explaining complex things in a simple way.",
    weights: { pcm: 2, pcb: 3, commerce: 3, humanities: 5, polytechnic: 2 },
  },
  {
    id: 21,
    text: "I enjoy deep research projects where I investigate a topic thoroughly.",
    weights: { pcm: 4, pcb: 4, commerce: 3, humanities: 4, polytechnic: 1 },
  },
  {
    id: 22,
    text: "I prefer practical, job-ready skills over theoretical classroom learning.",
    weights: { pcm: 1, pcb: 2, commerce: 2, humanities: 1, polytechnic: 5 },
  },
  {
    id: 23,
    text: "I like managing accounts, budgets, or keeping track of finances.",
    weights: { pcm: 2, pcb: 1, commerce: 5, humanities: 1, polytechnic: 1 },
  },
  {
    id: 24,
    text: "I can picture myself working in a hospital, clinic, or medical lab.",
    weights: { pcm: 1, pcb: 5, commerce: 1, humanities: 1, polytechnic: 1 },
  },
  {
    id: 25,
    text: "I love figuring out how to make something work better or more efficiently.",
    weights: { pcm: 4, pcb: 2, commerce: 3, humanities: 2, polytechnic: 5 },
  },
];

export const RATING_LABELS = [
  { value: 1, label: "Not like me" },
  { value: 2, label: "Slightly like me" },
  { value: 3, label: "Somewhat like me" },
  { value: 4, label: "Mostly like me" },
  { value: 5, label: "Very much like me" },
];
