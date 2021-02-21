function step1(){
    document.getElementById('step1').style.display = 'block'
    document.getElementById('step2').style.display = 'none'
    document.getElementById('step3').style.display = 'none'
    document.getElementById('step4').style.display = 'none'
    document.getElementById('step5').style.display = 'none'
}

function step2(){
    let email = document.getElementById('email-input').value
    if(!checkEmail(email)){
        document.getElementById('wrong').innerHTML = 'Please enter correct email!'
        setTimeout(_ => { document.getElementById('wrong').innerHTML = ''; } , 5000)
        return;
    }

    fetch('/checkEmail?email='+email)
    .then(response => response.json())
    .then(data => {
        if(data.status == 'OK'){
            document.getElementById('step1').style.display = 'none'
            document.getElementById('step2').style.display = 'block'
            document.getElementById('step3').style.display = 'none'
            document.getElementById('step4').style.display = 'none'
            document.getElementById('step5').style.display = 'none'
        } else {
            document.getElementById('wrong').innerHTML = data.status
        }
    })
}

function step3(){
    let username = document.getElementById('username-input').value
    if(username.length < 5){
        document.getElementById('wrong2').innerHTML = 'The username must contain more than 5 characters!'
        setTimeout(_ => { document.getElementById('wrong2').innerHTML = ''; } , 5000)
        return;
    }

    fetch('/checkUsername?username='+username)
    .then(response => response.json())
    .then(data => {
        if(data.status == 'OK'){
            document.getElementById('step1').style.display = 'none'
            document.getElementById('step2').style.display = 'none'
            document.getElementById('step3').style.display = 'block'
            document.getElementById('step4').style.display = 'none'
            document.getElementById('step5').style.display = 'none'
        } else {
            document.getElementById('wrong2').innerHTML = data.status
        }
    })
}

function checkStep3(){
    let password = document.getElementById('password').value
    let confirm_password = document.getElementById('confirm_password').value
    if(password != confirm_password){
        document.getElementById('wrong3').innerHTML = 'The password not math!'
        document.getElementById('wrong3').style.color = '#F1948A'
    } else if(password.length < 8){
        document.getElementById('wrong3').innerHTML = 'The password must contain more than 8 characters!'
        document.getElementById('wrong3').style.color = '#F1948A'
    } else {
        document.getElementById('wrong3').innerHTML = 'The password can be use!'
        document.getElementById('wrong3').style.color = '#58D68D'
    }
}

function step4(){
    let password = document.getElementById('password').value
    let confirm_password = document.getElementById('confirm_password').value
    if(password != confirm_password){
        document.getElementById('wrong3').innerHTML = 'The password not math'
        return;
    } else if(password.length < 8){
        document.getElementById('wrong3').innerHTML = 'The password must contain more than 8 characters!'
        return;
    }
    document.getElementById('step1').style.display = 'none'
    document.getElementById('step2').style.display = 'none'
    document.getElementById('step3').style.display = 'none'
    document.getElementById('step4').style.display = 'block'
    document.getElementById('step5').style.display = 'none'
}

function step5(){
    var email = document.getElementById('email-input').value;
    var name = email.substring(0, email.lastIndexOf("@"));
    document.getElementById('step1').style.display = 'none'
    document.getElementById('step2').style.display = 'none'
    document.getElementById('step3').style.display = 'none'
    document.getElementById('step4').style.display = 'none'
    document.getElementById('step5').style.display = 'block'
    document.getElementById('email').innerHTML = name
    document.getElementById('username').innerHTML = '@'+document.getElementById('username-input').value
}

document.getElementById('upload-img').addEventListener('change', readURL, true);
function readURL(){
   var file = document.getElementById("upload-img").files[0];
   var reader = new FileReader();
   reader.onloadend = function(){
      document.getElementById('preview-img').style.backgroundImage = "url(" + reader.result + ")";  
      document.getElementById('preview-img2').style.backgroundImage = "url(" + reader.result + ")";        
   }
   if(file){
      reader.readAsDataURL(file);
   }
}

function checkEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
