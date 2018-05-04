import React,{Component} from 'react';

import SQLiteStorage from 'react-native-sqlite-storage';

var database_name = "test.db";//数据库文件
var database_version = "1.0";//版本号
var database_displayname = "MySQLite";
var database_size = -1;
var db;
export default class SQLite extends Component{

    componentWillUnmount(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
    }

    static getInstance(){
        return new SQLite();
    }

    open(){
        db = SQLiteStorage.openDatabase(
            database_name,
            database_version,
            database_displayname,
            database_size,
            ()=>{
                this._successCB('open');
            },
            (err)=>{
                this._errorCB('open',err);
            });
        return db;
    }

    executeSql(sql,params,callFunction){
        if (!db) {
            this.open();
        }
        db.transaction((tx)=>{
            tx.executeSql(sql, params,callFunction);
        },(error)=>{//打印异常信息
            alert("sql fail"+error);
            console.log(error);
        },()=>{
            console.log('sql 执行成功')
        });
    }

    close(){
        if(db){
            this._successCB('close');
            db.close();
        }else {
            console.log("SQLiteStorage not open");
        }
        db = null;
    }

    _successCB(name){
        console.log("SQLiteStorage "+name+" success");
    }

    _errorCB(name, err){
        console.log("SQLiteStorage "+name);
        console.log(err);
    }

    render(){
        return null;
    }
};