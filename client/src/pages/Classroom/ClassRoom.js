import React, { Component } from 'react'
import { Redirect } from 'react-router';
import {URL_API,INFO,TOKEN} from '../../SettingValue';
import Header from '../../components/Header/Header';
import AClass from './AClass';
import Axios from 'axios';
import ModalAddClassRoom from './ModalAddClassRoom';
import ModalJoinClassRoom from './ModalJoinClassRoom';



export default class ClassRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listClassRoom:[]
        }
    }

    getAllClassRoom=()=>{
        let promise=Axios({
            url:`${URL_API}/classroom/api/GetALLListClassroom/${JSON.parse(localStorage.getItem(INFO)).id}`,
            method:'GET',
            headers:{'Authorization':'Bearer '+localStorage.getItem(TOKEN) }
        });
        promise.then((result)=>{
            this.setState({
                listClassRoom:result.data
            })
            console.log('get all class: ',this.state.listClassRoom);
        });
        promise.catch((er)=>{
            console.log("loi o classroom",er);
        })
    }


    handleAddNewClass=(cl)=>{
        let tempClass=[...this.state.listClassRoom];
        let id_nguoithamgia=JSON.parse(localStorage.getItem(INFO)).id;
        let dLink=new Date();
        let duonglink= '/classroom/'+dLink.getTime();
        let dataSend={...cl,id_nguoithamgia,duonglink,id_chuphong:id_nguoithamgia};
        tempClass.push(dataSend);
        let promise=Axios({
            method:'POST',
            url:`${URL_API}/classroom/api/AddNewClassroom`,
            data:dataSend,
            headers:{'Authorization':'Bearer '+localStorage.getItem(TOKEN) }
        });
        promise.then((res)=>{
            this.setState({
                listClassRoom:tempClass
            })
            console.log('tạo class oke',dataSend);
        });
        promise.catch((error)=>{
            console.log('tao class that bai',error);
        });
    }

    componentDidMount(){
        this.getAllClassRoom();
    }

    displayListClass = (lst) => {
        console.log('chieu dai: ',lst.length);
        if(lst.length){
            return lst.map((cl, index) => {
                return (
                    <div className="col-md-3" key={index}>
                        <AClass cl={cl}/>
                    </div>
                );
            })
        }
        else{
            return(<div></div>)     
        }
    }

    render(){
        if(localStorage.getItem(TOKEN)){
            return (
                <div>
                    <Header/>
                    <div className='container'>
                        <div className='row'>
                            {this.displayListClass(this.state.listClassRoom)}
                        </div>
                    </div>
                    <ModalAddClassRoom addClass={this.handleAddNewClass}/>
                    <ModalJoinClassRoom joinClass={this.handleJoinClass}/>
                </div>
            )
            
        }
        else{
            return <Redirect to='/'/>
        }
    }
}
