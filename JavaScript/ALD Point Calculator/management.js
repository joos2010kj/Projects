let log
const targetUrl ='https://www.dropbox.com/s/ed9u3qtcrrmt6qc/j1yfl-9lhy5.json?dl=1'
const proxyUrl = 'https://cors-anywhere.herokuapp.com/'

// fetch the json data
fetch(`${proxyUrl}${targetUrl}`)
    .then(res => res.json())
    .then(data => {
        log = data
    })
    .catch(e => {
        console.log(e)
        return e
    })

function preload() {
    const time = new Date()
    let div = document.getElementById('gradYears')

    for (let i = 0; i < 4; i++) {
        let id = time.getFullYear() + i

        let year = document.createElement('div')
        year.innerHTML = id + ' '
        year.name = id

        let radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'year'
        radio.value = id

        year.appendChild(radio)
        div.appendChild(year)
    }

    div = document.getElementById('gradSeasons')

    for (element of ['Spring', 'Fall']) {
        let season = document.createElement('div')
        season.innerHTML = element + ' '
        season.name = element

        let radio = document.createElement('input')
        radio.type = 'radio'
        radio.name = 'season'
        radio.value = element

        season.appendChild(radio)
        div.appendChild(season)
    }
}

function retrieveInfo() {
    const firstname = document.getElementById('firstname').value
    const middlename = document.getElementById('middlename').value
    const lastname = document.getElementById('lastname').value
    const gradYears = document.getElementsByName('year')
    const gradSeasons = document.getElementsByName('season')
    let gradYear, gradSeason

    for (yr of gradYears) {
        if (yr.checked) {
            gradYear = yr.value
        }
    }

    for (season of gradSeasons) {
        if (season.checked) {
            gradSeason = season.value
        }
    }

    return {
        'First': firstname,
        'Middle': middlename,
        'Last': lastname,
        'Season': gradSeason,
        'Year': gradYear
    }
}

function clicked() {
    let dict = retrieveInfo()

    perform(dict)
}

function perform(personInfo) {
    let search = []
    let firstName = personInfo['First'].toLowerCase()
    let middleName = personInfo['Middle'].toLowerCase()
    let lastName = personInfo['Last'].toLowerCase()
    let gradTime = getGradTime()
    let foundPerson
    let result
    let points

    if (firstName == '' || lastName == '' ||
        gradTime['season'] == undefined || gradTime['year'] == undefined) {
        alert('Please complete the form first.')
        return
    }

    for (let i = 0; i < log.length; i++) {
        let other = log[i]
        let otherName = other['First'].toLowerCase() + ' ' + other['Last'].toLowerCase()
        let currentName = firstName + ' ' + lastName

        if (otherName == currentName) {
            search.push(other)
        }
    }

    if (search.length == 0) {
        result = 1  // Code 1: not found in the database
    } else if (search.length == 1) {
        result = 2  // Code 2: one matching person found in the database
        foundPerson = search[0]
        points = calculatePoints(gradTime['season'], gradTime['year'], foundPerson['Induct Date'])
    } else if (search.length >= 2) { // Need to check the middle name
        foundPerson = thoroughSearch(middleName, search)

        if (foundPerson[0] == -1) {
            result = 3  // Code 3: multiple people found, but no matching middle name
        } else if (foundPerson[0] == 1) {
            result = 4  // Code 4: multiple people found, and the matching person found w/ middle name
            foundPerson = foundPerson[1]
            points = calculatePoints(gradTime['season'], gradTime['year'], foundPerson['Induct Date'])
        }
    }

    if (points == -1) {
        alert('Please check your graduation year.')
    } else {
        if (result == 1) {
            alert("No result found.")
        } else if (result == 2 || result == 4) {
            report = `${foundPerson['First']} ${foundPerson['Last']} was inducted in ${foundPerson['Induct Date']}`
            alert(`${report} and needs ${points} points in order to receive a cord.`)
        } else if (result == 3) {
            alert("Please check the middle name.")
        }
    }
}

// When more than one person is found after performing the search,
// this method is called for a middle name comparison
function thoroughSearch(target, search) {
    let sought = target.charAt(0).toLowerCase()
    let holder = []

    for (let i = 0; i < search.length; i++) {
        let other = search[i]['Middle'].charAt(0).toLowerCase()

        if (other == sought) {
            holder.push(search[i])
        }
    }

    if (holder.length == 0) {
        return [-1, null] // incorrect middle name
    } else if (holder.length == 1) {
        return [1, holder[0]] // correctly found
    } else {  // 2 or more people with the same middle name initial found
        let bestRatio = 0
        let bestHolder = null;

        holder.forEach(elm => {
            let res = stringComparison(target, elm['Middle'])

            if (res > bestRatio) {
                bestRatio = res
                bestHolder = elm
            }
        })

        if (bestRadio == 0) {
            return [-1, null] // minor middle name mismatch (e.g. Frey v. Fred)
        } else {
            return [1, bestHolder] // matching middle name found
        }
    }
}

// Calculate the matching ratio between two strings
function stringComparison(str1, str2) {
    str1 = str1.trim().toLowerCase()
    str2 = str2.trim().toLowerCase()

    if (str1.charAt(str1.length - 1) == '.') {
        str1 = str1.substring(0, str1.length - 1)
    }

    if (str2.charAt(str2.length - 1) == '.') {
        str2 = str2.substring(0, str2.length - 1)
    }

    console.log(str1 + ',' + str2)

    let len = Math.min(str1.length, str2.length)
    let counter = 0

    for (let i = 0; i < len; i++) {
        if (str1.charAt(i) == str2.charAt(i)) {
            counter++
        } else {
            return -1
        }
    }

    return counter / str2.length
}

// Calculate the number of points required based on the year and season
// of graduation and the induction date of the person in question
function calculatePoints(gradSeason, gradYear, inductionDate) {
    const REQUIREMENT_PER_SEM = 3
    const re = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/g
    let date = inductionDate.replace(re, '$1 $2 $3')

    date = date.split(' ')
    if (date.length != 3) {
        alert('Database Internal Issue; Please contact Hyekang Joo.')
        return
    }

    const studentInductionDate = {
        'month': date[0],
        'day': date[1],
        'year': date[2],
        'season': date[0] <= 6 ? 'Spring' : 'Fall'
    }

    let yearsLeft = gradYear - studentInductionDate['year']
    let points = REQUIREMENT_PER_SEM * 2 * yearsLeft
    
    if (studentInductionDate['season'] != gradSeason) {
        if (studentInductionDate['season'] == 'Spring' && gradSeason == 'Fall') {
            points += REQUIREMENT_PER_SEM
        } else {
            points -= REQUIREMENT_PER_SEM
        }
    }

    if (points < 0) {
        return -1
    } else {
        return points
    }
}

// Retrieve the year and season of graduation from html
function getGradTime() {
    let yrs = document.getElementsByName('year')
    let seasons = document.getElementsByName('season')
    let checkedYr, checkedSeason

    yrs.forEach(yr => {
        if (yr.checked) {
            checkedYr = yr.value
        }
    })

    seasons.forEach(season => {
        if (season.checked) {
            checkedSeason = season.value
        }
    })

    return {'year': checkedYr, 'season': checkedSeason}
}