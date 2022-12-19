function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
 }

let arr2=[]
let arr=[
    {
        "price":10,
        "id":1,
        "name":"s"
    },
    {
        "price":9,
        "id":3,
        "name":"a"
    },
    {
        "price":3,
        "id":2,
        "name":"c"
    }
];
arr.sort(sortByProperty("name"));

console.log(arr[0].id)