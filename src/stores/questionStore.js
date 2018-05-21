/* @flow */

// import axios from 'axios'
import { observable ,action,toJS } from 'mobx'
import { query,addFavorites,removeFavorites,queryFavoritesStatusByUserID,queryUserFavorites,
  queryUserWrong,queryComments,queryChildComments,createComments,userLikeComment,userDislikeComment } from '../services/questions'
import { queryRelatedQuestions } from '../services/banks'
import { queryExamQuestions } from '../services/exam'
import { saveRecords } from '../services/users'

export default class QuestionStore {
  @observable id: number = 0
  @observable questions = []
  @observable current: number = 0  //记录用户当前打开的item 位置
  @observable total: number = 0    // 题目总数量
  @observable commentTotal: number = 0 
  @observable page: number = 1
  @observable pageSize: number = 10
  @observable commentPage: number = 1
  @observable childCommentPage: number = 1
  @observable commentPageSize: number = 10
  @observable bankID: number = 0
  @observable answers = observable.map({})  // {question_id,answer}
  @observable favorites = observable.map({})  //
  @observable comments = observable.map({})  //
  @observable currentIsFavorites = false
  @observable last = 0 //记录上次做的最后一题的编号
  @observable loading = false
  @observable commentLoading = false
  @observable childCommentLoading = false
  @observable addFavLoading = false

  constructor(){
    this.record_history = []   //记录做过的题 {id, result}
  }

  insertHistoryRecord = (result) => {
    let id = this.questions[this.current].id
    this.record_history.push({id,result})
  }

  //这里有个逻辑，当点击下一题时，将向服务器请求加载下面pageSize指定数量的题目，添加在this.questions 的尾部，而如果是 点击 上一题，且小于
  //起始题（起始题即上次记录的最后练习的题），则加载上面pageSize指定数量的题目，并添加在this.questions的头部。
  @action getByBankID = (bank_id: number) => {
    let pageSize = this.pageSize
    let isNext = true
    if ( this.current < 0 ) { //当current为负数时,表示正在获取上一题,此时要做一些特殊的处理

      //当last小于pageSize时，此时向服务器请求数据时，就只请求last的数据就行。
      //比如说，上次做到第8题，那么， 8 < this.pageSize ,此时只需要向服务器请求 上次做过的（ 8 -1 ） 道题就可以。

      if ( this.last < pageSize ) {
        this.current = this.current + this.last //向右移动几个单位
        pageSize = this.last
        this.last = 0
      }else {
        this.last = this.last - pageSize
        this.current = this.current + pageSize
      }
      this.page = 1                           //必须将page重新设置为起始值 1
      //current表示的是在this.questions数组中的下标值 ，当在数组头部插入数组时，就必须将current往后移
      isNext = false
    }
    this.loading = true
    return queryRelatedQuestions({id:bank_id, start:this.last, page:this.page, pageSize }).then(action( (res)=>{
      this.bankID = bank_id
      if ( res.success && res.code === 10200  ) {
        if ( isNext ) {
          this.questions = this.questions.concat([...res.body.questions])
        }else {
          this.questions = res.body.questions.concat([...this.questions])
        }
        this.page = this.page + 1
        this.total = res.body.total
      }

      this.loading = false
    }) )
  }

