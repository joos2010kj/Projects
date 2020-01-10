# Projects

This repo has a collection of projects I have made.

Projects will be initially separated by the language it was made in -- Java & JavaScript.

Each project in this repo will have a "Screen Shot" folder where one or two screenshot(s) of the program will be stored.

If you are interested, please feel free to try them yourself by downloading the program!

### JAVA
1. [Tutor-Client Schedule Builder](https://github.com/joos2010kj/Projects/tree/master/Java/Schedule%20Overlapper)
    - Tutor-Client Schedule Builder helps to find an ideal time for an event. This may also be used between a tutor and a client to determine an ideal session time by, first, having both of them select all the available times in a week using the program, and, next, having the program find and list the overlapping time frames in order of the users’ preference. It has several features for convenience, including Jumping-by-Hour feature, Interval feature, and Saving feature.  
    
        *[SCREENSHOT](https://github.com/joos2010kj/Projects/blob/master/Java/Schedule%20Overlapper/Screen%20Shot/SS2.png)*
    
### JAVASCRIPT
1. [Treasure Hunt](https://github.com/joos2010kj/Projects/tree/master/JavaScript/Treasure%20Hunt)
    - Treasure Hunt is part of an online multiplayer game project I am currently working on.  In Treasure Hunt, every object is denoted by its own unique color, as following:
    
        - Open Field: BLACK
        - Uncrossable Barrier: WHITE
        - Player: GREEN
        - Monster: RED
        - TREASURE: PURPLE
    
        The objective of Treasure Hunt is to collect all the treasures in the map by stepping on it, while avoiding contacts with monsters.  Monsters, which will later be developed into other players in a multiplayer game, are animate bots, and they have the power to "eat" both the player and treasures.  Once any monster makes a direct contact with the player, the player dies, and the player can restart the game by refreshing the page.  Thus, it is in the player's advantage to act quickly.  As a guide, the shape of the map that the player is in is shown in the upper left corner.
    
        Partial credits of this project is given to John Conway, whose "Game of Life" algorithm helped me come up with an algorithm for randomly-generated contiguous lands.
        
        [GAME URL](http://treasure-hunt.unaux.com)
    
        *[SCREENSHOT 1-8](https://github.com/joos2010kj/Projects/tree/master/JavaScript/Treasure%20Hunt/SS)*
        
2. [ALD Point Calculator](https://github.com/joos2010kj/Projects/tree/master/JavaScript/ALD%20Point%20Calculator)
    - ALD Point Calculator is a system that calculates the number of points required in order for a member to receive an honor cord at the time of his/her graduation.  
    
    The point system works such that a member needs to acquire a total of 18 points (3 points * 6 semesters) by graduation, or 3 points per semester if not graduating in a typical four years.  We do not take into account the first semester or the semester an individual was inducted; thus three years worth of points if graduating in four years.  
    
    For example, if one was inducted in Fall 2018 and graduating in Fall 2020, then the individual needs 3 points (Spring 2019) + 3 points (Fall 2019) + 3 points (Spring 2020) + 3 points (Fall 2020) = 12 points in total.  
    
    I have heard from the board of executives that they are struggling with an excessive number of point calculation requests from members.  On behalf of University of Maryland's Alpha Lambda Delta Honor Society, I have created a point calculator based on the client's input and the retrieved data on members' induction date from the server.
    
    Feel free to test it out by entering my information as I am a member of ALD myself.
    - First name: Hyekang
    - Last name: Joo
    - Grad Date: Fall 2020
    - Required # of Points: 12
    
    [Calculator Link](https://go.umd.edu/aldpoints)

### JAVASCRIPT + PYTHON
1. [Nitpicker](https://github.com/joos2010kj/Projects/tree/master/JavaScript/Nitpicker)
    - Made for the students of University of Maryland, Nitpicker is an application that informs clients of the availability of the courses the clients ordered Nitpicker to check.  Once Nitpicker finds a course with an open seat among the client's wish list, Nitpicker alerts the client through an e-mail.
    
    For a more detailed information on how it operates please read below:
    
    1) A client needs to make an account for himself/herself at http://nitpickers.unaux.com/ first.  Then the information on the information is sent to Google's Firebase (database).  The JavaScript algorithm performs a duplication check, and determines whether to approve of the new account.  Once approved, then the client may log-in.
    
    2) The client enters the information of the course he or she is interested in taking but has no seat left in ALARM SETUP box. The section number (e.g. 0101) is optional, but the client must specify the following three:
      - Course ID (e.g. CMSC422)
      - Season (e.g. Spring)
      - Year (e.g. 2020)

    3) Once the client enters the information, JavaScript and Python algorithm will send the information to Firebase.  Then the data on the course the client signed up for, along with all the other courses the client previously had signed up for, will retrieved from Firebase and will be shown in HISTORY box. If not seen, then please refresh the page.

    4) Now, Nitpicker will be checking all the courses in every client's HISTORY box every 10 minutes.  My Python algorithm, which performs a web-scraping, a determination of whether a course has an open seat (and how many), and an email-sending, is designed to perform the operation every 10 minutes using CRON and Amazon EC2 Instance (Amazon Linux).   Afterwards, Nitpicker e-mails every applicable client (to the email they signed up with) if an open seat is found for the course. Keep in mind that Nitpicker does not email the client if there is no open seat found for the course.
    
    Please keep in mind that Nitpicker was christened "Nitpicker" because it "pesters" a client every 10 minutes with an e-mail once it finds an open seat until he or she tells it to STOP.

    Therefore, once he or she receives an email from Nitpicker, it is advised that they try to register the course as soon as possible and then follow the steps below to command it to stop:
    1) If taken a look at each registered course inside HISTORY box, one could see that each course has an INDEX value (e.g. INDEX: 3).
    2) Find the course one would like to remove from HISTORY box, and remember the INDEX value of the course.
    3) Go to REMOVAL box, and enter the number (e.g. 3), and hit submit.
    Then one will see the course disappear from HISTORY. If somehow everything goes missing in HISTORY box, please refresh the page.

    [Nitpicker Link](http://nitpickers.unaux.com/)
