const mapping: Record<string, string> = {
  answers: 'answer',
  options: 'option',
  questions: 'question',
  quizzes: 'quiz',
  schools: 'school',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
