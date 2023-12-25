import axios from 'axios'
import { combineReducers } from 'redux'
import { applyMiddleware, createStore } from 'redux'
import logger from 'redux-logger'
import { thunk } from 'redux-thunk'

//store

//action name constants

// const init = 'account/init'
const increment = 'account/increment'
const decrement = 'account/decrement'
const incrementByAmount = 'account/incrementByAmount'
const incBonus = 'bonus/increment'

const getAccUserPending = 'account/getUser/pending'
const getAccUserFullfilled = 'account/getUser/fullfilled'
const getAccUserRejected = 'account/getUser/rejected'

const store = createStore(
  combineReducers({
    account: accountReducer,
    bonus: bonusReducer,
  }),
  applyMiddleware(logger.default, thunk)
)

const history = []

//reducer
function accountReducer(state = { amount: 1 }, action) {
  switch (action.type) {
    case getAccUserFullfilled:
      return { amount: action.payload }
    case getAccUserRejected:
      return { ...state, error: action.error,pending:false }
    case getAccUserPending:
      return { ...state,pending:true }
    case increment:
      return { amount: state.amount + 1 }
    case decrement:
      return { amount: state.amount - 1 }
    case incrementByAmount:
      return { amount: state.amount + action.payload }
    default:
      return state
  }
}

function bonusReducer(state = { points: 0 }, action) {
  switch (action.type) {
    case incBonus:
      return { points: state.points + 1 }
    case incrementByAmount:
      if (action.payload >= 100) return { points: state.points + 1 }
    default:
      return state
  }
}

//global state

// store.subscribe(()=>{
//     history.push(store.getState());
//     console.log(history);
// })

//async api call

function getUserAccount(id) {
  return async (dispatch, getState) => {
    try {
      dispatch(getAccountUserPending());
      const { data } = await axios.get(`http://localhost:3000/accounts/${id}`)
      dispatch(getAccountUserFullfilled(data.amount))
    } catch (error) {
        dispatch(getAccountUserRejected(error.message))
    }
  }
}

function getAccountUserFullfilled(value) {
  return { type: getAccUserFullfilled, payload: value }
}
function getAccountUserPending() {
  return { type: getAccUserPending }
}
function getAccountUserRejected(error) {
  return { type: getAccUserRejected, error: error }
}
function incrementF() {
  return { type: increment }
}
function decrementF() {
  return { type: decrement }
}
function incrementByAmountF(value) {
  return { type: incrementByAmount, payload: value }
}
function incrementBonus() {
  return { type: incBonus }
}
setTimeout(() => {
  //   store.dispatch(incrementBonus())
  store.dispatch(getUserAccount(2))
}, 2000)

console.log(store.getState())
