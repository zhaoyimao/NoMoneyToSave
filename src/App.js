import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      value:[],
    }
    this.handleCheck=this.handleCheck.bind(this);
    this.handleClick=this.handleClick.bind(this);
    this.return=this.return.bind(this);
    this.buy=this.buy.bind(this);
  }
  
  handleCheck(props){//查看购物车
    $("#car").show();
    $("#shop").hide();
  }
  return(){//返回购物商城
    $("#car").hide();
    $("#shop").show();
  }
  
  handleClick(event){//加入购物车
    event = event.nativeEvent;
    const tr = event.target.parentNode.parentNode;
    let str='#'+tr.id;
    let num=$(str).children().children(".inputNumber").val();
    let items=this.state.value;
    let count=get_car_goods(tr.id);
    let item=getAllByID(tr.id,items);

    if(num){
      if(count){
        item.count=Number(num)+Number(count);
      }else{
        item.count=Number(num);
      }
    }else{
      if(count){
        item.count=Number(count)+1;
      }else{
        item.count=1;
      } 
    }

    if(count===undefined){
      let str="<tr class='goods'><td>"+item.barcode+"</td><td>"+item.name+"</td> <td>"+item.unit+"</td> <td>"+item.price+"元</td><td>"+item.charge+"</td><td class='count'>"+item.count+"</td></tr>";
      $("#carList").append(str);
    }else{
      $("#carList tr").each(function(i){
        $(this).children('td').each(function(j){
            if($(this).text()===tr.id){
                $(this).parent().children(".count").html(item.count);
            }
        });
    });     
    }
  }

  buy(){
    let items=get_car_goods_Number();
    $.ajax({
      type:'POST',
      url:"http://127.0.0.1:8081",
      data:{
        buyitems:items
      },
      dataType:'json',
      crossDomain:true,
      success:function(data){
      alert("购买成功");
      },
      error:function(e){
        alert("购买失败");
      }
    });
  }
 
  
   //在hook函数componentDidMount中进行数据请求，并把获取的数据更新到组件状态中。
   componentDidMount() {
    //先执行Ajax数据请求，全局的get方法
      this.serverRequest = $.get("http://127.0.0.1:8081", function (result) {
        console.log(result)
      let items=getItem(result);
      console.log(items)
     //在根据数据更新组件状态
        this.setState({
        value:items
        });
      }.bind(this));
  }


  render() {
   let trs=this.state.value.map(function(item,i){
     return (<tr key={i} id={item.barcode}>
     <td>{item.name}</td>
     <td>{item.unit}</td>
     <td>{item.price}元</td>
     <td>{item.charge}</td>
     <td> <button onClick={this.handleClick}>加入购物车</button><input type="text" placeholder="请输入数量" className="inputNumber" ></input></td></tr>)
   }.bind(this))
    return (    
      <div className="App">
      <div id="shop">
      <h1 align="center">购物商城</h1>
       <table id="itemtable" className="table table-striped">
        <thead>
          <tr>
           <th>名称</th>
           <th>规格</th>
           <th>价格</th>
           <th>优惠</th>
           <th >操作</th>
          </tr>
          </thead>
          <tbody ref="item">
          {trs}
         </tbody>
       </table>
       <button onClick={this.handleCheck}> 查看购物车</button>
       </div>
      <div id="car">
     <h1>购物车</h1>
     <table id="C"  border="1" className="table table-striped">
     <thead className='theads' onClick={this.sort}>  
            <tr>  
              <td>编号</td><td>名称</td><td>规格</td><td>价格</td><td>优惠信息</td><td>数量</td>
            </tr>  
            </thead>
            <tbody id="carList">  
           
          </tbody>    
     </table>
     <button id="return" onClick={this.return}>返回购物商城</button><button id="buy" onClick={this.buy}>购买</button>
     </div> 
      </div>
     );
  }
}



function getItem(result){
  let Items=result.loadAllItems;
  let loadPromotions=result.loadPromotions.barcodes;
 for(let i in Items){
   if(loadPromotions.includes(Items[i].barcode)){
     Items[i].charge="买二送一"
   }else{
    Items[i].charge="无"
   }
 }
return Items;
}


function get_car_goods(barcode){//获取购物车里面的信息
  // let result=[];
  let count;
   $("#carList tr").each(function(i){
       let object=[];
       $(this).children('td').each(function(j){
           object.push($(this).text());
       });

       if(object[0]===barcode){
           count=object[5];
       }
   });
   return count;
}


function get_car_goods_Number(){//获取购物车中的商品编号
  let result=[];
  $("#carList tr").each(function(i){
    let object=[];
       $(this).children('td').each(function(j){
           object.push($(this).text());
       });
      if(Number(object[5])>1){
        var str="";
        str=object[0]+"-"+Number(object[5]);
        result.push(str);
      }else{
        result.push(object[0]);
      }
  });
  return result;
}

function getAllByID(barcode,items){
    let object={};
    items.filter(element=>{
        if(element.barcode===barcode){
            object.barcode=element.barcode;
            object.name=element.name;
            object.unit=element.unit;
            object.price=element.price;
            object.charge=element.charge;
            return object;
        }
    });
    return object;
}

export default App;
