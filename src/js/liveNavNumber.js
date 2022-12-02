// export default function liveNavNumber(liveNumberId) {
//     const screen = document.getElementById(liveNumberId);
//     if (screen) {
//         var current = 8806180984499;
//         update();

//         function update() {
//             let screenNumber = formatMoney(current);
//             screen.innerHTML = formatString(screenNumber);
//         }

//         function formatString(text) {
//             const newString = [];
//             for (let i = 0; i < text.length; i++) {
//                 if (text[i] === ' ') {
//                     const strToPush = "<span class='n__s'>" + text[i] + "</span>";
//                     newString.push(strToPush);
//                 } else {
//                     const strToPush = "<span class='n'>" + text[i] + "</span>";
//                     newString.push(strToPush);
//                 }
//             }
//             return newString.join('');
//         }

//         setInterval(function(){
//             current += 1111111;
//             update();
//         },150);

//         function formatMoney(amount) {
//             var dollars = Math.floor(amount).toString().split('');
//             var cents = (Math.round((amount%1)*100)/100).toString().split('.')[1];
//             if(typeof cents == 'undefined'){
//                 cents = '00';
//             }else if(cents.length == 1){
//                 cents = cents + '0';
//             }
//             var str = '';
//             for(let i=dollars.length-1; i>=0; i--){
//                 str += dollars.splice(0,1);
//                 if(i%3 == 0 && i != 0) str += ' ';
//             }
//             return str;
//         }
//     }
// }