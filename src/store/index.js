import {createStore} from 'vuex';
import axios from 'axios'
import router from '../router'
import dummy from '../lang/dummy.json'
const base = 'http://anbar.live/api/'
const store = createStore({
    state:{
        user:{
            data:{},
            isLoggedIn:false,
            review:false,
            language:dummy,
            moderator:false
        },
        loading:true,
        category:{},
        ctype:null,
        categories:{},
        allcategories:false,
        prs:{
            pras:{
                products:{},
                count:false
            },
            recentlyviewed:{}
        },
        brand:{},
        brands:{
            bras:{},
            carousel:false,
        },
        merchant:{},
        merchants:{
            mras:{},
            carousel:false,
        },
        results:false,
        allresults:false,
        soldData:false,
        az:{},
        en:{},
        ru:{},
        expired:false,
        api: base,
        sidebarActive:false
    },
    mutations:{
        setUser(state,user){
            state.user.data = user
            state.user.isLoggedIn = true
            state.loading = false
            if(user.role === 'admin' || user.role === 'moderator'){
                state.user.moderator = true
            }
        },
        showSidebar(state){
            state.sidebarActive = true
        },
        hideSidebar(state){
            state.sidebarActive = false
        },
        setCat(state,categories){
            state.category = categories
        },
        setCategory(state,categories){
            state.categories = categories
        },
        setType(state,type){
            state.ctype = type
        },
        setAllCategories(state,categories){
            state.allcategories = categories
        },
        setPras(state,products){
            state.prs.pras.products = products
        },
        setProduct(state,product){
            state.prs.product = product
        },
        setCount(state,count){
            state.prs.pras.count = count
        },
        setMerchant(state,merchant){
            state.merchant = merchant
        },
        setBrand(state,brand){
            state.brand = brand
        },
        recentlyViewed(state,products){
            state.prs.recentlyviewed = products
        },
        brandCarousel(state,brands){
            state.brands.carousel = brands
        },
        merchantCarousel(state,merchants){
            state.merchants.carousel = merchants
        },
        setFilterBrands(state,brands){
            state.brands.bras = brands
        },
        setFilterMerchants(state,merchants){
            state.merchants.mras = merchants
        },
        endload(state){
            state.user.data = {}
            state.user.isLoggedIn = false
            state.loading = false
        },
        setResult(state,data){
            state.results = data
        },
        setAllResults(state,data){
            state.allresults = data
        },
        setReview(state,review){
            state.user.review = review
        },
        changeLang(state,lang){
            if(lang === 'en'){
                state.user.language = store.state.en
                localStorage.setItem('lang',lang)
            }else if(lang === 'az'){
                state.user.language = store.state.az
                localStorage.setItem('lang',lang)
            }else if(lang === 'ru'){
                state.user.language = store.state.ru
                localStorage.setItem('lang',lang)
            }
        },
        setLanguage(state,data){
            state.az = data.az
            state.en = data.en
            state.ru = data.ru
        },
        setSoldData(state,data){
            state.soldData = data
        },
        clearCart(state){
            state.user.data.cart = []
        },
        acBagla(state){
            state.expired = true
            state.expired = false
        }
    },
    actions:{
        register: async ({commit},user) => {
            await axios.post(base+'sendverification',user).then((response)=>{
                // commit('setUser',response.data.user)
                // localStorage.setItem('TOKEN',response.data.token)
            })
        },
        verificate: async ({commit},user) => {
            await axios.post(base+'verificate',user).then((response)=>{
                 commit('setUser',response.data.user)
                 localStorage.setItem('TOKEN',response.data.token)
            })
        },
        setNew: async ({commit},user) => {
            await axios.post(base+'setnew',user).then((response)=>{
                 commit('setUser',response.data.user)
                 localStorage.setItem('TOKEN',response.data.token)
                 window.location.reload()
            })
        },
        loadLanguage: async({commit}) => {
            await axios.get(base+'lang').then((response)=>{  
                commit('setLanguage',response.data)
                commit('changeLang',localStorage.getItem('lang'))
            })
        },
        login: async ({commit},user) => {
            await axios.post(base+'login',user)
            .then((response) => {
                commit('setUser',response.data.user);
                localStorage.setItem('TOKEN',response.data.token)
            }).then(()=>{
                window.location.reload()
            })
        },
        logout: async ({commit}) => {
            await axios.post(base+'logout',null,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                window.location.reload()
            })
        },
        addWish: async ({commit},id) => {
            await axios.post(base+'addwish/'+id,null,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                commit('setUser',response.data.user);
            })
        },
        addCart: async ({commit},id) => {
            await axios.post(base+'addcart/'+id,null,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                commit('setUser',response.data.user);
            })
        },
        changeQuantity: async ({commit},form) => {
            await axios.post(base+'changeq',form,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                commit('setUser',response.data.user);
            })
        },
        loadUser: async({commit}) => {
            try{
               await axios.post(base+'fryoxla',null,{
                    headers: {
                        Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                    }
                }).then((response)=>{
                    commit('setUser',response.data.user)
                })
            }catch(error){
                commit('endload')
            }
        },
        brandCarousel: async ({commit}) => {
            await axios.get(base+'brandcarousel').then((response)=>{
                commit('brandCarousel',response.data.brands.data)
            });
        },
        merchantCarousel: async ({commit}) => {
            await axios.get(base+'merchantcarousel').then((response)=>{
                commit('merchantCarousel',response.data.merchants.data)
            });
        },
        recentlyViewed: async ({commit}) => {
            await axios.get(base+'recentlyviewed').then((response)=>{
                commit('recentlyViewed',response.data.rec.data)
            });
        },
        loadcategory: async ({commit},slug) => {
            await axios.get(base+'loadcat/'+slug).then((response)=>{
                commit('setCat',response.data.categories)
                commit('setType',response.data.type)
            });
        },
        loadallcategories: async ({commit}) => {
            await axios.get(base+'loadallcats').then((response)=>{
                commit('setAllCategories',response.data.categories)
            });
        },
        loadcategories: async ({commit}) => {
            await axios.get(base+'loadcats').then((response)=>{
                commit('setCategory',response.data.categories)
            });
        },
        loadfiltcats: async ({commit},id) => {
            await axios.get(base+'loadfiltcats/'+id).then((response)=>{
                commit('setFiltCat',response.data.categories)
            });
        },
        loadproduct: async ({commit},slug) => {
            await axios.get(base+'loadpr/'+slug).then((response)=>{
                commit('setProduct',response.data.product)
            });
        },
        loadpras: async ({commit},formData) => {
            await axios.post(base+'loadpras',formData).then((response)=>{
                commit('setPras',response.data.products.data)
                commit('setCount',response.data.count)
            });
        },
        loadmrpras: async ({commit},formData) => {
            await axios.post(base+'loadmrpras',formData).then((response)=>{
                commit('setPras',response.data.products.data)
                commit('setCount',response.data.count)
            });
        },
        loadbrpras: async ({commit},formData) => {
            await axios.post(base+'loadbrpras',formData).then((response)=>{
                commit('setPras',response.data.products.data)
                commit('setCount',response.data.count)
            });
        },
        loadbrand: async ({commit},slug) => {
            await axios.get(base+'loadbr/'+slug).then((response)=>{
                commit('setBrand',response.data.brand)
                commit('setCategory',response.data.parents)
                commit('setFilterMerchants',response.data.merchants)
            });
        },
        loadbras: async ({commit},id) => {
            await axios.get(base+'loadbras/'+id).then((response)=>{
                commit('setFilterBrands',response.data.brands)
            });
        },
        loadmerchant: async ({commit},slug) => {
            await axios.get(base+'loadmer/'+slug).then((response)=>{
                commit('setMerchant',response.data.merchant)
                commit('setCategory',response.data.categories)
                commit('setFilterBrands',response.data.brands)
            });
        },
        loadmras: async ({commit},id) => {
            await axios.get(base+'loadmras/'+id).then((response)=>{
                commit('setFilterMerchants',response.data.merchants)
            });
        },
        search: async ({commit},data) => {
            await axios.post(base+'search',data).then((response)=>{
                commit('setResult',response.data.data)
            });
        },
        searchAll: async ({commit},data) => {
            await axios.post(base+'searchall',data).then((response)=>{
                commit('setAllResults',response.data.data)
            });
        },
        addReview: async ({commit},formData) => {
            await axios.post(base+'addreview',formData,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response)=>{
                commit('setProduct',response.data.product)
            });
        },
        loadReview: async ({commit},kartof) => {
            await axios.post(base+'loadreview',kartof,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response)=>{
                commit('setReview',response.data.review)
            });
        },
        soldProducts: async ({commit},formData) => {
            await axios.post(base+'soldprs',formData,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                commit('setSoldData',response.data.data);
            })
        },
        deleteReview: async ({commit},id) => {
            await axios.post(base+'deletereview/'+id,null,{
                headers: {
                    Authorization: 'Bearer '+localStorage.getItem('TOKEN')
                }
            }).then((response) => {
                alert(response.data.message)
            }).catch((error) => {
                alert(error.response.data.message)
            })
        },
    },
    getters:{},
    modules:{}
})
export default store;
