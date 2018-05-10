/* @flow */

import { observable ,action,computed  } from 'mobx'
import { query,queryRelatedQuestions,queryByUser,queryAllTags,queryByTag } from '../services/banks'
import { queryRecords } from '../services/users'

export default class BanksStore {
  @observable id: number = 0
  @observable banks = observable.array([])              //当前正在参加的题库
  @observable banksTotal = -1
  @observable bankMarket = observable.array([])            //所有题库
  @observable bankMarketTotal = -1
  @observable currentTag: number = 0
  @observable currentIndex: number = 0  //记录用户当前打开的item 位置
  @observable currentMarketIndex: number = 0  //记录用户当前打开的item 位置
  @observable records = {}
  @observable allTags = {}
  @observable userPage: number = 1
  @observable marketPage: number = 1
  @observable pageSize: number = 10
  @observable loading = false

  @action get = () => {
    query().then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.banks.replace(res.body.banks)
      }
    }) )
  }

  @action cleanMarket = () => {
    this.marketPage = 1
    this.bankMarketTotal = -1
    this.bankMarket = observable.array([])
  }

  @action cleanUserBanks = () => {
    this.userPage = 1
    this.banksTotal = -1
    this.records = {}
    this.banks = observable.array([])
  }

  @action fetchAll = (key , value ) => {
    key = key || ""
    value = value || ""
    if ( this.bankMarket.length === this.bankMarketTotal || this.loading ) {
      return
    }
    this.loading = true
    return query({page:this.marketPage, pageSize:this.pageSize,field:key ,keyword:value  }).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.bankMarket = this.bankMarket.concat([...res.body.banks])
        this.bankMarketTotal = res.body.total
        this.marketPage += 1
      }else{
        this.bankMarketTotal = 0
      }
      this.loading = false
    }) )
  }

  @action fetchByTag = (key) => {
    key = key || this.currentTag
    if ( this.bankMarket.length === this.bankMarketTotal || this.loading ) {
      return
    }
    
    this.loading = true
    return queryByTag({tag:key, page:this.marketPage, pageSize:this.pageSize  }).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.bankMarket = this.bankMarket.concat([...res.body.banks])
        this.bankMarketTotal = res.body.total
        this.marketPage += 1
      }else{
        this.bankMarketTotal = 0
      }
      this.loading = false
    }) )
  }

  @action fetchAllTags = () => {
    this.loading = true
    return queryAllTags().then(action( (res) => {
      if ( res.success && res.code === 10200  ) {
        this.allTags = res.body.tags
      }else{
        this.allTags = {}
      }
      this.loading = false
      } )
    )
  }

  @action fetchByUser = (userid: number) =>{
    if ( this.banks.length === this.banksTotal || this.loading  ) {
      return
    }
    this.loading = true
    return queryByUser({userid,page:this.userPage, pageSize:this.pageSize}).then( (res)=>{
      if ( res.success && res.code === 10200  ) {
        this.banks = this.banks.concat([...res.body.banks])
        this.banksTotal = res.body.total
        this.userPage += 1
        console.log("this.banks", this.banks )
      }else{
        this.banksTotal = 0
      }
      this.loading = false
    })
  }

  getCurrentRecord = (id: number ) => {
      try {
        return this.records.banks[id] || { latest : 0 , done: 0, wrong: 0 }
      }catch(error){
        return { latest : 0 , done: 0, wrong: 0 }
      }
  }

  @action getQuestions = () => {
    let id = this.banks[this.currentIndex].id
    queryRelatedQuestions(id).then(action( (res)=>{
      if ( res.success && res.code === 10200  ) {

      }
    }) )
  }

  @action setCurrentTag = (tag) => {
      this.currentTag = tag
  }

  @action setCurrentIndex = (index) => {
    this.currentIndex = index
    this.id = this.banks[this.currentIndex].id
  }

  @action setCurrentMarketIndex = (index) => {
    this.currentMarketIndex = index
    this.id = this.bankMarket[this.currentMarketIndex].id
  }

  @action appendToBanks = () => {
    //当在题库商店中选择了一个题库进行学习时，将商店所选择的题库添加到 banks 列表中，同时设置 currentIndex
    const currentMarktItem = this.bankMarket[this.currentMarketIndex]

    let already_exist = false
    for ( let i = 0 ; i < this.banks.length ; i++ ){
      if ( this.banks[i].id === currentMarktItem.id ){
         //已存在于this.banks中
          already_exist = true
          this.currentIndex = i
          break
      }
    }

    if ( !already_exist ) {
      this.banks.push(currentMarktItem)
      this.currentIndex = this.banks.length - 1
      this.banks.replace(this.banks)
    }
  }

  //获取用户做题的记录，格式如下：
  /*
  {
  "total": 9,
  "wrong": 7,
  "banks": {
                "1": {
                    "id": 1,
                    "name": "eeeee23",
                    "image": "/static/New Phototastic Collage.jpg",
                    "done": 1,
                    "wrong": 1
                },
                "2": {
                    "id": 2,
                    "name": "222345",
                    "image": "/static/timg.jpg",
                    "done": 7,
                    "wrong": 6
                },
                "5": {
                    "id": 5,
                    "name": "柜员综合题库4",
                    "image": "/static/下载.jpg",
                    "done": 1,
                    "wrong": 0
                }
            }
  */
  @action fetchRecords = (user_id:number) => {

    return queryRecords({id:user_id}).then( action((res)=>{
      if (res.success && res.code === 10200 ){
        this.records = res.body.records
        // let list = this.banks
        // for (let i = 0 ; i < list.length ; i++ ){
        //   let id = list[i].id
        //   let record = {}
        //   if ( this.records.banks ) {
        //     record = this.records.banks[id]
        //   }
        //   list[i]['record'] = record
        // }
        // this.banks.replace(list)
      }else{
        this.records = { latest : 0 , done: 0, wrong: 0 }
      }
    }))
  }
}
