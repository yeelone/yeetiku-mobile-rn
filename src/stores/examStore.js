import { observable ,action,computed  } from 'mobx'
import { queryByUser,create,updateScore,queryExamQuestions } from '../services/exam'

export default class ExamStore {
    @observable id  = 0
    @observable exams = observable.array([])   
    @observable currentExam = null 
    @observable currentIndex = 0  //记录用户当前打开的item 位置           
    @observable total = -1
    @observable pageSize = 10
    @observable loading = false
    @observable amount = 20  
    @observable scores = observable.map({})

    @action cleanUserExams = () => {
        this.total = -1
        this.exams = observable.array([])
    }

    @action fetchByUser = (userid ) =>{
        this.loading = true
        return queryByUser({userid,page:this.userPage, pageSize:this.pageSize}).then( (res)=>{
            if ( res.success && res.code === 10200  ) {
                this.exams = this.exams.concat([...res.body.exams])
                this.total = res.body.total
            }else{
                this.total = 0
            }
            this.loading = false
        })
    }

    @action fetchByID = (id) =>{
        this.loading = true
        return queryExamQuestions({id}).then( (res)=>{
            if ( res.success && res.code === 10200  ) {
                this.currentExam = res.body.exam
            }
            this.loading = false
        })
    }

    @action getNewExam = (userid,amount) => {
        this.loading = true
        amount = amount || 20
        return create({userid,amount}).then( (res)=>{
            if ( res.success && res.code === 10200  ) {
                // this.exams = this.exams.concat([res.body.exam])
                this.exams = [res.body.exam].concat([...this.exams])
                this.currentExam = res.body.exam
                this.total += 1
            }
            this.loading = false
        })
    }

    @action saveScore = ( id, score ) => {
        this.scores.set(id,score)
        this.loading = true
        return updateScore({id,score:parseFloat(score)}).then( (res)=>{
            if ( res.success && res.code === 10200  ) {
            }
            this.loading = false
        })
    }

    getScore = (exam_id) =>  {
       return this.scores.get(exam_id)
    }

}