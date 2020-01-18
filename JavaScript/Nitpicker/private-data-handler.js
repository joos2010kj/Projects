// Copyright Hyekang Joo

let user;
let historyMap;

window.onload = () => {
    let firebaseConfig = {
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

    let season = document.getElementById('season');
    let year = document.getElementById('yr');

    const time = new Date();
    let div = document.getElementById('yr');

    for (let i = 0; i < 2; i++) {
        let id = time.getFullYear() + i;

        let year = document.createElement('div');
        year.name = id;

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'yr';
        radio.value = id;
        radio.className = 'inp';

        let lab = document.createElement('label');
        lab.innerText = id;
        lab.className = 'inp-name';

        year.appendChild(radio);
        year.appendChild(lab);
        div.appendChild(year);
    }

    div = document.getElementById('season');

    for (element of ['Spring', 'Fall']) {
        let season = document.createElement('div');
        season.name = element;

        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'season';
        radio.value = element;
        radio.className = 'inp';

        let lab = document.createElement('label');
        lab.innerHTML = element;
        lab.className = 'inp-name';

        season.appendChild(radio);
        season.appendChild(lab);
        div.appendChild(season);
    }
    
    user = localStorage.getItem('user');

    let copyright = document.getElementById('copyright');
    copyright.innerText = `Copyright ${String.fromCharCode(169)} ` + 
                          `${new Date().getFullYear()} Hyekang Joo`;

    init();
    show();
}

// INITIALIZE
function init() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log('LOGIN SUCCESS');
        } else {
            localStorage.setItem('user', null);
            window.location = './index.html';

            console.log('LOGGED OUT');
        }
    });
}

// HTML DOM
function store() {
    let course = document.getElementById('course').value;
    let section = document.getElementById('section').value;
    let years = document.getElementsByName('yr');
    let seasons = document.getElementsByName('season');
    let year, season;

    for (yr of years) {
        if (yr.checked) {
            year = yr.value;
        }
    }

    for (sea of seasons) {
        if (sea.checked) {
            season = sea.value;
        }
    }

    return { 'course': course, 
             'section': section, 
             'year': year, 
             'season': season };
}

// RETRIEVE THE DATA FROM HTML DOM AND POST INFO
async function execute() {
    let res = store();

    if (res['course'] == undefined || 
        res['season'] == undefined || 
        res['year'] == undefined) {
        alert('Please complete the form.');

        return;
    }

    let database = await firebase.database();
    let ref = await database.ref('info')
    let holder = false;
    
    ref.on('value', data => {
        holder = data.val();
    }, err => {
        console.log(err);

        return;
    });

    setInterval(() => {
        if (holder != false) {
            for (let elm in holder) {
                let each = holder[elm]; 

                if (each['username'] == user) {
                    let number = each['data']['counter'] + 1;
                    let newCounterValue = number;
                    let newAlarmName = number;
                    let obj = {}
        
                    res['index'] = number;
                    obj[newAlarmName] = res;
        
                    database.ref(`info/${elm}/data`).update(obj);
                    database.ref(`info/${elm}/data`).update({'counter': newCounterValue});
                }
            }
        
            alert('It has been successfully added.');
            holder = false;
            location.reload();
        }  
    }, 500);
}

// DISPLAY THE HISTORY SECTION ON HTML
async function show() {
    let success = false;
    let holder = await (new Promise(resolve => {
        firebase.database()
            .ref('info')
            .on('value', snapshot => {
                success = true;
                resolve(snapshot.val());
            }, err => {
                console.log(err);

                resolve(false);
            });
    }));

    if (!success) {
        return;
    }

    let history = document.getElementById('history');

    for (let elm in holder) {
        let each = holder[elm];

        if (each['username'] == user) {
            let data = each['data'];

            for (let course in data) {
                let str = "";
                let sect = data[course]['section'];
                
                if (data[course]['index'] == undefined) {
                    continue;
                }

                str += `INDEX: ${data[course]['index']}\n`;
                str += `- Course: ${data[course]['course']}\n`;
                str += `- Season: ${data[course]['season']}\n`;
                str += `- Year: ${data[course]['year']}\n`;
                str += `- Section: ${sect == '' ? 'ANY' : sect}\n\n`;

                history.innerText += str;
            }
        }
    }
}

// REMOVE A COURSE FROM HISTORY SECTION
async function removeNode() {
    let index = document.getElementById('removal').value;
    let database = await firebase.database();
    let ref = await database.ref(`info`);
    let success = false;

    if (index == undefined || 
        index == '' || 
        isNaN(index) || 
        parseInt(index) <= 0) {
        alert('Please only enter a positive number.');
        
        return;
    }

    let holder = await (new Promise(resolve => {
        ref.on('value', snapshot => {
                success = true;
                resolve(snapshot.val());
            }, err => {
                console.log(err);

                resolve(false);
            });
    }));

    if (!success) {
        return;
    }

    for (let elm in holder) {
        let each = holder[elm]; 

        if (each['username'] == user) {
            ref = await (new Promise(resolve => {
                resolve(database.ref(`info/${elm}/data/${index}`));
            }));

            ref.remove()
                .then(() => {
                    alert("The alarm has been successfully removed.");
                    location.reload();
                }).catch(error => {
                    console.log("Error: " + error.message);

                    location.reload();
                });
        }
    }
}