/* @flow */

import { observable ,action,computed  } from 'mobx'
import { queryByUser,create,updateScore } from '../services/exam'

export default class ExamStore {
  @observable id: number = 0
  @observable exams = observable.array([])              
  @observable total = -1
  @observable pageSize: number = 10
  @observable loading = false

  @action cleanUserExams = () => {
    this.total = -1
    this.exams = observable.array([])
  }

    @action fetchByUser = (userid: number) =>{
        this.loading = true
        return queryByUser({userid,page:this.userPage, pageSize:this.pageSize}).then( (res)=>{
        if ( res.success && res.code === 10200  ) {
            this.exams = this.exams.concat([...res.body.exams])
            this.total = res.body.total
            console.log("this.exams", this.exams)
        }else{
            this.total = 0
        }
        this.loading = false
        })
    }
}