import UserStore from './userStore'
import BankStore from './bankStore'
import QuestionStore from './questionStore'
import FeedBackStore from './feedbackStore'
import ExamStore from './examStore'
export default {
  userStore: new UserStore(),
  bankStore: new BankStore(),
  questionStore: new QuestionStore(),
  feedbackStore: new FeedBackStore(),
  examStore: new ExamStore(),
};
