import UserStore from './userStore'
import BankStore from './bankStore'
import QuestionStore from './questionStore'
import FeedBackStore from './feedbackStore'
export default {
  userStore: new UserStore(),
  bankStore: new BankStore(),
  questionStore: new QuestionStore(),
  feedbackStore: new FeedBackStore(),
};
