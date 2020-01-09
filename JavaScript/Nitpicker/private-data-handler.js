let user;
let historyMap;

function setup() {
    noCanvas();

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

    show();
    
}

function draw() {
    noLoop();
}

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

    return {'course': course, 
            'section': section, 
            'year': year, 
            'season': season};
}

async function execute() {
    let res = store();

    if (res['course'] == undefined || 
        res['season'] == undefined || 
        res['year'] == undefined) {
        alert('Please complete the form.');
        return;
    }

    console.log(res)

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
        let each = holder[elm]; 
        if (each['username'] == user) {
            let number = each['data']['counter'] + 1;
            let newCounterValue = number;
            let newAlarmName = number;
            let obj = {}

            res['index'] = number;
            obj[newAlarmName] = res

            database.ref(`info/${elm}/data`).update(obj);
            database.ref(`info/${elm}/data`).update({'counter': newCounterValue});
        }
    }

    alert('It has been successfully added.');
    location.reload();
}

async function show() {
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

async function removeNode() {
    let index = document.getElementById('removal').value;
    let database = await firebase.database();
    let ref = await database.ref(`info`);
    let holder;

    if (index == undefined || 
        index == '' || 
        isNaN(index) || 
        parseInt(index) <= 0) {
        alert('Please only enter a positive number.');
        return;
    }

    ref.on('value', data => {
        holder = data.val();
    }, err => {
        console.log(err);
        return;
    })

    await new Promise(r => setTimeout(r, 2000));

    for (let elm in holder) {
        let each = holder[elm]; 

        if (each['username'] == user) {
            ref = await database.ref(`info/${elm}/data/${index}`);

            await new Promise(r => setTimeout(r, 2000));

            ref.remove()
            .then(function() {
                alert("The alarm has been successfully removed.");
                location.reload();
            })
            .catch(function(error) {
                console.log("Remove failed: " + error.message)
                location.reload();
            });
        }
    }
}