/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import SQLite from './SqliteStorage';
var sqLite;
export default class App extends Component<Props> {

    componentWillUnmount(){
        sqLite.close();
    }

    componentWillMount(){
        //开启数据库
        if(!sqLite){
            sqLite = SQLite.getInstance();
        }
    }

    //建表
    create(){
        sqLite.executeSql('CREATE TABLE IF NOT EXISTS USER(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name varchar,'+
            'age VARCHAR,' +
            'sex VARCHAR)',[],()=>{alert("create success")},(e)=>{alert("create fail"+e)})//这里的失败不提示，不知道为什么
    }

    // 增
    insert(){
        sqLite.executeSql("INSERT INTO user(name,age,sex) values(?,?,?)",['zx','27','男'],()=>{alert("insert success")})
    }

    // 删
    delete(){
        sqLite.executeSql("delete from user",[],()=>{
            alert('数据删除')
        });
    }

    // 改
    updata(){
        sqLite.executeSql("UPDATE user set sex=? where name=?",['女','zx'],()=>{alert("Update Success")})
    }

    // 查
    query(){
        sqLite.executeSql("select * from user",[],(tx,results)=>{
            var len = results.rows.length;
            for(let i=0; i<len; i++){
                var u = results.rows.item(i);
                //一般在数据查出来之后，  可能要 setState操作，重新渲染页面
                alert("姓名："+u.name+"，年龄："+u.age+"，性别: "+u.sex);
            }
        })
    }

    //删除表
    dropTable(){
        sqLite.executeSql("drop table user",[],()=>{
            alert('表删除')
        });
    }

    render() {
        return (
          <View style={styles.container}>
              <TouchableOpacity onPress={this.create.bind(this)}>
               <Text style={styles.text}>
                   create
               </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.insert.bind(this)}>
                  <Text style={styles.text}>
                      insert
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.delete.bind(this)}>
                  <Text style={styles.text}>
                      delete
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.updata.bind(this)}>
                  <Text style={styles.text}>
                      updata
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.query.bind(this)}>
                  <Text style={styles.text}>
                      query
                  </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.dropTable.bind(this)}>
                  <Text style={styles.text}>
                     dropTable
                  </Text>
          </TouchableOpacity>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 30,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