  @action fetchFavorites = (user_id: number) => {
    this.loading = true
    queryUserFavorites({user_id, page:this.page, pageSize:this.pageSize }).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.questions = this.questions.concat([...res.body.questions])
        this.page = this.page + 1
        this.total = res.body.total
      }
      this.loading = false
    }) )
  }

  @action fetchWrong = (user_id: number,bank_id: number) => {
    this.loading = true
    bank_id = bank_id || 0 
    queryUserWrong({user_id,bank_id, page:this.page, pageSize:this.pageSize }).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.questions = this.questions.concat([...res.body.questions])
        this.page = this.page + 1
        this.total = res.body.total
      }
      this.loading = false
    }) )
  }

  @action likeByUser = (comment_id , user_id: number) =>{
    userLikeComment({id:comment_id,user_id}).then(action((res) => {
      if ( res.success && res.code === 10200  ) {
      }
    }))
  }

  @action dislikeByUser = (comment_id ,user_id:number)=>{
    userDislikeComment({id:comment_id,user_id}).then(action((res) => {
      if ( res.success && res.code === 10200  ) {
      }
    }))
  }

  mergeComments = (list) => {
    for (let i=0; i< list.length;i++ ){
      let item = list[i]
      let parent = item.parent
      item['username'] =" item.user.nickname "
      item['avatar'] = "http://www.qqzhi.com/uploadpic/2015-01-03/210127119.jpg"
      if ( !this.comments.has(parent)){
        this.comments.set(parent,[])
      }
      this.comments.set(parent,[...this.comments.get(parent) ,item])
  }
  }

  @action fetchComments = async (id: number) => {
    if (this.commentLoading){
      return 
    }
    this.commentLoading = true
    queryComments({id, page:this.commentPage, pageSize:this.commentPageSize }).then(action( (res)=>{
      
      if ( res.success && res.code === 10200  ) {
        this.mergeComments(res.body.comments)

      //   for (let i=0; i< res.body.comments.length;i++ ){
      //     let item = res.body.comments[i]
      //     let parent = item.parent
      //     item['username'] =" item.user.nickname "
      //     item['avatar'] = "http://www.qqzhi.com/uploadpic/2015-01-03/210127119.jpg"
      //     if ( !this.comments.hasOwnProperty(parent)){
      //       this.comments[parent] = []
      //     }
      //     this.comments[parent].push(item)
      // }

        this.commentPage +=  1
        this.commentTotal = res.body.total
      }

      this.commentLoading = false
    }) )
  }
  
  @action fetchChildComments = async (parent: number) => {
    if (this.childCommentLoading){
      return 
    }

    this.childCommentLoading = true
    queryChildComments({id:parent, page:this.childCommentPage, pageSize:this.commentPageSize }).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.mergeComments(res.body.comments)
        this.childCommentPage +=  1
      }
      this.childCommentLoading = false
    }) )
  }

  @action addComments = (comment) => {
    this.commentLoading = true
    createComments(comment).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        comment.id = res.body.id 
        this.mergeComments([comment])
      }
      this.commentLoading = false
    }) )
  }

  @action setCurrent = (index,callback ) => {
    if ( index < this.questions.length  && index >= -1) {
      this.current = index
      //当当前题目到达临界点时，再次向服务器请求更多的数据
      if ( ( this.current === ( ( this.page - 1)  * this.pageSize  - 2 )) ||  this.current === -1 && this.last !== 0 ) {
        callback()
      }
    }
  }

  setOffset = (index) => {
      this.last = index
  }

  getCurrentIndex = () => {
    return this.current + this.last
  }
  @action clear = () => {
      this.current = 0
      this.last = 0
      this.page = 1
      this.questions = []
      this.answers = observable.map({})
  }

  @action saveAnswer = ( { bank_id,question_id,type,options,filling_answers,truefalse ,result}) => {
    type = type || 'single'
    options = options || null
    filling_answers =filling_answers || ''
    truefalse = truefalse || false
    this.answers.set(question_id,{bank_id,question_id,type,options,filling_answers,truefalse,result } )
  }

  @action isUserFavoritesAction = (user_id) => {
    if ( !this.questions.length || this.current < 0 || this.current >= this.total || this.current >= this.questions.length) return
    let id = this.questions[this.current].id
    queryFavoritesStatusByUserID({id,user_id}).then((res) => {
      if ( res.success && res.code === 10200  ) {
        this.favorites.set(id, res.body.isFavorites)
        this.currentIsFavorites = res.body.isFavorites
      }
    })
  }

  @action addFavoritesAction = () => {
    this.addFavLoading = true
    if ( !this.questions.length || this.current < 0 || this.current >= this.total ) return
    let id = this.questions[this.current].id
    addFavorites({id}).then(action( (res) => {
        if ( res.success && res.code === 10200  ) {
          this.currentIsFavorites = true
        }else{
          this.currentIsFavorites = false
        }
        this.addFavLoading = false
    }) )
  }

  @action removeFavoritesAction = () => {
    if ( !this.questions.length || this.current < 0 || this.current >= this.total ) return
    this.addFavLoading = true
    let id = this.questions[this.current].id
    removeFavorites({id}).then( action( (res) => {
      if ( res.success && res.code === 10200  ) {
        this.favorites.set(id, false)
        this.currentIsFavorites = false
      }
      this.addFavLoading = false
    }) )
  }

  //同步保存练习记录到服务器
  syncHistoryRecords = (user_id: number , bank_id: number) => {
    const questions = Array.from(this.record_history.reduce((m, t) => m.set(t.id, t), new Map()).values())
    if ( questions.length > 0 ){
      const current = this.current + this.last
      saveRecords({id:user_id,user_id, bank_id, questions, current }).then((res) => {
        if ( res.success ){
          this.record_history = [] //重置
        }
      })
    }
  }

  getAnswer = ({question_id}) => {
    const key = question_id
    if (this.answers.has(key)) {
      return this.answers.get(key)
    }else {
      return null
    }
  }
}
