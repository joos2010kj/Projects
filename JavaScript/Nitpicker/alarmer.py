import smtplib
import requests
import time
from bs4 import BeautifulSoup
from firebase import firebase

def get_website(course, season, year):
    season = '01' if season.lower() == 'spring' else '08'
    course = course.lower()
    term = str(year) + season

    url = 'https://app.testudo.umd.edu/soc/search?courseId' + \
          '={}&sectionId=&termId={}'.format(course, term) + \
          '&_openSectionsOnly=on&creditCompare=&credits=&' + \
          'courseLevelFilter=ALL&instructor=&_facetoface=on&_' + \
          'blended=on&_online=on&courseStartCompare=&course' + \
          'StartHour=&courseStartMin=&courseStartAM=&course' + \
          'EndHour=&courseEndMin=&courseEndAM=&teachingCenter=' + \
          'ALL&_classDay1=on&_classDay2=on&_classDay3=on&_class' + \
          'Day4=on&_classDay5=on'

    return url

def collect_course_data(course, season, year, section=None):
    code = -1
    url = get_website(course, season, year)

    req = requests.get(url)
    bs = BeautifulSoup(req.content, 'html.parser')
    rows = bs.select('.section-info-container')

    holder = {}
    report = ''

    for row in rows:
        sect = row.select('.section-id')[0].get_text().strip()
        open = row.select('.open-seats-count')[0].get_text()
        instructor = row.select('.section-instructor')[0].get_text().strip()

        holder[int(sect)] = {'open': int(open), 'instructor': instructor}

    if len(holder) == 0:
        report += 'Either the course name is incorrect or the course is not taught in the semester.'
        code = 1 # Client's issue
    else:
        available_sections = {}

        for k, v in holder.items():
            if v['open'] > 0:
                available_sections[k] = v

        if len(available_sections) == 0:
            report += 'There are no available sections at this moment.'
            code = 2 
        else:
            if section is None:
                report += 'There are {} sections available: \n'.format(len(available_sections))

                for k, v in available_sections.items():
                    report += 'Section {} (Instructor: {}) - {} left. \n'.format(k, v['instructor'], v['open'])

                code = 3 # alert
            else:
                section = int(section)

                if section not in holder:
                    report += 'The section does not exist.'
                    code = 1 # Client's issue
                elif section in available_sections:
                    report += 'Section {} (Instructor: {}) has {} left.'.format(section, available_sections[section]['instructor'], available_sections[section]['open'])
                    code = 3 # alert
                else:
                    report += 'The section does not have any open space.'
                    code = 2
    
    return code, report

def send_mail(receipient, txt, course):
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.ehlo()
    server.starttls()
    server.ehlo()

    server.login('nitpicker.umd@gmail.com', '*******') # undisclosed

    subject = 'UMD Seat Tweeter: Seat Information for {}'.format(course.upper())
    body = txt

    msg = "Subject: {}\n\n{}".format(subject, body)

    server.sendmail(
        'nitpicker.umd@gmail.com',
        receipient,
        msg
    )

    server.quit()

def determine(arr):
    for each in arr:
        course = each['course']
        season = each['season']
        year = each['year']
        section = each['section']

        res = collect_course_data(course, season, year, section)
        inform = False

        if res[0] == 1 or res[0] == 3:
            inform = True
        
        if inform:
            send_mail(each['receipient'], res[1], course)
        
def pull_all_info(result):
  arr = []

  for each in result.keys():
    person = result[each]
    simplified_data = pull_info(person)

    arr.append(simplified_data)

  return arr
  
def pull_info(info):
  email = info['username']
  data = info['data']
  
  personal_data = []

  for each in data.keys():
    if each.isdigit():
      each = data[each]

      alarm = {
         'course': each['course'],
         'season': each['season'],
         'section': each['section'],
         'year': each['year'],
         'receipient': email
      }

      if len(str(alarm['section'])) == 0:
        alarm['section'] = None

      personal_data.append(alarm)
  
  return personal_data

def determine_all(group):
    for person in group:
        determine(person)

    print('SENDING COMPLETE')


firebase = firebase.FirebaseApplication('********') # undisclosed

result = firebase.get('/info/', None)
data = pull_all_info(result)
determine_all(data)

print('done')
