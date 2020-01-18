// Copyright Hyekang Joo

const bcrypt = dcodeIO.bcrypt;
const SALT_ROUNDS = 10;
const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\
        MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5U2BNZEIX5Lx2gzX/8DAku4Eq\
        lINwdH6eHLUkBwEUkNJb/o/CE6BYJ/cX+8WiHtucuCGf7KF7IL82cbnXg3slLOeT\
        VgjklQUgVW+gplHE2eJqE4rdNO6X3gu4vtgiUQW8H4DjyMAgq+bW+umjPn25ViJM\
        QbLe4Hsi1HhmCQP2UwIDAQAB\
        -----END PUBLIC KEY-----";

window.onload = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyB3f3_V8PQtmurY3VCqxeEXNdACmdzHmpA",
        authDomain: "client-info-662d0.firebaseapp.com",
        databaseURL: "https://client-info-662d0.firebaseio.com",
        projectId: "client-info-662d0",
        storageBucket: "client-info-662d0.appspot.com",
        messagingSenderId: "899329367185",
        appId: "1:899329367185:web:96cca90951a32c9efbf330",
        measurementId: "G-LC2G8QZRGF"
    };
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    firebase.auth().signOut();

    const copyright = document.getElementById('copyright');
    copyright.innerText = `Copyright ${String.fromCharCode(169)} ` + 
                          `${new Date().getFullYear()} Hyekang Joo`;

    localStorage.setItem('phaseTwoReady', false);
    localStorage.setItem('user', null);

    firebase.auth().onAuthStateChanged(async function(user) {
        if (user && user.emailVerified) {
            setInterval(() => {
                console.log('LOGIN SUCCESS');
                
                if (localStorage.getItem('phaseTwoReady') == 'true') {
                    localStorage.setItem('phaseTwoReady', false);
                    window.location = './personal-data.html';
                }
            }, 250);
        } else {
            console.log('LOGGED OUT');
        }
    });
}

// additional layer of encryption
function extraEncryption(info) {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(PUBLIC_KEY);
    const encrypted = encrypt.encrypt(info);

    return encrypted;
}

// ENCRYPTION
function encrypt(info) {
    return bcrypt.hashSync(info, SALT_ROUNDS, (err, hash) => {
        if (!err) {
            return hash;
        } else {
            // console.log(err);
            console.log('Error!');

            return false;
        }
    });
}

// VALIDATION
function compare(info, hash) {
    return bcrypt.compareSync(info, hash, (err, res) => {
        if (!err) {
            if (res) {
                return true;
            } else {
                return false;
            }
        } else {
            //console.log(err);
            console.log('Error!');

            return false;
        }
    });
}

// LOGIN
async function login() {
    let username = document.getElementById('username_log').value;
    let password = document.getElementById('password_log').value;
    let proceed = true, error;

    if (username.length == 0 || password.length == 0) {
        alert("Error: Please complete the form.");
        location.reload();

        return false;
    } else if (!username.includes('@')) {
        alert("Error: Please enter a correct email.");
        location.reload();

        return false;
    }

    // authentication
    const auth = await firebase.auth();
    await auth.signInWithEmailAndPassword(username, password)
            .catch(err => {
                console.log(err);

                proceed = false;
                error = err;
            });
    
    if (!proceed) {
        alert(error);
        location.reload();

        return false;
    }

    if (!auth.currentUser.emailVerified) {
        alert('Error: Please verify your email.');
        location.reload();

        return false;
    } else {
        let database = await firebase.database();
        let cipher = extraEncryption(username);
        let email;

        await database.ref(`info/${auth.currentUser.uid}/`).update({ 'cipher': cipher, 'verified': true });

        email = await (new Promise(resolve => database.ref(`info/${auth.currentUser.uid}/`).once('value').then(snapshot => {
            let userData = snapshot.val();
            resolve(userData['username']);
        })));

        localStorage.setItem('user', email);
        localStorage.setItem('phaseTwoReady', true);
        
        return true;
    }
}

// REGISTRATION
async function register() {
    let username = await document.getElementById('username_reg').value;
    let password1 = await document.getElementById('password1_reg').value;
    let password2 = await document.getElementById('password2_reg').value;
    let encryptedUsername, uid;
    let error, proceed = true;

    // Checking whether the password and the confirmed password match
    if (password1 != password2) {
        alert("Error: Your passwords do not match.");
        location.reload();

        return false;
    } else if (password1.length == 0 || username.length == 0) {
        alert("Error: Please complete the form.");
        location.reload();

        return false;
    }

    // authentication
    const auth = await firebase.auth();

    await auth.createUserWithEmailAndPassword(username, password1)
        .then(res => {
            uid = res.user.uid;
        }).catch(err => {
            console.log(err);

            proceed = false;
            error = err;
        });
    
    if (!proceed) {
        alert(error);
        location.reload();

        return false;
    }

    await auth.currentUser.sendEmailVerification()
        .catch(err => console.log(err.message));
    
    encryptedUsername = encrypt(username);

    let database = await firebase.database();
    let data = {
        'username': encryptedUsername,
        'cipher': 0,
        'data': {
            'counter': 0
        },
        "verified": false
    }

    await database.ref("info/" + uid).set(data);

    localStorage.setItem('user', encryptedUsername);

    alert("You have successfully created an account.  Please verify your email.");

    location.reload();

    return true;
}
