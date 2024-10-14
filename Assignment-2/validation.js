function handleFormSubmit(event)
{
    console.log("Handler Called");
    
    let name = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let city = document.getElementById("city").value;
    let address = document.getElementById("address").value;
    if(name.value&& email.value&& city.value&& address.value){
        console.log("valid form")
        
    }else {
        console.log("Invalid Form");
        if (name==''||email==''|| city==''||address=='') {
            alert("please fill all the required fields");
            document.getElementById("username").classList.add("error");
        }
        
        let errorMessage = document.getElementById("error-message");
        errorMessage.style.display = "inline";

        // Prevent form submission
        event.preventDefault();
    }
      
    }



window.onload = function(){
    var gform = document.getElementById("submit");
gform.onsubmit = handleFormSubmit;
}

