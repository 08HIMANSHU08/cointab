        const myForm = document.querySelector('#my-form');
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');

        myForm.addEventListener('submit', onSubmit);
           
        function onSubmit(e){
          e.preventDefault();       
          const email=emailInput.value;
          const password=passwordInput.value;
          const inputData={
            email,
            password,
          };
          // console.log(inputData);
          axios.post("http://localhost:3000/user/login",inputData)
            .then((response)=>{
                // console.log(response);
              if(response.status==200){
                alert(response.data.message);
                localStorage.setItem("email",response.data.user);
                window.location.href = "./homepage.html";
              }
            })
            .catch((err)=>{
              document.getElementById("login-error").innerHTML=`<div style="color:red;">${err.response.data.message}<div>`;
              console.log(err);
            })
            emailInput.value='';
            passwordInput.value = '';  
        } 