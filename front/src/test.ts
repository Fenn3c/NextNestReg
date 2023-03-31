export interface User {
id: number
name: string
surname?: string
}

const test: Partial<User> = {}



function myDecorator(target:any , propertyKey: any, descriptor: any) {
    console.log(target); // целевой объект
    console.log(propertyKey); // имя свойства
    console.log(descriptor); // дескриптор свойства
    // код декоратора
  }

  
// debounce(()=>{console.log(123)}, 200)
// function helloWorld(){
//     console.log('helloWorld')
// }