function setup() {
    noCanvas();
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyB3f3_V8PQtmurY3VCqxeEXNdACmdzHmpA",
        authDomain: "client-info-662d0.firebaseapp.com",
        databaseURL: "https://client-info-662d0.firebaseio.com",
        projectId: "client-info-662d0",
        storageBucket: "client-info-662d0.appspot.com",
        messagingSenderId: "899329367185",
        appId: "1:899329367185:web:96cca90951a32c9efbf330",
        measurementId: "G-LC2G8QZRGF"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    let copyright = document.getElementById('copyright');
    copyright.innerText = `Copyright ${String.fromCharCode(169)} ` + 
                          `${new Date().getFullYear()} Hyekang Joo`;
}

function draw() {
    noLoop();
}

async function login() {
    let username = document.getElementById('username_log').value;
    let password = document.getElementById('password_log').value;

    if (username.length == 0 || password.length == 0) {
        alert("Please complete the form.");
        return;
    } else if (!username.includes('@')) {
        alert("Please enter a correct email.");
        return;
    }

    let match = await search(username, password);

    if (match) {
        window.location = './personal-data.html';
        localStorage.setItem('user', username);
    } else {
        alert('Please re-enter your information.');
    }
}

async function search(name, pass) {
    let database = await firebase.database();
    let ref = await database.ref('info')
    let holder;
    
    ref.on('value', data => {
        holder = data.val();
    }, err => {
        console.log(err);
        return;
    })

    await new Promise(r => setTimeout(r, 2000));

    for (let elm in holder) {
        let curr = holder[elm];

        if (name == curr['username']) {
            // If it is just searching for dups, return true
            if (pass == undefined) {
                return true;
            } else {
                // If it is checking the login credentials, check for pass too
                if (pass == curr['password']) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        
    }

    return false;
}

async function register() {
    let username = await document.getElementById('username_reg').value;
    let password1 = await document.getElementById('password1_reg').value;
    let password2 = await document.getElementById('password2_reg').value;

    // Checking whether the password and the confirmed password match
    if (password1 != password2) {   //works
        alert("Your passwords do not match.");
        return;
    } else if (password1.length == 0 || username.length == 0) { //works
        alert("Please complete the form.");
        return;
    } else if (!username.includes('@')) {   // DOESNT WORK
        alert('Please enter a correct email.');
        return;
    }

    // Checking whether a duplicate username exists
    let duplicate = await search(username);

    if (duplicate) {
        alert("This username already exists.");
        return;
    }

    let database = await firebase.database();
    let ref = await database.ref('info');
    let data = {
        'username': username,
        'password': password1,
        'data': {
            'counter': 0
        }
    }

    await ref.push(data);

    alert("You have successfully created an account.");
    
    location.reload()
}

