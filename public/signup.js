const myForm = document.querySelector('#my-form');
        const nameInput = document.querySelector('#name');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        myForm.addEventListener('submit', onSubmit);
           
        function onSubmit(e){
          e.preventDefault();       
          const name=nameInput.value;
          const email=emailInput.value;
          const password=passwordInput.value;
          const inputData={
            name,
            email,
            password,
          };
          // console.log(inputData);
          axios.post("http://localhost:3000/user/signup",inputData)
            .then((response)=>{
              // console.log(response)
              if(response.request.status==201){
                alert(response.data.message);
                window.location.href="./login.html";
              }
            })
            .catch((err)=>{
              console.log(err);
              document.getElementById("msg-error").innerHTML=`<div style="color:red;">${err.response.data.message}<div>`;
              
            })
            nameInput.value = '';
            emailInput.value='';
            passwordInput.value = '';  
        }
       