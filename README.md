### React native Sql(react-native-sqlite-storage) ###

1.	安装命令行进入到ReactNative项目根目录下执行

	`npm install react-native-sqlite-storage --save`
2.	进行全局Gradle设置
	
	编辑 `android/settings.gradle`文件，添加以下内容
	
	`include ':react-native-sqlite-storage'`
	
	`project(':react-native-sqlite-storage').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-sqlite-storage/src/android')`

	![](https://i.imgur.com/2GBLD24.png)

3.	修改android/app/build.gradle文件

	`dependencies` 里面添加  `compile project(':react-native-sqlite-storage')`
	![](https://i.imgur.com/oi5rnIA.png)

4.	编辑`MainApplication.java`文件，在`MainActivitiy.java`中注册`sqlite`模块
	
	`import org.pgsqlite.SQLitePluginPackage;`

		@Override
	    protected List<ReactPackage> getPackages() {
	      return Arrays.<ReactPackage>asList(
	           new MainReactPackage(),
	           new SQLitePluginPackage()
	      );
	    }
	![](https://i.imgur.com/5V4xGif.png)

5.	使用
	
	编写`SqliteStorage.js`文件 主要实现实行sql 语句的方法

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
	和打开数据库操作
		
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
	当组件卸载的时候记得close 数据库

	    componentWillUnmount(){
	        if(db){
	            this._successCB('close');
	            db.close();
	        }else {
	            console.log("SQLiteStorage not open");
	        }
	    }
	提供静态方法供外部使用

	    static getInstance(){
	        return new SQLite();
	    }

	在其他类（`App.js`）中调用，使用时先引入`SqliteStorage.js`
	
	`import SQLite from './SqliteStorage';`
	
	在`componentWillMount`中添加获取数据库实例，方便后面进行其他操作

	    componentWillMount(){
	        //开启数据库
	        if(!sqLite){
	            sqLite = SQLite.getInstance();
	        }
	    }
	
	然后便可进行 增删改查的工作了。

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

	sql语句大家按照自己的业务来