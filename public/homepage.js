
const user = localStorage.getItem("email");

document.getElementById("welcome-message").innerHTML=`Your Email is "${user}"`;


document.getElementById("logout").onclick= async function(e){
  e.preventDefault();
  localStorage.removeItem("email");
  window.location.href = "./login.html";
}
