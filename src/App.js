import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {Router, Route, Link, Switch} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {createStore, combineReducers} from 'redux';
import {Provider, connect}   from 'react-redux';
import moment from 'moment'
import 'moment/locale/ru'

class ManagerInfo extends Component {
  render() {
    return (
      <div className='ManagerInfo'>
          <img src={logo} className='Foto-icon' alt='Foto-icon' />
          <div className='ManagerName'>Вероника Ростова</div>
          <div className='ManagerPosition'>Менеджер по продажам</div>
          <div className='ManagerSayHello'>
            <p> Подберу для Вас самые лучшие предложения. Мои услуги абсалютно бесплатны.</p>
          </div>
      </div>
    );
  }
}

var services = [{text:'Ручное бронирование', value:'11'},
                {text:'Пакетные туры', value:'3'},
                {text:'Отели', value:'1'}]

class Service extends Component {
  render() {
    return (
      <div className='OrdersService'>
           <tr>
             <td className='Service'>
              {this.props.service.text}
             </td>
             <td className='Number'>
               {this.props.service.value}
             </td>
          </tr>
      </div>
    );
  }
}

class ManagerService extends Component {
  render() {
    return (
      <div className='ManagerService'>
           <tr>
             <td>Услуги</td>
          </tr>
          {services.map(service => (
                      <Service service={service} 
                               key={service.text} 
                      />
          ))}
          <tr>
             <td>Всего</td>
             <td>15</td>
          </tr>  
      </div>
    );
  }
}

var feedback = [{name: 'Самуил', text:'Привет, Верунь! ниче себе ты крутая. фотка класс!!!!', createAt:'13 октября 2011'},
{name: 'Лилия Семёнова', text:'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент, это и есть всемирно известный центр огранки алмазов и торговли бриллиантами?', createAt:'14 октября 2011'},
{name: 'Лилия Семёнова', text:'Вероника, здравствуйте! Есть такой вопрос: Особый вид куниц жизненно стабилизирует кинетический момент?', createAt:'14 октября 2011'}]

function feedbackReducer(state, action){
  if (state === undefined){
      return feedback;
  }

  if (action.type === 'ADD_FEEDBACK' && action.text!==''){
      return [...state, {name: action.name,  
                         text: action.text,
                         createAt: action.createAt}]
  }

  if (action.type === 'DEL_FEEDBACK'){
      return state.filter(comment=>comment.name !== action.name)
}

  return [...state]
}

const reducers = combineReducers({
  feedback: feedbackReducer,
})

var store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const mapStateToProps = function(store) {
    return {
      feedback: store.feedback   
    };
}

class Comment extends Component {
  render (){
     return (
         <div className='Comment'> 
            <div className='CommentName'>{this.props.comment.name} </div>
            <div className='CommentDate'> {this.props.comment.createAt}</div> 
            <div className='CommentText'>{this.props.comment.text}</div>
         </div>
     )
  }
} 


class CommentList extends Component {
  constructor(props){
    super(props)
    
    this.state = { feedback: {...props.feedback}}
  }
  
  render (){
       return (
              <div className='СommentList'>            
                {this.props.feedback.map(comment => 
                      <Comment comment={comment} 
                               key={comment.createAt} 
                      />
                )}  
              </div>
          )
      }
}

CommentList = connect(mapStateToProps)(CommentList)

class CommentInput extends Component {
    resetValue(){
      this.text.value='';
    }
    save(){
        store.dispatch({
            type: 'ADD_FEEDBACK',
            name: 'User',
            text: this.text.value,
            createAt: moment().format('DD MMMM YYYY')
        }) 
        this.resetValue();  
    }
    handleKeyPress = (event) => {
      if(event.ctrlKey && event.key === 'Enter'){
        this.save();
      }
    }
    render(){
        return (
            <div className='AddComment'>           
              <textarea wrap='off'   className='CommentInput'  onKeyPress={this.handleKeyPress} ref={c => this.text = c} />
              <button className='ButtonComment' onClick={this.save.bind(this)} >Написать консультанту</button>
            </div>
        );
    }
}
  

class ManagerFeedback extends Component {
  render() {
    return (
      <div className='ManagerFeedback'>
        <div className='NavFeedback'>
           <div  className='LastComment'>Последние отзывы</div>
           <Link to='/#' className='AllComment' >Все отзывы</Link> 
        </div>
           < CommentList/>  
      </div>
    );
  }
}


class ManagerProfile extends Component {
  render() {
    return (
      <div>
        <div className='Main'>
          < ManagerInfo/>
          < ManagerService/>
          < ManagerFeedback/>
        </div>
        <div className='Footer'>
          < CommentInput/>
        </div>
      </div>
  );
  }
}




class App extends Component {
  render() {
    return (
      <div className='App'>
        <Provider store={store}>
          <Router history={createHistory()} >
            <Switch>
                <Route path='/' component={ManagerProfile} exact />                      
            </Switch>
          </Router>
        </Provider> 
      </div>
    );
  }
}

export default App;
